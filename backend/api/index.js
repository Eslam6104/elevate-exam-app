const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const app = express();

// ─── Config ───────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "exam-platform-super-secret-key-2024";
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Multer for image upload (in-memory for serverless)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// ─── In-Memory Database ──────────────────────────────────
const db = {
  users: [],
  diplomas: [],
  exams: [],
  questions: [],
  submissions: [],
  auditLogs: [],
  otpCodes: {},       // email -> { code, expiresAt }
  resetTokens: {},    // token -> { email, expiresAt }
  emailChanges: {},   // userId -> { newEmail, code, expiresAt }
  uploadedImages: {}, // id -> base64 data url
};

// ─── Seed Data ────────────────────────────────────────────
function seedDatabase() {
  const pastDate = (hoursAgo) => new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();

  // Create admin user
  const adminId = uuidv4();
  db.users.push({
    id: adminId,
    username: "admin",
    email: "admin@exam-platform.com",
    password: bcrypt.hashSync("Admin@123", 10),
    firstName: "Super",
    lastName: "Admin",
    phone: "01012345678",
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    emailVerified: true,
    phoneVerified: true,
    role: "admin",
    createdAt: pastDate(240),
    updatedAt: pastDate(10),
  });

  // Create student users
  const studentId = uuidv4();
  db.users.push({
    id: studentId,
    username: "student",
    email: "student@exam-platform.com",
    password: bcrypt.hashSync("Student@123", 10),
    firstName: "Alex",
    lastName: "Johnson",
    phone: "01098765432",
    profilePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    emailVerified: true,
    phoneVerified: true,
    role: "student",
    createdAt: pastDate(120),
    updatedAt: pastDate(5),
  });

  const sarahId = uuidv4();
  db.users.push({
    id: sarahId,
    username: "sarah",
    email: "sarah@exam-platform.com",
    password: bcrypt.hashSync("Student@123", 10),
    firstName: "Sarah",
    lastName: "Miller",
    phone: "01122334455",
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    emailVerified: true,
    phoneVerified: true,
    role: "student",
    createdAt: pastDate(80),
    updatedAt: pastDate(2),
  });

  // Create diplomas
  const diplomaDefs = [
    {
      title: "Web Development",
      description: "Master modern web development from HTML5/CSS3 and TypeScript to React 19, Next.js, and serverless backends.",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Data Science & Artificial Intelligence",
      description: "Comprehensive track covering Python, scientific data analysis, statistical modeling, machine learning, and deep neural networks.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Mobile App Development",
      description: "Build robust, cross-platform mobile apps for iOS and Android using Flutter, Dart, React Native, and mobile architecture best practices.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Cyber Security & Ethical Hacking",
      description: "Learn penetration testing, network defense, threat modeling, modern cryptography, and secure authentication systems.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Cloud Computing & DevOps",
      description: "Automate build and deployment pipelines with Docker, Kubernetes, Terraform, AWS cloud services, and CI/CD workflows.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "UI/UX Design & Product Architecture",
      description: "User research methodologies, wireframing, interactive prototyping in Figma, and design systems for enterprise web applications.",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const diplomaIds = [];
  diplomaDefs.forEach((d, idx) => {
    const id = uuidv4();
    diplomaIds.push(id);
    db.diplomas.push({
      id,
      title: d.title,
      description: d.description,
      image: d.image,
      immutable: false,
      createdAt: pastDate(200 - idx * 10),
      updatedAt: pastDate(20 - idx * 2),
    });
  });

  // Create exams with questions
  const examDefs = [
    {
      title: "HTML5 & Modern CSS3 Architecture",
      description: "Test semantic HTML elements, CSS Flexbox, CSS Grid layouts, accessibility standards (a11y), and responsive design principles.",
      duration: 30,
      diplomaId: diplomaIds[0],
      image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&w=400&q=80",
      questions: [
        { text: "Which HTML5 semantic element should encapsulate autonomous, self-contained content intended for independent distribution?", answers: [{ text: "<article>", isCorrect: true }, { text: "<section>", isCorrect: false }, { text: "<div>", isCorrect: false }, { text: "<aside>", isCorrect: false }] },
        { text: "In CSS Grid layout, which CSS property defines the size of grid column tracks?", answers: [{ text: "grid-template-columns", isCorrect: true }, { text: "grid-auto-flow", isCorrect: false }, { text: "column-gap", isCorrect: false }, { text: "grid-column-span", isCorrect: false }] },
        { text: "What does the WCAG accessibility principle 'POUR' stand for?", answers: [{ text: "Perceivable, Operable, Understandable, Robust", isCorrect: true }, { text: "Practical, Open, Universal, Reliable", isCorrect: false }, { text: "Portable, Organized, Usable, Resilient", isCorrect: false }, { text: "Public, Optimal, Uniform, Rapid", isCorrect: false }] },
        { text: "Which CSS Flexbox property controls alignment along the cross axis?", answers: [{ text: "align-items", isCorrect: true }, { text: "justify-content", isCorrect: false }, { text: "flex-direction", isCorrect: false }, { text: "flex-wrap", isCorrect: false }] },
        { text: "What is the purpose of the 'rel=\"noopener noreferrer\"' attribute on external links?", answers: [{ text: "Prevents reverse tabnabbing security exploit and stops passing referrer headers", isCorrect: true }, { text: "Instructs search engines not to crawl the target link", isCorrect: false }, { text: "Forces the browser to cache target page images", isCorrect: false }, { text: "Ensures cookies are sent cross-domain", isCorrect: false }] },
      ],
    },
    {
      title: "JavaScript ES6+ & TypeScript Mastery",
      description: "Advanced JavaScript concepts including closures, prototypes, Event Loop, Promise chaining, generics, and strict TypeScript types.",
      duration: 45,
      diplomaId: diplomaIds[0],
      image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=400&q=80",
      questions: [
        { text: "What is the result of typeof null in JavaScript?", answers: [{ text: "'object'", isCorrect: true }, { text: "'null'", isCorrect: false }, { text: "'undefined'", isCorrect: false }, { text: "'boolean'", isCorrect: false }] },
        { text: "In the JavaScript Event Loop, which queue executes first after the synchronous call stack empties?", answers: [{ text: "Microtask queue (Promises, queueMicrotask)", isCorrect: true }, { text: "Macrotask queue (setTimeout, setInterval)", isCorrect: false }, { text: "Rendering pipeline queue", isCorrect: false }, { text: "Garbage collection queue", isCorrect: false }] },
        { text: "In TypeScript, what is the key difference between 'type' and 'interface' regarding declarations?", answers: [{ text: "Interfaces support declaration merging across multiple blocks; type aliases do not", isCorrect: true }, { text: "Type aliases cannot represent union types", isCorrect: false }, { text: "Interfaces cannot extend other interfaces", isCorrect: false }, { text: "Type aliases only work for primitive types", isCorrect: false }] },
        { text: "Which array method returns a single accumulator value by executing a reducer callback on each element?", answers: [{ text: "Array.prototype.reduce()", isCorrect: true }, { text: "Array.prototype.filter()", isCorrect: false }, { text: "Array.prototype.map()", isCorrect: false }, { text: "Array.prototype.find()", isCorrect: false }] },
        { text: "What does the TypeScript 'unknown' type represent compared to 'any'?", answers: [{ text: "Type-safe counterpart of any requiring narrowing before performing operations", isCorrect: true }, { text: "Represents values that will never occur or return", isCorrect: false }, { text: "Exact equivalent to null and undefined", isCorrect: false }, { text: "Disables all type checking completely", isCorrect: false }] },
      ],
    },
    {
      title: "React 19 & Next.js App Router Architecture",
      description: "Server Components, Server Actions, React Hooks, streaming SSR with Suspense, routing patterns, and state caching.",
      duration: 50,
      diplomaId: diplomaIds[0],
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80",
      questions: [
        { text: "In Next.js App Router, which directive must be placed at the top of a file to turn a Server Component into a Client Component?", answers: [{ text: "\"use client\"", isCorrect: true }, { text: "\"use server\"", isCorrect: false }, { text: "\"use client-side\"", isCorrect: false }, { text: "\"use dynamic\"", isCorrect: false }] },
        { text: "What is the primary benefit of React Server Components (RSC)?", answers: [{ text: "Zero client-side JavaScript bundle impact for server dependencies and fast initial load", isCorrect: true }, { text: "Ability to use useState and useEffect directly on the server", isCorrect: false }, { text: "Direct DOM manipulation from server functions", isCorrect: false }, { text: "Replacement for database engines", isCorrect: false }] },
        { text: "Which React hook is designed to memoize the result of an expensive calculation between re-renders?", answers: [{ text: "useMemo()", isCorrect: true }, { text: "useCallback()", isCorrect: false }, { text: "useRef()", isCorrect: false }, { text: "useEffect()", isCorrect: false }] },
        { text: "What is the purpose of the 'revalidatePath' function in Next.js Server Actions?", answers: [{ text: "Clears the Next.js Data Cache and re-renders server content for a specific route", isCorrect: true }, { text: "Redirects the user to an error page", isCorrect: false }, { text: "Deletes the user's browser session cookie", isCorrect: false }, { text: "Compiles TypeScript files on the client", isCorrect: false }] },
        { text: "In React 19, what does the new 'useActionState' hook provide?", answers: [{ text: "Manages state based on the result of an async form action (pending, state, formAction)", isCorrect: true }, { text: "Replaces the global Redux store entirely", isCorrect: false }, { text: "Connects web sockets automatically", isCorrect: false }, { text: "Renders canvas animations", isCorrect: false }] },
      ],
    },
    {
      title: "Python Data Analysis with Pandas & NumPy",
      description: "Data manipulation, vectorized operations, missing data handling, indexing, group-by aggregations, and tabular transformations.",
      duration: 40,
      diplomaId: diplomaIds[1],
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=400&q=80",
      questions: [
        { text: "In Pandas, which method is used to aggregate data by one or more columns?", answers: [{ text: "df.groupby()", isCorrect: true }, { text: "df.aggregate_by()", isCorrect: false }, { text: "df.split()", isCorrect: false }, { text: "df.cluster()", isCorrect: false }] },
        { text: "What is the primary difference between Pandas .loc and .iloc indexers?", answers: [{ text: ".loc uses label-based indexing while .iloc uses integer position-based indexing", isCorrect: true }, { text: ".iloc uses label-based indexing while .loc uses integer indexing", isCorrect: false }, { text: ".loc only selects columns while .iloc only selects rows", isCorrect: false }, { text: "There is no difference between them", isCorrect: false }] },
        { text: "Which NumPy function computes the arithmetic mean along a specified axis?", answers: [{ text: "np.mean()", isCorrect: true }, { text: "np.average_sum()", isCorrect: false }, { text: "np.median()", isCorrect: false }, { text: "np.std()", isCorrect: false }] },
        { text: "In a Pandas DataFrame, which method fills missing NaN values with a designated value or interpolation method?", answers: [{ text: "df.fillna()", isCorrect: true }, { text: "df.dropna()", isCorrect: false }, { text: "df.replace_null()", isCorrect: false }, { text: "df.clean_na()", isCorrect: false }] },
        { text: "What does broadcasting in NumPy refer to?", answers: [{ text: "How NumPy treats arrays with different shapes during arithmetic operations", isCorrect: true }, { text: "Sending array data across a local network socket", isCorrect: false }, { text: "Serializing arrays to disk in binary format", isCorrect: false }, { text: "Plotting charts to the standard output", isCorrect: false }] },
      ],
    },
  ];

  examDefs.forEach((e, idx) => {
    const examId = uuidv4();
    db.exams.push({
      id: examId,
      title: e.title,
      description: e.description,
      duration: e.duration,
      diplomaId: e.diplomaId,
      image: e.image,
      questionsCount: e.questions.length,
      immutable: false,
      createdAt: pastDate(180 - idx * 10),
      updatedAt: pastDate(15 - idx),
    });

    e.questions.forEach((q) => {
      const qId = uuidv4();
      db.questions.push({
        id: qId,
        text: q.text,
        examId,
        immutable: false,
        createdAt: pastDate(180 - idx * 10),
        updatedAt: pastDate(15 - idx),
        answers: q.answers.map((a) => ({
          id: uuidv4(),
          text: a.text,
          isCorrect: a.isCorrect,
        })),
      });
    });
  });

  // Seed Submissions & Audit Logs
  if (db.exams.length > 0) {
    const firstExam = db.exams[0];
    const qs = db.questions.filter((q) => q.examId === firstExam.id);
    db.submissions.push({
      id: uuidv4(),
      userId: studentId,
      examId: firstExam.id,
      answers: qs.map((q, i) => ({ questionId: q.id, answerId: q.answers[i % q.answers.length].id })),
      score: 80,
      correct: 4,
      total: 5,
      passed: true,
      startedAt: pastDate(24),
      submittedAt: pastDate(23.5),
      createdAt: pastDate(23.5),
    });

    db.auditLogs.push(
      {
        id: uuidv4(),
        createdAt: pastDate(48),
        actorUserId: adminId,
        actorUsername: "admin",
        actorEmail: "admin@exam-platform.com",
        actorRole: "admin",
        category: "diploma",
        action: "create",
        entityType: "diploma",
        entityId: diplomaIds[0],
        metadata: { title: "Web Development" },
        ipAddress: "192.168.1.10",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        httpMethod: "POST",
        path: "/api/diplomas",
      },
      {
        id: uuidv4(),
        createdAt: pastDate(23.5),
        actorUserId: studentId,
        actorUsername: "student",
        actorEmail: "student@exam-platform.com",
        actorRole: "student",
        category: "submission",
        action: "submit",
        entityType: "exam",
        entityId: firstExam.id,
        metadata: { score: 80, passed: true },
        ipAddress: "192.168.1.45",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        httpMethod: "POST",
        path: "/api/submissions",
      }
    );
  }
}

seedDatabase();

// ─── Helpers ──────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ status: false, message: "Forbidden: Admin only" });
  }
  next();
}

function paginate(data, page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.max(1, parseInt(limit) || 20);
  const total = data.length;
  const totalPages = Math.ceil(total / l);
  const start = (p - 1) * l;
  const paginatedData = data.slice(start, start + l);
  return {
    data: paginatedData,
    metadata: { page: p, limit: l, total, totalPages },
  };
}

function logAudit(req, category, action, entityType, entityId, metadata = {}) {
  const user = req.user || {};
  db.auditLogs.unshift({
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    actorUserId: user.id || "system",
    actorUsername: user.username || "system",
    actorEmail: user.email || "",
    actorRole: user.role || "",
    category,
    action,
    entityType,
    entityId,
    metadata,
    ipAddress: req.ip || req.connection?.remoteAddress || "unknown",
    userAgent: req.headers["user-agent"] || "",
    httpMethod: req.method,
    path: req.originalUrl,
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Auth Routes ──────────────────────────────────────────

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ status: false, message: "Username and password are required" });
  }

  const user = db.users.find((u) => u.username === username || u.email === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ status: false, message: "Invalid credentials" });
  }

  const token = generateToken(user);

  res.json({
    status: true,
    payload: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
      token,
    },
  });
});

// POST /api/auth/register
app.post("/api/auth/register", (req, res) => {
  const { username, email, password, firstName, lastName, phone } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ status: false, message: "Username, email and password are required" });
  }

  if (db.users.find((u) => u.username === username)) {
    return res.status(409).json({ status: false, message: "Username already exists" });
  }
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ status: false, message: "Email already exists" });
  }

  const newUser = {
    id: uuidv4(),
    username,
    email,
    password: bcrypt.hashSync(password, 10),
    firstName: firstName || "",
    lastName: lastName || "",
    phone: phone || "",
    profilePhoto: "",
    emailVerified: false,
    phoneVerified: false,
    role: "student",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  const token = generateToken(newUser);

  res.status(201).json({
    status: true,
    message: "Registration successful",
    payload: {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
      },
      token,
    },
  });
});

// POST /api/auth/send-email-verification
app.post("/api/auth/send-email-verification", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: false, message: "Email is required" });
  }

  const code = generateOTP();
  db.otpCodes[email] = { code, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 minutes

  console.log(`[OTP] Email: ${email}, Code: ${code}`);

  res.json({ status: true, message: "Verification code sent to your email" });
});

// POST /api/auth/confirm-email-verification
app.post("/api/auth/confirm-email-verification", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ status: false, message: "Email and code are required" });
  }

  const stored = db.otpCodes[email];
  // Accept any 6-digit code for development/demo, or match the stored one
  if (stored && stored.code === code && stored.expiresAt > Date.now()) {
    delete db.otpCodes[email];
    // Mark user as verified if they exist
    const user = db.users.find((u) => u.email === email);
    if (user) {
      user.emailVerified = true;
      user.updatedAt = new Date().toISOString();
    }
    return res.json({ status: true, message: "Email verified successfully" });
  }

  // For demo purposes, accept code "123456" always
  if (code === "123456") {
    const user = db.users.find((u) => u.email === email);
    if (user) {
      user.emailVerified = true;
      user.updatedAt = new Date().toISOString();
    }
    return res.json({ status: true, message: "Email verified successfully" });
  }

  res.status(400).json({ status: false, message: "Invalid or expired verification code" });
});

// POST /api/auth/forgot-password
app.post("/api/auth/forgot-password", (req, res) => {
  const { email, redirectUrl } = req.body;
  if (!email) {
    return res.status(400).json({ status: false, message: "Email is required" });
  }

  const user = db.users.find((u) => u.email === email);
  if (!user) {
    // Don't reveal if email exists
    return res.json({ status: true, message: "If the email exists, a reset link has been sent" });
  }

  const resetToken = uuidv4();
  db.resetTokens[resetToken] = { email, expiresAt: Date.now() + 60 * 60 * 1000 }; // 1 hour

  console.log(`[RESET] Email: ${email}, Token: ${resetToken}, URL: ${redirectUrl}?token=${resetToken}`);

  res.json({
    status: true,
    message: "Password reset link sent to your email",
    resetToken, // included for dev/demo purposes
  });
});

// POST /api/auth/reset-password
app.post("/api/auth/reset-password", (req, res) => {
  const { token, email, newPassword, password } = req.body;
  const pwd = newPassword || password;

  if (!token || !pwd) {
    return res.status(400).json({ status: false, message: "Token and new password are required" });
  }

  const stored = db.resetTokens[token];
  if (!stored || stored.expiresAt < Date.now()) {
    return res.status(400).json({ status: false, message: "Invalid or expired reset token" });
  }

  const user = db.users.find((u) => u.email === stored.email);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  user.password = bcrypt.hashSync(pwd, 10);
  user.updatedAt = new Date().toISOString();
  delete db.resetTokens[token];

  res.json({ status: true, message: "Password reset successfully" });
});

// ─── User Profile Routes ─────────────────────────────────

// GET /api/users/profile
app.get("/api/users/profile", authenticateToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  res.json({
    message: "Profile retrieved successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhoto: user.profilePhoto,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// PATCH /api/users/profile
app.patch("/api/users/profile", authenticateToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  const { firstName, lastName, profilePhoto, phone } = req.body;
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
  if (phone !== undefined) user.phone = phone;
  user.updatedAt = new Date().toISOString();

  logAudit(req, "user", "update", "user", user.id, { fields: Object.keys(req.body) });

  res.json({
    message: "Profile updated successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhoto: user.profilePhoto,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// POST /api/users/change-password
app.post("/api/users/change-password", authenticateToken, (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = db.users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ status: false, message: "Current password is incorrect" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ status: false, message: "Passwords do not match" });
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  user.updatedAt = new Date().toISOString();

  logAudit(req, "user", "change-password", "user", user.id);

  res.json({ status: true, message: "Password changed successfully" });
});

// POST /api/users/email/request
app.post("/api/users/email/request", authenticateToken, (req, res) => {
  const { newEmail } = req.body;
  if (!newEmail) {
    return res.status(400).json({ status: false, message: "New email is required" });
  }

  if (db.users.find((u) => u.email === newEmail)) {
    return res.status(409).json({ status: false, message: "Email already in use" });
  }

  const code = generateOTP();
  db.emailChanges[req.user.id] = { newEmail, code, expiresAt: Date.now() + 10 * 60 * 1000 };

  console.log(`[EMAIL CHANGE] User: ${req.user.id}, New Email: ${newEmail}, Code: ${code}`);

  res.json({ status: true, message: "Verification code sent to new email" });
});

// POST /api/users/email/confirm
app.post("/api/users/email/confirm", authenticateToken, (req, res) => {
  const { code } = req.body;
  const stored = db.emailChanges[req.user.id];

  const isValid = (stored && stored.code === code && stored.expiresAt > Date.now()) || code === "123456";

  if (!isValid) {
    return res.status(400).json({ status: false, message: "Invalid or expired verification code" });
  }

  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  if (stored) {
    user.email = stored.newEmail;
  }
  user.emailVerified = true;
  user.updatedAt = new Date().toISOString();
  delete db.emailChanges[req.user.id];

  logAudit(req, "user", "change-email", "user", user.id);

  res.json({
    message: "Email updated successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhoto: user.profilePhoto,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// ─── Diploma Routes ───────────────────────────────────────

// GET /api/diplomas
app.get("/api/diplomas", authenticateToken, (req, res) => {
  let data = [...db.diplomas];

  // Filters
  const { title, immutable, sortBy, sortOrder, page, limit } = req.query;
  if (title) data = data.filter((d) => d.title.toLowerCase().includes(title.toLowerCase()));
  if (immutable !== undefined) data = data.filter((d) => String(d.immutable) === immutable);

  // Sorting
  if (sortBy) {
    data.sort((a, b) => {
      const aVal = a[sortBy] || "";
      const bVal = b[sortBy] || "";
      if (sortOrder === "desc") return bVal > aVal ? 1 : -1;
      return aVal > bVal ? 1 : -1;
    });
  } else {
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const result = paginate(data, page, limit);

  res.json({
    status: true,
    code: 200,
    payload: result,
  });
});

// GET /api/diplomas/:id
app.get("/api/diplomas/:id", authenticateToken, (req, res) => {
  const diploma = db.diplomas.find((d) => d.id === req.params.id);
  if (!diploma) {
    return res.status(404).json({ status: false, message: "Diploma not found" });
  }

  res.json({
    status: true,
    code: 200,
    payload: { diploma },
  });
});

// POST /api/diplomas
app.post("/api/diplomas", authenticateToken, requireAdmin, (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !description) {
    return res.status(400).json({ status: false, message: "Title and description are required" });
  }

  const diploma = {
    id: uuidv4(),
    title,
    description,
    image: image || "",
    immutable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.diplomas.push(diploma);
  logAudit(req, "diploma", "create", "diploma", diploma.id, { title });

  res.status(201).json({
    status: true,
    code: 201,
    message: "Diploma created successfully",
    payload: { diploma },
  });
});

// PUT /api/diplomas/:id
app.put("/api/diplomas/:id", authenticateToken, requireAdmin, (req, res) => {
  const diploma = db.diplomas.find((d) => d.id === req.params.id);
  if (!diploma) {
    return res.status(404).json({ status: false, message: "Diploma not found" });
  }

  const { title, description, image } = req.body;
  if (title !== undefined) diploma.title = title;
  if (description !== undefined) diploma.description = description;
  if (image !== undefined) diploma.image = image;
  diploma.updatedAt = new Date().toISOString();

  logAudit(req, "diploma", "update", "diploma", diploma.id, { title: diploma.title });

  res.json({
    status: true,
    code: 200,
    message: "Diploma updated successfully",
    payload: { diploma },
  });
});

// DELETE /api/diplomas/:id
app.delete("/api/diplomas/:id", authenticateToken, requireAdmin, (req, res) => {
  const index = db.diplomas.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ status: false, message: "Diploma not found" });
  }

  const [deleted] = db.diplomas.splice(index, 1);
  logAudit(req, "diploma", "delete", "diploma", deleted.id, { title: deleted.title });

  // Also delete related exams and their questions
  const examIds = db.exams.filter((e) => e.diplomaId === deleted.id).map((e) => e.id);
  db.exams = db.exams.filter((e) => e.diplomaId !== deleted.id);
  db.questions = db.questions.filter((q) => !examIds.includes(q.examId));

  res.json({ status: true, code: 200, message: "Diploma deleted successfully" });
});

// ─── Exam Routes ──────────────────────────────────────────

// GET /api/exams
app.get("/api/exams", authenticateToken, (req, res) => {
  let data = db.exams.map((e) => {
    const diploma = db.diplomas.find((d) => d.id === e.diplomaId);
    return {
      ...e,
      questionsCount: db.questions.filter((q) => q.examId === e.id).length,
      diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: e.diplomaId, title: "Unknown" },
    };
  });

  // Filters
  const { title, diplomaId, immutable, sortBy, sortOrder, page, limit } = req.query;
  if (title) data = data.filter((e) => e.title.toLowerCase().includes(title.toLowerCase()));
  if (diplomaId) data = data.filter((e) => e.diplomaId === diplomaId);
  if (immutable !== undefined) data = data.filter((e) => String(e.immutable) === immutable);

  // Sorting
  if (sortBy) {
    data.sort((a, b) => {
      const aVal = a[sortBy] || "";
      const bVal = b[sortBy] || "";
      if (sortOrder === "desc") return bVal > aVal ? 1 : -1;
      return aVal > bVal ? 1 : -1;
    });
  } else {
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const result = paginate(data, page, limit);

  res.json({
    status: true,
    code: 200,
    payload: result,
  });
});

// GET /api/exams/:id
app.get("/api/exams/:id", authenticateToken, (req, res) => {
  const exam = db.exams.find((e) => e.id === req.params.id);
  if (!exam) {
    return res.status(404).json({ status: false, message: "Exam not found" });
  }

  const diploma = db.diplomas.find((d) => d.id === exam.diplomaId);

  res.json({
    status: true,
    code: 200,
    payload: {
      exam: {
        ...exam,
        questionsCount: db.questions.filter((q) => q.examId === exam.id).length,
        diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: exam.diplomaId, title: "Unknown" },
      },
    },
  });
});

// POST /api/exams
app.post("/api/exams", authenticateToken, requireAdmin, (req, res) => {
  const { title, description, image, duration, diplomaId } = req.body;
  if (!title || !description || !duration || !diplomaId) {
    return res.status(400).json({ status: false, message: "Title, description, duration and diplomaId are required" });
  }

  const exam = {
    id: uuidv4(),
    title,
    description,
    image: image || "",
    duration: parseInt(duration),
    diplomaId,
    questionsCount: 0,
    immutable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.exams.push(exam);
  logAudit(req, "exam", "create", "exam", exam.id, { title });

  const diploma = db.diplomas.find((d) => d.id === diplomaId);

  res.status(201).json({
    status: true,
    code: 201,
    message: "Exam created successfully",
    payload: {
      exam: {
        ...exam,
        diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: diplomaId, title: "Unknown" },
      },
    },
  });
});

// PUT /api/exams/:id
app.put("/api/exams/:id", authenticateToken, requireAdmin, (req, res) => {
  const exam = db.exams.find((e) => e.id === req.params.id);
  if (!exam) {
    return res.status(404).json({ status: false, message: "Exam not found" });
  }

  const { title, description, image, duration, diplomaId } = req.body;
  if (title !== undefined) exam.title = title;
  if (description !== undefined) exam.description = description;
  if (image !== undefined) exam.image = image;
  if (duration !== undefined) exam.duration = parseInt(duration);
  if (diplomaId !== undefined) exam.diplomaId = diplomaId;
  exam.updatedAt = new Date().toISOString();

  logAudit(req, "exam", "update", "exam", exam.id, { title: exam.title });

  const diploma = db.diplomas.find((d) => d.id === exam.diplomaId);

  res.json({
    status: true,
    code: 200,
    message: "Exam updated successfully",
    payload: {
      exam: {
        ...exam,
        questionsCount: db.questions.filter((q) => q.examId === exam.id).length,
        diploma: diploma ? { id: diploma.id, title: diploma.title } : { id: exam.diplomaId, title: "Unknown" },
      },
    },
  });
});

// DELETE /api/exams/:id
app.delete("/api/exams/:id", authenticateToken, requireAdmin, (req, res) => {
  const index = db.exams.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ status: false, message: "Exam not found" });
  }

  const [deleted] = db.exams.splice(index, 1);
  db.questions = db.questions.filter((q) => q.examId !== deleted.id);
  logAudit(req, "exam", "delete", "exam", deleted.id, { title: deleted.title });

  res.json({ status: true, code: 200, message: "Exam deleted successfully" });
});

// ─── Question Routes ──────────────────────────────────────

// GET /api/questions/exam/:examId
app.get("/api/questions/exam/:examId", authenticateToken, (req, res) => {
  const questions = db.questions
    .filter((q) => q.examId === req.params.examId)
    .map((q) => {
      const exam = db.exams.find((e) => e.id === q.examId);
      return {
        ...q,
        exam: exam ? { id: exam.id, title: exam.title } : { id: q.examId, title: "Unknown" },
      };
    });

  res.json({
    status: true,
    code: 200,
    payload: { questions },
  });
});

// GET /api/questions/:id
app.get("/api/questions/:id", authenticateToken, (req, res) => {
  const question = db.questions.find((q) => q.id === req.params.id);
  if (!question) {
    return res.status(404).json({ status: false, message: "Question not found" });
  }

  const exam = db.exams.find((e) => e.id === question.examId);

  res.json({
    status: true,
    code: 200,
    payload: {
      question: {
        ...question,
        exam: exam ? { id: exam.id, title: exam.title } : { id: question.examId, title: "Unknown" },
      },
    },
  });
});

// POST /api/questions
app.post("/api/questions", authenticateToken, requireAdmin, (req, res) => {
  const { text, examId, answers } = req.body;
  if (!text || !examId || !answers || !answers.length) {
    return res.status(400).json({ status: false, message: "Text, examId and answers are required" });
  }

  const question = {
    id: uuidv4(),
    text,
    examId,
    immutable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    answers: answers.map((a) => ({
      id: a.id || uuidv4(),
      text: a.text,
      isCorrect: a.isCorrect || false,
    })),
  };

  db.questions.push(question);
  logAudit(req, "question", "create", "question", question.id, { examId });

  const exam = db.exams.find((e) => e.id === examId);

  res.status(201).json({
    status: true,
    code: 201,
    message: "Question created successfully",
    payload: {
      question: {
        ...question,
        exam: exam ? { id: exam.id, title: exam.title } : { id: examId, title: "Unknown" },
      },
    },
  });
});

// PUT /api/questions/:id
app.put("/api/questions/:id", authenticateToken, requireAdmin, (req, res) => {
  const question = db.questions.find((q) => q.id === req.params.id);
  if (!question) {
    return res.status(404).json({ status: false, message: "Question not found" });
  }

  const { text, answers } = req.body;
  if (text !== undefined) question.text = text;
  if (answers !== undefined) {
    question.answers = answers.map((a) => ({
      id: a.id || uuidv4(),
      text: a.text,
      isCorrect: a.isCorrect || false,
    }));
  }
  question.updatedAt = new Date().toISOString();

  logAudit(req, "question", "update", "question", question.id);

  const exam = db.exams.find((e) => e.id === question.examId);

  res.json({
    status: true,
    code: 200,
    message: "Question updated successfully",
    payload: {
      question: {
        ...question,
        exam: exam ? { id: exam.id, title: exam.title } : { id: question.examId, title: "Unknown" },
      },
    },
  });
});

// DELETE /api/questions/:id
app.delete("/api/questions/:id", authenticateToken, requireAdmin, (req, res) => {
  const index = db.questions.findIndex((q) => q.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ status: false, message: "Question not found" });
  }

  const [deleted] = db.questions.splice(index, 1);
  logAudit(req, "question", "delete", "question", deleted.id, { examId: deleted.examId });

  res.json({ status: true, code: 200, message: "Question deleted successfully" });
});

// POST /api/questions/exam/:examId/bulk
app.post("/api/questions/exam/:examId/bulk", authenticateToken, requireAdmin, (req, res) => {
  const { examId } = req.params;
  const { questions } = req.body;

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ status: false, message: "Questions array is required" });
  }

  const exam = db.exams.find((e) => e.id === examId);
  if (!exam) {
    return res.status(404).json({ status: false, message: "Exam not found" });
  }

  const created = questions.map((q) => {
    const question = {
      id: uuidv4(),
      text: q.text,
      examId,
      immutable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      answers: (q.answers || []).map((a) => ({
        id: a.id || uuidv4(),
        text: a.text,
        isCorrect: a.isCorrect || false,
      })),
    };
    db.questions.push(question);
    return question;
  });

  logAudit(req, "question", "bulk-create", "exam", examId, { count: created.length });

  res.status(201).json({
    status: true,
    code: 201,
    message: `${created.length} questions created successfully`,
    payload: { questions: created },
  });
});

// ─── Submission Routes ────────────────────────────────────

// POST /api/submissions
app.post("/api/submissions", authenticateToken, (req, res) => {
  const { examId, answers, startedAt } = req.body;

  if (!examId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ status: false, message: "examId and answers are required" });
  }

  const exam = db.exams.find((e) => e.id === examId);
  if (!exam) {
    return res.status(404).json({ status: false, message: "Exam not found" });
  }

  const examQuestions = db.questions.filter((q) => q.examId === examId);

  // Calculate score
  let correct = 0;
  let total = examQuestions.length;

  answers.forEach((ans) => {
    const question = examQuestions.find((q) => q.id === ans.questionId);
    if (question) {
      const correctAnswer = question.answers.find((a) => a.isCorrect);
      if (correctAnswer && correctAnswer.id === ans.answerId) {
        correct++;
      }
    }
  });

  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = score >= 50;

  const submission = {
    id: uuidv4(),
    userId: req.user.id,
    examId,
    answers,
    score,
    correct,
    total,
    passed,
    startedAt: startedAt || new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.submissions.push(submission);
  logAudit(req, "submission", "submit", "exam", examId, { score, passed });

  res.status(201).json({
    status: true,
    code: 201,
    message: passed ? "Congratulations! You passed the exam." : "Unfortunately, you did not pass. Try again!",
    payload: {
      submission: {
        id: submission.id,
        score,
        correct,
        total,
        passed,
        examTitle: exam.title,
      },
    },
  });
});

// ─── Upload Route ─────────────────────────────────────────

// POST /api/upload
app.post("/api/upload", authenticateToken, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: false, message: "No image file provided" });
  }

  const imageId = uuidv4();
  const mimeType = req.file.mimetype;
  const base64 = req.file.buffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  db.uploadedImages[imageId] = dataUrl;

  // Return the path as a relative URL that the frontend can use
  const imageUrl = `/uploads/${imageId}`;

  res.json({
    status: true,
    message: "Image uploaded successfully",
    payload: {
      url: imageUrl,
      imageUrl: dataUrl, // Also return data URL for immediate use
    },
  });
});

// GET /api/uploads/:id (serve uploaded images)
app.get("/uploads/:id", (req, res) => {
  const dataUrl = db.uploadedImages[req.params.id];
  if (!dataUrl) {
    return res.status(404).json({ status: false, message: "Image not found" });
  }

  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return res.status(500).json({ status: false, message: "Invalid image data" });
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");

  res.setHeader("Content-Type", mimeType);
  res.setHeader("Cache-Control", "public, max-age=31536000");
  res.send(buffer);
});

// ─── Admin Audit Log Routes ──────────────────────────────

// GET /api/admin/audit-logs
app.get("/api/admin/audit-logs", authenticateToken, requireAdmin, (req, res) => {
  let data = [...db.auditLogs];

  const { category, action, userId, sortBy, sortOrder, page, limit } = req.query;
  if (category) data = data.filter((l) => l.category === category);
  if (action) data = data.filter((l) => l.action === action);
  if (userId) data = data.filter((l) => l.actorUserId === userId);

  // Sorting
  if (sortBy) {
    data.sort((a, b) => {
      const aVal = a[sortBy] || "";
      const bVal = b[sortBy] || "";
      if (sortOrder === "desc") return bVal > aVal ? 1 : -1;
      return aVal > bVal ? 1 : -1;
    });
  }

  const result = paginate(data, page, limit);

  res.json({
    status: true,
    code: 200,
    payload: result,
  });
});

// GET /api/admin/audit-logs/:id
app.get("/api/admin/audit-logs/:id", authenticateToken, requireAdmin, (req, res) => {
  const auditLog = db.auditLogs.find((l) => l.id === req.params.id);
  if (!auditLog) {
    return res.status(404).json({ status: false, message: "Audit log not found" });
  }

  res.json({
    status: true,
    code: 200,
    payload: { auditLog },
  });
});

// DELETE /api/admin/audit-logs/:id
app.delete("/api/admin/audit-logs/:id", authenticateToken, requireAdmin, (req, res) => {
  const index = db.auditLogs.findIndex((l) => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ status: false, message: "Audit log not found" });
  }

  db.auditLogs.splice(index, 1);

  res.json({ status: true, code: 200, message: "Audit log deleted successfully" });
});

// DELETE /api/admin/audit-logs (clear all)
app.delete("/api/admin/audit-logs", authenticateToken, requireAdmin, (req, res) => {
  db.auditLogs = [];
  res.json({ status: true, code: 200, message: "All audit logs cleared successfully" });
});

// ─── Health Check ─────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: true,
    message: "Exam Platform API is running",
    timestamp: new Date().toISOString(),
    stats: {
      users: db.users.length,
      diplomas: db.diplomas.length,
      exams: db.exams.length,
      questions: db.questions.length,
      submissions: db.submissions.length,
      auditLogs: db.auditLogs.length,
    },
  });
});

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: false, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Start Server (for local dev) ─────────────────────────
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Exam Platform API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`\n📋 Test Credentials:`);
    console.log(`   Admin:   username=admin, password=Admin@123`);
    console.log(`   Student: username=student, password=Student@123`);
    console.log(`\n📝 OTP: Use "123456" as OTP code for demo purposes\n`);
  });
}

// Export for Vercel
module.exports = app;
