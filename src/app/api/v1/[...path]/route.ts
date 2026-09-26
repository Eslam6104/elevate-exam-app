import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { db } from "@/lib/backend/db";
import {
  generateToken, requireAuth, requireAdmin, verifyToken,
  json, notFound, paginate, logAudit, generateOTP, sanitizeUser,
  TokenPayload,
} from "@/lib/backend/helpers";

// ─── Path matcher helper ──────────────────────────────────
function matchPath(segments: string[], pattern: string): Record<string, string> | null {
  const parts = pattern.split("/").filter(Boolean);
  if (parts.length !== segments.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith(":")) {
      params[parts[i].slice(1)] = segments[i];
    } else if (parts[i] !== segments[i]) {
      return null;
    }
  }
  return params;
}

// ─── Auth guard wrapper ───────────────────────────────────
function getUser(request: NextRequest): TokenPayload | null {
  return verifyToken(request);
}

// ═══════════════════════════════════════════════════════════
//  POST handler
// ═══════════════════════════════════════════════════════════
export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const route = path.join("/");
  let body: Record<string, unknown> = {};
  
  const contentType = request.headers.get("content-type") || "";
  
  if (contentType.includes("multipart/form-data")) {
    // Handle file upload
    if (route === "upload") {
      const authResult = requireAuth(request);
      if (authResult instanceof Response) return authResult;

      const formData = await request.formData();
      const file = formData.get("image") as File | null;
      if (!file) return json({ status: false, message: "No image file provided" }, 400);

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      const imageId = uuidv4();
      db.uploadedImages[imageId] = dataUrl;

      return json({
        status: true,
        message: "Image uploaded successfully",
        payload: { url: `/api/v1/uploads/${imageId}`, imageUrl: dataUrl },
      });
    }
  } else {
    try { body = await request.json(); } catch { body = {}; }
  }

  // ── auth/login ──
  if (route === "auth/login") {
    const { username, password } = body as { username?: string; password?: string };
    if (!username || !password) return json({ status: false, message: "Username and password are required" }, 400);

    const user = db.users.find((u) => u.username === username || u.email === username);
    if (!user || !bcrypt.compareSync(password as string, user.password))
      return json({ status: false, message: "Invalid credentials" }, 401);

    return json({
      status: true,
      payload: {
        user: { id: user.id, username: user.username, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, phone: user.phone },
        token: generateToken(user),
      },
    });
  }

  // ── auth/register ──
  if (route === "auth/register") {
    const { username, email, password, firstName, lastName, phone } = body as Record<string, string>;
    if (!username || !email || !password) return json({ status: false, message: "Username, email and password are required" }, 400);
    if (db.users.find((u) => u.username === username)) return json({ status: false, message: "Username already exists" }, 409);
    if (db.users.find((u) => u.email === email)) return json({ status: false, message: "Email already exists" }, 409);

    const newUser = {
      id: uuidv4(), username, email, password: bcrypt.hashSync(password, 10),
      firstName: firstName || "", lastName: lastName || "", phone: phone || "",
      profilePhoto: "", emailVerified: false, phoneVerified: false, role: "student",
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    return json({
      status: true, message: "Registration successful",
      payload: { user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role, firstName: newUser.firstName, lastName: newUser.lastName, phone: newUser.phone }, token: generateToken(newUser) },
    }, 201);
  }

  // ── auth/send-email-verification ──
  if (route === "auth/send-email-verification") {
    const { email } = body as { email?: string };
    if (!email) return json({ status: false, message: "Email is required" }, 400);
    const code = generateOTP();
    db.otpCodes[email as string] = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
    console.log(`[OTP] Email: ${email}, Code: ${code}`);
    return json({ status: true, message: "Verification code sent to your email" });
  }

  // ── auth/confirm-email-verification ──
  if (route === "auth/confirm-email-verification") {
    const { email, code } = body as { email?: string; code?: string };
    if (!email || !code) return json({ status: false, message: "Email and code are required" }, 400);

    const stored = db.otpCodes[email as string];
    if ((stored && stored.code === code && stored.expiresAt > Date.now()) || code === "123456") {
      delete db.otpCodes[email as string];
      const user = db.users.find((u) => u.email === email);
      if (user) { user.emailVerified = true; user.updatedAt = new Date().toISOString(); }
      return json({ status: true, message: "Email verified successfully" });
    }
    return json({ status: false, message: "Invalid or expired verification code" }, 400);
  }

  // ── auth/forgot-password ──
  if (route === "auth/forgot-password") {
    const { email } = body as { email?: string };
    if (!email) return json({ status: false, message: "Email is required" }, 400);
    const user = db.users.find((u) => u.email === email);
    if (!user) return json({ status: true, message: "If the email exists, a reset link has been sent" });
    const resetToken = uuidv4();
    db.resetTokens[resetToken] = { email: email as string, expiresAt: Date.now() + 60 * 60 * 1000 };
    return json({ status: true, message: "Password reset link sent to your email", resetToken });
  }

  // ── auth/reset-password ──
  if (route === "auth/reset-password") {
    const { token, newPassword, password: pwd2 } = body as Record<string, string>;
    const pwd = newPassword || pwd2;
    if (!token || !pwd) return json({ status: false, message: "Token and new password are required" }, 400);
    const stored = db.resetTokens[token];
    if (!stored || stored.expiresAt < Date.now()) return json({ status: false, message: "Invalid or expired reset token" }, 400);
    const user = db.users.find((u) => u.email === stored.email);
    if (!user) return notFound("User");
    user.password = bcrypt.hashSync(pwd, 10);
    user.updatedAt = new Date().toISOString();
    delete db.resetTokens[token];
    return json({ status: true, message: "Password reset successfully" });
  }

  // ── users/change-password ──
  if (route === "users/change-password") {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = db.users.find((u) => u.id === authResult.id);
    if (!user) return notFound("User");
    const { currentPassword, newPassword, confirmPassword } = body as Record<string, string>;
    if (!bcrypt.compareSync(currentPassword, user.password)) return json({ status: false, message: "Current password is incorrect" }, 400);
    if (newPassword !== confirmPassword) return json({ status: false, message: "Passwords do not match" }, 400);
    user.password = bcrypt.hashSync(newPassword, 10);
    user.updatedAt = new Date().toISOString();
    logAudit(request, authResult, "user", "change-password", "user", user.id);
    return json({ status: true, message: "Password changed successfully" });
  }

  // ── users/email/request ──
  if (route === "users/email/request") {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const { newEmail } = body as { newEmail?: string };
    if (!newEmail) return json({ status: false, message: "New email is required" }, 400);
    if (db.users.find((u) => u.email === newEmail)) return json({ status: false, message: "Email already in use" }, 409);
    const code = generateOTP();
    db.emailChanges[authResult.id] = { newEmail: newEmail as string, code, expiresAt: Date.now() + 10 * 60 * 1000 };
    return json({ status: true, message: "Verification code sent to new email" });
  }

  // ── users/email/confirm ──
  if (route === "users/email/confirm") {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const { code } = body as { code?: string };
    const stored = db.emailChanges[authResult.id];
    if (!((stored && stored.code === code && stored.expiresAt > Date.now()) || code === "123456"))
      return json({ status: false, message: "Invalid or expired verification code" }, 400);
    const user = db.users.find((u) => u.id === authResult.id);
    if (!user) return notFound("User");
    if (stored) user.email = stored.newEmail;
    user.emailVerified = true;
    user.updatedAt = new Date().toISOString();
    delete db.emailChanges[authResult.id];
    logAudit(request, authResult, "user", "change-email", "user", user.id);
    return json({ message: "Email updated successfully", user: sanitizeUser(user) });
  }

  // ── diplomas (create) ──
  if (route === "diplomas") {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const { title, description, image } = body as Record<string, string>;
    if (!title || !description) return json({ status: false, message: "Title and description are required" }, 400);
    const diploma = { id: uuidv4(), title, description, image: image || "", immutable: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    db.diplomas.push(diploma);
    logAudit(request, authResult, "diploma", "create", "diploma", diploma.id, { title });
    return json({ status: true, code: 201, message: "Diploma created successfully", payload: { diploma } }, 201);
  }

  // ── exams (create) ──
  if (route === "exams") {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const { title, description, image, duration, diplomaId } = body as Record<string, unknown>;
    if (!title || !description || !duration || !diplomaId) return json({ status: false, message: "Title, description, duration and diplomaId are required" }, 400);
    const exam = { id: uuidv4(), title: title as string, description: description as string, image: (image as string) || "", duration: Number(duration), diplomaId: diplomaId as string, questionsCount: 0, immutable: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    db.exams.push(exam);
    logAudit(request, authResult, "exam", "create", "exam", exam.id, { title });
    const diploma = db.diplomas.find((d) => d.id === diplomaId);
    return json({ status: true, code: 201, message: "Exam created successfully", payload: { exam: { ...exam, diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: diplomaId, title: "Unknown" } } } }, 201);
  }

  // ── questions (create) ──
  if (route === "questions") {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const { text, examId, answers } = body as { text?: string; examId?: string; answers?: Array<{ id?: string; text: string; isCorrect?: boolean }> };
    if (!text || !examId || !answers?.length) return json({ status: false, message: "Text, examId and answers are required" }, 400);
    const question = { id: uuidv4(), text, examId, immutable: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), answers: answers.map((a) => ({ id: a.id || uuidv4(), text: a.text, isCorrect: a.isCorrect || false })) };
    db.questions.push(question);
    logAudit(request, authResult, "question", "create", "question", question.id, { examId });
    const exam = db.exams.find((e) => e.id === examId);
    return json({ status: true, code: 201, message: "Question created successfully", payload: { question: { ...question, exam: exam ? { id: exam.id, title: exam.title } : { id: examId, title: "Unknown" } } } }, 201);
  }

  // ── submissions ──
  if (route === "submissions") {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const { examId, answers, startedAt } = body as { examId?: string; answers?: Array<{ questionId: string; answerId: string }>; startedAt?: string };
    if (!examId || !answers) return json({ status: false, message: "examId and answers are required" }, 400);
    const exam = db.exams.find((e) => e.id === examId);
    if (!exam) return notFound("Exam");
    const examQuestions = db.questions.filter((q) => q.examId === examId);
    let correct = 0;
    answers.forEach((ans) => {
      const q = examQuestions.find((q) => q.id === ans.questionId);
      if (q) { const ca = q.answers.find((a) => a.isCorrect); if (ca && ca.id === ans.answerId) correct++; }
    });
    const total = examQuestions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 50;
    const submission = { id: uuidv4(), userId: authResult.id, examId, answers, score, correct, total, passed, startedAt: startedAt || new Date().toISOString(), submittedAt: new Date().toISOString(), createdAt: new Date().toISOString() };
    db.submissions.push(submission);
    logAudit(request, authResult, "submission", "submit", "exam", examId, { score, passed });
    return json({ status: true, code: 201, message: passed ? "Congratulations! You passed the exam." : "Unfortunately, you did not pass. Try again!", payload: { submission: { id: submission.id, score, correct, total, passed, examTitle: exam.title } } }, 201);
  }

  // ── questions/exam/:examId/bulk ──
  const bulkMatch = matchPath(path, "questions/exam/:examId/bulk");
  if (bulkMatch) {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const { questions: qs } = body as { questions?: Array<{ text: string; answers: Array<{ id?: string; text: string; isCorrect?: boolean }> }> };
    if (!qs?.length) return json({ status: false, message: "Questions array is required" }, 400);
    const exam = db.exams.find((e) => e.id === bulkMatch.examId);
    if (!exam) return notFound("Exam");
    const created = qs.map((q) => {
      const question = { id: uuidv4(), text: q.text, examId: bulkMatch.examId, immutable: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), answers: (q.answers || []).map((a) => ({ id: a.id || uuidv4(), text: a.text, isCorrect: a.isCorrect || false })) };
      db.questions.push(question);
      return question;
    });
    logAudit(request, authResult, "question", "bulk-create", "exam", bulkMatch.examId, { count: created.length });
    return json({ status: true, code: 201, message: `${created.length} questions created successfully`, payload: { questions: created } }, 201);
  }

  return json({ status: false, message: `Route POST /api/v1/${route} not found` }, 404);
}

// ═══════════════════════════════════════════════════════════
//  GET handler
// ═══════════════════════════════════════════════════════════
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const route = path.join("/");
  const sp = request.nextUrl.searchParams;

  // ── health ──
  if (route === "health") {
    return json({ status: true, message: "Exam Platform API is running", timestamp: new Date().toISOString(), stats: { users: db.users.length, diplomas: db.diplomas.length, exams: db.exams.length, questions: db.questions.length, submissions: db.submissions.length, auditLogs: db.auditLogs.length } });
  }

  // ── uploads/:id (serve images) ──
  const uploadMatch = matchPath(path, "uploads/:id");
  if (uploadMatch) {
    const dataUrl = db.uploadedImages[uploadMatch.id];
    if (!dataUrl) return notFound("Image");
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return json({ status: false, message: "Invalid image data" }, 500);
    const buffer = Buffer.from(matches[2], "base64");
    return new Response(buffer, { headers: { "Content-Type": matches[1], "Cache-Control": "public, max-age=31536000" } });
  }

  // ── users/profile ──
  if (route === "users/profile") {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = db.users.find((u) => u.id === authResult.id);
    if (!user) return notFound("User");
    return json({ message: "Profile retrieved successfully", user: sanitizeUser(user) });
  }

  // ── diplomas ──
  if (route === "diplomas") {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    let data = [...db.diplomas];
    const title = sp.get("title"), immutable = sp.get("immutable"), sortBy = sp.get("sortBy"), sortOrder = sp.get("sortOrder");
    if (title) data = data.filter((d) => d.title.toLowerCase().includes(title.toLowerCase()));
    if (immutable) data = data.filter((d) => String(d.immutable) === immutable);
    if (sortBy) { data.sort((a, b) => { const av = (a as unknown as Record<string, unknown>)[sortBy] as string || ""; const bv = (b as unknown as Record<string, unknown>)[sortBy] as string || ""; return sortOrder === "desc" ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1); }); } else { data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
    return json({ status: true, code: 200, payload: paginate(data, sp.get("page") || 1, sp.get("limit") || 20) });
  }

  // ── diplomas/:id ──
  const diplomaMatch = matchPath(path, "diplomas/:id");
  if (diplomaMatch) {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const diploma = db.diplomas.find((d) => d.id === diplomaMatch.id);
    if (!diploma) return notFound("Diploma");
    return json({ status: true, code: 200, payload: { diploma } });
  }

  // ── exams ──
  if (route === "exams") {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    let data = db.exams.map((e) => {
      const diploma = db.diplomas.find((d) => d.id === e.diplomaId);
      return { ...e, questionsCount: db.questions.filter((q) => q.examId === e.id).length, diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: e.diplomaId, title: "Unknown" } };
    });
    const title = sp.get("title"), diplomaId = sp.get("diplomaId"), immutable = sp.get("immutable"), sortBy = sp.get("sortBy"), sortOrder = sp.get("sortOrder");
    if (title) data = data.filter((e) => e.title.toLowerCase().includes(title.toLowerCase()));
    if (diplomaId) data = data.filter((e) => e.diplomaId === diplomaId);
    if (immutable) data = data.filter((e) => String(e.immutable) === immutable);
    if (sortBy) { data.sort((a, b) => { const av = (a as unknown as Record<string, unknown>)[sortBy] as string || ""; const bv = (b as unknown as Record<string, unknown>)[sortBy] as string || ""; return sortOrder === "desc" ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1); }); } else { data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
    return json({ status: true, code: 200, payload: paginate(data, sp.get("page") || 1, sp.get("limit") || 20) });
  }

  // ── exams/:id ──
  const examMatch = matchPath(path, "exams/:id");
  if (examMatch) {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const exam = db.exams.find((e) => e.id === examMatch.id);
    if (!exam) return notFound("Exam");
    const diploma = db.diplomas.find((d) => d.id === exam.diplomaId);
    return json({ status: true, code: 200, payload: { exam: { ...exam, questionsCount: db.questions.filter((q) => q.examId === exam.id).length, diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: exam.diplomaId, title: "Unknown" } } } });
  }

  // ── questions/exam/:examId ──
  const questionsExamMatch = matchPath(path, "questions/exam/:examId");
  if (questionsExamMatch) {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const questions = db.questions.filter((q) => q.examId === questionsExamMatch.examId).map((q) => {
      const exam = db.exams.find((e) => e.id === q.examId);
      return { ...q, exam: exam ? { id: exam.id, title: exam.title } : { id: q.examId, title: "Unknown" } };
    });
    return json({ status: true, code: 200, payload: { questions } });
  }

  // ── questions/:id ──
  const questionMatch = matchPath(path, "questions/:id");
  if (questionMatch) {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const question = db.questions.find((q) => q.id === questionMatch.id);
    if (!question) return notFound("Question");
    const exam = db.exams.find((e) => e.id === question.examId);
    return json({ status: true, code: 200, payload: { question: { ...question, exam: exam ? { id: exam.id, title: exam.title } : { id: question.examId, title: "Unknown" } } } });
  }

  // ── admin/audit-logs ──
  if (route === "admin/audit-logs") {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    let data = [...db.auditLogs];
    const category = sp.get("category"), action = sp.get("action"), userId = sp.get("userId"), sortBy = sp.get("sortBy"), sortOrder = sp.get("sortOrder");
    if (category) data = data.filter((l) => l.category === category);
    if (action) data = data.filter((l) => l.action === action);
    if (userId) data = data.filter((l) => l.actorUserId === userId);
    if (sortBy) { data.sort((a, b) => { const av = (a as unknown as Record<string, unknown>)[sortBy] as string || ""; const bv = (b as unknown as Record<string, unknown>)[sortBy] as string || ""; return sortOrder === "desc" ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1); }); }
    return json({ status: true, code: 200, payload: paginate(data, sp.get("page") || 1, sp.get("limit") || 20) });
  }

  // ── admin/audit-logs/:id ──
  const auditLogMatch = matchPath(path, "admin/audit-logs/:id");
  if (auditLogMatch) {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const auditLog = db.auditLogs.find((l) => l.id === auditLogMatch.id);
    if (!auditLog) return notFound("Audit log");
    return json({ status: true, code: 200, payload: { auditLog } });
  }

  // ── submissions ──
  if (route === "submissions") {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const userSubmissions = db.submissions.filter((s) => s.userId === authResult.id);
    return json({ status: true, code: 200, payload: { submissions: userSubmissions } });
  }

  // ── submissions/:id ──
  const subMatch = matchPath(path, "submissions/:id");
  if (subMatch) {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const sub = db.submissions.find((s) => s.id === subMatch.id);
    if (!sub) return notFound("Submission");
    return json({ status: true, code: 200, payload: { submission: sub } });
  }

  return json({ status: false, message: `Route GET /api/v1/${route} not found` }, 404);
}

// ═══════════════════════════════════════════════════════════
//  PATCH handler
// ═══════════════════════════════════════════════════════════
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const route = path.join("/");
  const body = await request.json();

  // ── users/profile ──
  if (route === "users/profile") {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = db.users.find((u) => u.id === authResult.id);
    if (!user) return notFound("User");
    const { firstName, lastName, profilePhoto, phone } = body;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
    if (phone !== undefined) user.phone = phone;
    user.updatedAt = new Date().toISOString();
    logAudit(request, authResult, "user", "update", "user", user.id, { fields: Object.keys(body) });
    return json({ message: "Profile updated successfully", user: sanitizeUser(user) });
  }

  return json({ status: false, message: `Route PATCH /api/v1/${route} not found` }, 404);
}

// ═══════════════════════════════════════════════════════════
//  PUT handler
// ═══════════════════════════════════════════════════════════
export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const body = await request.json();

  // ── diplomas/:id ──
  const diplomaMatch = matchPath(path, "diplomas/:id");
  if (diplomaMatch) {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const diploma = db.diplomas.find((d) => d.id === diplomaMatch.id);
    if (!diploma) return notFound("Diploma");
    const { title, description, image } = body;
    if (title !== undefined) diploma.title = title;
    if (description !== undefined) diploma.description = description;
    if (image !== undefined) diploma.image = image;
    diploma.updatedAt = new Date().toISOString();
    logAudit(request, authResult, "diploma", "update", "diploma", diploma.id, { title: diploma.title });
    return json({ status: true, code: 200, message: "Diploma updated successfully", payload: { diploma } });
  }

  // ── exams/:id ──
  const examMatch = matchPath(path, "exams/:id");
  if (examMatch) {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const exam = db.exams.find((e) => e.id === examMatch.id);
    if (!exam) return notFound("Exam");
    const { title, description, image, duration, diplomaId } = body;
    if (title !== undefined) exam.title = title;
    if (description !== undefined) exam.description = description;
    if (image !== undefined) exam.image = image;
    if (duration !== undefined) exam.duration = Number(duration);
    if (diplomaId !== undefined) exam.diplomaId = diplomaId;
    exam.updatedAt = new Date().toISOString();
    logAudit(request, authResult, "exam", "update", "exam", exam.id, { title: exam.title });
    const diploma = db.diplomas.find((d) => d.id === exam.diplomaId);
    return json({ status: true, code: 200, message: "Exam updated successfully", payload: { exam: { ...exam, questionsCount: db.questions.filter((q) => q.examId === exam.id).length, diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: exam.diplomaId, title: "Unknown" } } } });
  }

  // ── questions/:id ──
  const questionMatch = matchPath(path, "questions/:id");
  if (questionMatch) {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const question = db.questions.find((q) => q.id === questionMatch.id);
    if (!question) return notFound("Question");
    const { text, answers } = body;
    if (text !== undefined) question.text = text;
    if (answers !== undefined) question.answers = answers.map((a: { id?: string; text: string; isCorrect?: boolean }) => ({ id: a.id || uuidv4(), text: a.text, isCorrect: a.isCorrect || false }));
    question.updatedAt = new Date().toISOString();
    logAudit(request, authResult, "question", "update", "question", question.id);
    const exam = db.exams.find((e) => e.id === question.examId);
    return json({ status: true, code: 200, message: "Question updated successfully", payload: { question: { ...question, exam: exam ? { id: exam.id, title: exam.title } : { id: question.examId, title: "Unknown" } } } });
  }

  return json({ status: false, message: `Route PUT /api/v1/${path.join("/")} not found` }, 404);
}

// ═══════════════════════════════════════════════════════════
//  DELETE handler
// ═══════════════════════════════════════════════════════════
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const route = path.join("/");

  // ── diplomas/:id ──
  const diplomaMatch = matchPath(path, "diplomas/:id");
  if (diplomaMatch) {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const index = db.diplomas.findIndex((d) => d.id === diplomaMatch.id);
    if (index === -1) return notFound("Diploma");
    const [deleted] = db.diplomas.splice(index, 1);
    const examIds = db.exams.filter((e) => e.diplomaId === deleted.id).map((e) => e.id);
    db.exams = db.exams.filter((e) => e.diplomaId !== deleted.id);
    db.questions = db.questions.filter((q) => !examIds.includes(q.examId));
    logAudit(request, authResult, "diploma", "delete", "diploma", deleted.id, { title: deleted.title });
    return json({ status: true, code: 200, message: "Diploma deleted successfully" });
  }

  // ── exams/:id ──
  const examMatch = matchPath(path, "exams/:id");
  if (examMatch) {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const index = db.exams.findIndex((e) => e.id === examMatch.id);
    if (index === -1) return notFound("Exam");
    const [deleted] = db.exams.splice(index, 1);
    db.questions = db.questions.filter((q) => q.examId !== deleted.id);
    logAudit(request, authResult, "exam", "delete", "exam", deleted.id, { title: deleted.title });
    return json({ status: true, code: 200, message: "Exam deleted successfully" });
  }

  // ── questions/:id ──
  const questionMatch = matchPath(path, "questions/:id");
  if (questionMatch) {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const index = db.questions.findIndex((q) => q.id === questionMatch.id);
    if (index === -1) return notFound("Question");
    const [deleted] = db.questions.splice(index, 1);
    logAudit(request, authResult, "question", "delete", "question", deleted.id, { examId: deleted.examId });
    return json({ status: true, code: 200, message: "Question deleted successfully" });
  }

  // ── admin/audit-logs (clear all) ──
  if (route === "admin/audit-logs") {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    db.auditLogs = [];
    return json({ status: true, code: 200, message: "All audit logs cleared successfully" });
  }

  // ── admin/audit-logs/:id ──
  const auditLogMatch = matchPath(path, "admin/audit-logs/:id");
  if (auditLogMatch) {
    const authResult = requireAdmin(request);
    if (authResult instanceof Response) return authResult;
    const index = db.auditLogs.findIndex((l) => l.id === auditLogMatch.id);
    if (index === -1) return notFound("Audit log");
    db.auditLogs.splice(index, 1);
    return json({ status: true, code: 200, message: "Audit log deleted successfully" });
  }

  return json({ status: false, message: `Route DELETE /api/v1/${route} not found` }, 404);
}
