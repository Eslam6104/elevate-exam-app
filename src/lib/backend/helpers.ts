import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { db, DbUser, DbAuditLog } from "./db";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "exam-platform-super-secret-key-2024";

// ─── Token helpers ────────────────────────────────────────
export function generateToken(user: DbUser): string {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

export interface TokenPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

export function verifyToken(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(authHeader.split(" ")[1], JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// ─── Response helpers ─────────────────────────────────────
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function unauthorized() {
  return json({ status: false, message: "Unauthorized" }, 401);
}

export function forbidden() {
  return json({ status: false, message: "Forbidden: Admin only" }, 403);
}

export function notFound(entity = "Resource") {
  return json({ status: false, message: `${entity} not found` }, 404);
}

// ─── Auth guard ───────────────────────────────────────────
export function requireAuth(request: NextRequest): TokenPayload | NextResponse {
  const user = verifyToken(request);
  if (!user) return unauthorized();
  return user;
}

export function requireAdmin(request: NextRequest): TokenPayload | NextResponse {
  const user = verifyToken(request);
  if (!user) return unauthorized();
  if (user.role !== "admin") return forbidden();
  return user;
}

// ─── Pagination ───────────────────────────────────────────
export function paginate<T>(data: T[], page: number | string = 1, limit: number | string = 20) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Number(limit) || 20);
  const total = data.length;
  const totalPages = Math.ceil(total / l);
  const start = (p - 1) * l;
  return {
    data: data.slice(start, start + l),
    metadata: { page: p, limit: l, total, totalPages },
  };
}

// ─── Audit log ────────────────────────────────────────────
export function logAudit(
  request: NextRequest,
  user: TokenPayload | null,
  category: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, unknown> = {}
) {
  const log: DbAuditLog = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    actorUserId: user?.id || "system",
    actorUsername: user?.username || "system",
    actorEmail: user?.email || "",
    actorRole: user?.role || "",
    category,
    action,
    entityType,
    entityId,
    metadata,
    ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    userAgent: request.headers.get("user-agent") || "",
    httpMethod: request.method,
    path: request.nextUrl.pathname,
  };
  db.auditLogs.unshift(log);
}

// ─── OTP ──────────────────────────────────────────────────
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── User sanitizer (strip password) ─────────────────────
export function sanitizeUser(user: DbUser) {
  return {
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
  };
}
