# Exam Platform Backend API

A custom REST API backend for the Exam Platform, built with Express.js and designed for Vercel serverless deployment.

## 🚀 Quick Start

### Local Development

```bash
npm install
npm run dev
```

The server starts at `http://localhost:5000`

### Test Credentials

| Role    | Username  | Password    |
|---------|-----------|-------------|
| Admin   | admin     | Admin@123   |
| Student | student   | Student@123 |

### OTP Code (Demo)
Use `123456` as the OTP code for email verification in development.

## 📋 API Endpoints

### Auth
- `POST /api/auth/login` — Login with username/password
- `POST /api/auth/register` — Register new student account
- `POST /api/auth/send-email-verification` — Send OTP to email
- `POST /api/auth/confirm-email-verification` — Verify OTP code
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password with token

### User Profile (🔒 Auth Required)
- `GET /api/users/profile` — Get current user profile
- `PATCH /api/users/profile` — Update profile
- `POST /api/users/change-password` — Change password
- `POST /api/users/email/request` — Request email change
- `POST /api/users/email/confirm` — Confirm email change

### Diplomas (🔒 Auth Required)
- `GET /api/diplomas` — List diplomas (paginated, filterable)
- `GET /api/diplomas/:id` — Get diploma by ID
- `POST /api/diplomas` — Create diploma (Admin only)
- `PUT /api/diplomas/:id` — Update diploma (Admin only)
- `DELETE /api/diplomas/:id` — Delete diploma (Admin only)

### Exams (🔒 Auth Required)
- `GET /api/exams` — List exams (paginated, filterable)
- `GET /api/exams/:id` — Get exam by ID
- `POST /api/exams` — Create exam (Admin only)
- `PUT /api/exams/:id` — Update exam (Admin only)

### Questions (🔒 Auth Required)
- `GET /api/questions/exam/:examId` — Get questions for an exam
- `GET /api/questions/:id` — Get question by ID
- `POST /api/questions` — Create question (Admin only)
- `PUT /api/questions/:id` — Update question (Admin only)
- `DELETE /api/questions/:id` — Delete question (Admin only)
- `POST /api/questions/exam/:examId/bulk` — Bulk create questions (Admin only)

### Submissions (🔒 Auth Required)
- `POST /api/submissions` — Submit exam answers (auto-scored)

### Upload (🔒 Auth Required)
- `POST /api/upload` — Upload image (multipart/form-data)

### Audit Logs (🔒 Admin Only)
- `GET /api/admin/audit-logs` — List audit logs (paginated, filterable)
- `GET /api/admin/audit-logs/:id` — Get audit log by ID
- `DELETE /api/admin/audit-logs/:id` — Delete audit log
- `DELETE /api/admin/audit-logs` — Clear all audit logs

### Health
- `GET /api/health` — Server health check

## 🌐 Deploy to Vercel

1. Push this folder to a GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Set environment variable: `JWT_SECRET=your-strong-secret-key`
4. Deploy!

After deployment, update the frontend `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.vercel.app/api
```

## ⚠️ Important Notes

- This backend uses **in-memory storage** — data resets on each cold start in Vercel
- For production, replace with a proper database (MongoDB, PostgreSQL, etc.)
- Seed data is auto-generated on startup with sample diplomas, exams, and questions
- OTP "123456" is accepted for demo purposes
