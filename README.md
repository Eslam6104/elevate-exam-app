# 🎓 Elevate Exam Platform

<div align="center">

![Elevate Exam Platform](https://img.shields.io/badge/Elevate-Exam%20Platform-0284c7?style=for-the-badge&logo=academic-tree)
![Next.js 16](https://img.shields.io/badge/Next.js-16.2.3-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![NextAuth.js](https://img.shields.io/badge/NextAuth-JWT_RBAC-purple?style=for-the-badge&logo=auth0)
![Vercel Ready](https://img.shields.io/badge/Vercel-Deploy_Ready-success?style=for-the-badge&logo=vercel)

<p align="center">
  <b>A modern, high-performance, full-stack examination and learning assessment platform built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS.</b>
</p>

[✨ Demo Accounts](#-quick-demo-accounts) • [🚀 Quick Start](#-quick-start) • [📖 Key Features](#-key-features) • [🏛️ Architecture](#-project-structure) • [📡 API Reference](#-api-reference-apiv1) • [🌐 Deployment](#-deployment-to-vercel)

</div>

---

## 🌟 Overview

**Elevate Exam Platform** is an enterprise-ready online examination and assessment management system engineered for educational institutions, academies, and students. Built on the modern **Next.js 16 App Router** and **React 19**, it delivers an intuitive, fast, and responsive user experience across both desktop and mobile devices.

The platform follows a **Unified Serverless Full-Stack Architecture**: the client interface, server actions, and RESTful API endpoints (`/api/v1/*`) are packaged within a single repository. It deploys out-of-the-box to **Vercel** with zero extra backend server provisioning needed.

---

## 🔑 Quick Demo Accounts

The login interface includes **1-click Quick Demo buttons** for rapid testing:

| Role | Username | Password | Access & Permissions |
|---|---|---|---|
| 👑 **Admin** | `admin` | `Admin@123` | Full control over diplomas, exams, question banks, and audit logs |
| 🎓 **Student** | `student` | `Student@123` | Explore diplomas, take timed exams, view instant scoring and reviews |

> 💡 **Default OTP Code:** For email/phone verification and password reset in demo mode, use **`123456`**.

---

## ✨ Key Features

### 🎓 1. Student Experience
- **Diplomas & Tracks Discovery**: Browse learning tracks and diplomas with rich Unsplash visuals and descriptive syllabus summaries.
- **Interactive Exam Engine**:
  - Real-time countdown timer synchronized with exam duration.
  - Interactive navigation matrix with question status indicators.
  - Multi-choice single-selection answer mechanism with instant auto-save.
- **Instant Automated Grading**:
  - Immediate score calculation and percentage breakdown upon submission or time expiration.
  - Question-by-question review displaying correct answers, student answers, and explanation badges.
- **Student Profile Management**:
  - Update personal information, phone number, profile photo, and change password securely.

### 🛡️ 2. Admin Management Dashboard
- **Diplomas Management (CRUD)**:
  - Create, view, edit, and delete diplomas and tracks.
  - Custom image upload with instant preview and integrated Unsplash visual assets.
- **Exams Management (CRUD)**:
  - Assign exams to specific diplomas.
  - Configure exam titles, descriptions, durations (in minutes), and question quotas.
- **Comprehensive Question Bank**:
  - Create and manage exam questions with dynamic multi-choice answer options.
  - Flag correct answers with validation safeguards.
- **System Audit Logs**:
  - Live activity monitoring tracking critical operations (creations, edits, deletions, authentication events).
  - Searchable, timestamped logs attributing actions to specific administrative users.

### 🔐 3. Authentication & Security
- **NextAuth.js Integration**: Secure session management utilizing signed JSON Web Tokens (JWT).
- **Role-Based Access Control (RBAC)**: Route protection via Next.js Middleware guarding `/admin/*` and `/student/*`.
- **Multi-Step Registration**: Seamless signup workflow including email and phone OTP verification steps.
- **Password Recovery Flow**: Forgot/reset password pipeline supporting transactional email delivery via **Nodemailer (SMTP)** with development screen fallbacks.
- **Cryptographic Hashing**: Secure password hashing with **bcryptjs**.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Server Components, Server Actions, Serverless API Routes |
| **UI Library** | [React 19](https://react.dev/) + React Compiler | High-performance reactive UI rendering |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety and maintainable code quality |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Atomic utility styles, modern CSS variables, fluid responsive design |
| **Components** | [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/) | Headless accessible primitives and clean vector iconography |
| **Server State** | [TanStack React Query v5](https://tanstack.com/query/latest) | Automatic caching, background refetching, and optimistic mutations |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Schema-based validation and stateful form handling |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) | Credentials provider, JWT session tokens, and route middleware |
| **Storage Layer** | File-backed JSON DB + In-Memory Fallback | Dynamic data persistence (`data/exam-db.json`) |
| **Email Service** | [Nodemailer](https://nodemailer.com/) | Transactional email dispatch for OTP and password recovery |
| **Toasts** | [Sonner](https://sonner.emilkowal.ski/) | Fast, customizable toast notification system |

---

## 📁 Project Structure

The project follows a **Feature-Driven Architecture**, keeping domain logic, UI components, and API callers modular and maintainable:

```text
elevate-exam-app/
├── 📂 data/
│   └── exam-db.json              # Persistent JSON database (auto-seeded)
├── 📂 public/                    # Static assets, SVG fallbacks, and brand icons
├── 📂 backend/                   # Standalone Express server (optional microservice alternative)
│   ├── api/index.js
│   ├── package.json
│   └── vercel.json
├── 📂 src/
│   ├── 📂 app/                   # Next.js App Router
│   │   ├── (auth)/               # Authentication pages
│   │   │   ├── login/            # Login with 1-click demo access
│   │   │   ├── register/         # Multi-step signup & OTP verification
│   │   │   ├── forgot-password/  # Password reset request
│   │   │   └── reset-password/   # New password submission
│   │   ├── admin/                # Admin portal routes
│   │   │   ├── diplomas/         # Diplomas list & management
│   │   │   ├── exams/            # Exam listings & creation
│   │   │   ├── questions/        # Question bank editor
│   │   │   ├── audit-log/        # Administrative activity logs
│   │   │   └── account/          # Admin profile settings
│   │   ├── student/              # Student portal routes
│   │   │   ├── diplomas/         # Student track browser
│   │   │   ├── exams/[id]/       # Interactive timed exam session
│   │   │   └── account/          # Student profile settings
│   │   ├── api/                  # Unified Serverless API routes
│   │   │   ├── auth/[...nextauth]/
│   │   │   └── v1/[...path]/     # RESTful endpoints for CRUD & submissions
│   │   ├── uploads/[id]/         # Dynamic image serving route
│   │   ├── layout.tsx            # Root layout, theme, and Query providers
│   │   └── page.tsx              # Index route redirect
│   ├── 📂 features/              # Domain-specific feature modules
│   │   ├── 📂 admin/             # Admin views, dialogs, mutations, and queries
│   │   ├── 📂 student/           # Student exam player, timer, and result cards
│   │   ├── 📂 auth/              # Multi-step forms, hooks, and validators
│   │   └── 📂 shared/            # Shared features (dropzones, profile forms)
│   ├── 📂 lib/
│   │   └── 📂 backend/           # Core backend services (DB, Seeds, JWT, Mailer)
│   ├── 📂 shared/                # Global UI kit components, utilities, and Axios clients
│   └── middleware.ts             # Route protection and RBAC guards
├── .env.example                  # Environment variable reference
├── next.config.ts                # Next.js optimization and image remote patterns
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript compiler options
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v18.18.0` or higher (Node `v20+` recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 2. Clone and Install
```bash
git clone https://github.com/Eslam6104/elevate-exam-app.git
cd elevate-exam-app
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file to create `.env.local`:
```bash
cp .env.example .env.local
```

Default configuration in `.env.local`:
```env
# Built-in Serverless API URL
NEXT_PUBLIC_API_BASE_URL=/api/v1

# NextAuth secret key and canonical URL
NEXTAUTH_SECRET=exam-platform-super-secret-key-2024
NEXTAUTH_URL=http://localhost:3000

# (Optional) Real SMTP Email Service configuration
# If left commented out, OTP codes appear directly on-screen and in terminal output
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=465
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-gmail-app-password
# EMAIL_FROM="Elevate Platform" <your-email@gmail.com>
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Both the web interface and the serverless API routes (`/api/v1/*`) are live immediately!

---

## 📡 API Reference (`/api/v1`)

The platform includes a built-in REST API that can be consumed internally or by external clients:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user account with hashed password |
| `POST` | `/api/v1/auth/login` | Authenticate credentials and receive JWT token |
| `POST` | `/api/v1/auth/verify-code` | Verify OTP code for email or phone |
| `POST` | `/api/v1/auth/forgot-password` | Generate and dispatch password reset code |
| `POST` | `/api/v1/auth/reset-password` | Set new password with valid reset token |
| `GET`, `POST` | `/api/v1/diplomas` | Fetch all diplomas or create a new diploma |
| `PUT`, `DELETE`| `/api/v1/diplomas/:id` | Update or remove a diploma by ID |
| `GET`, `POST` | `/api/v1/exams` | Fetch all exams or create a new exam |
| `GET` | `/api/v1/exams/:id` | Fetch exam metadata alongside questions |
| `POST` | `/api/v1/exams/:id/submit` | Submit answers for grading; returns score & breakdown |
| `GET`, `POST` | `/api/v1/questions` | Query question bank or add a new question |
| `PUT`, `DELETE`| `/api/v1/questions/:id` | Update or delete a question |
| `GET` | `/api/v1/audit-logs` | Retrieve chronological system audit logs (Admin only) |
| `POST` | `/api/v1/upload` | Upload image files with base64 storage & preview URL |

---

## 🌐 Deployment to Vercel

This repository is optimized for **1-click deployment on Vercel**:

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete elevate exam platform"
   git push origin main
   ```
2. Navigate to [Vercel](https://vercel.com):
   - Click **Add New Project** and import `Eslam6104/elevate-exam-app`.
   - Framework Preset: **Next.js**.
   - Root Directory: `./` (default).
3. Set the Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL` = `/api/v1`
   - `NEXTAUTH_SECRET` = `<any-strong-random-string>`
   - `NEXTAUTH_URL` = `<your-production-domain-or-leave-blank>`
4. Click **Deploy**.
5. Once the build finishes, your full-stack app—including all UI pages and serverless API handlers—is live and functional! 🚀

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the Next.js local development server with Fast Refresh |
| `npm run build` | Compiles and optimizes the application for production |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint to check for code quality and style standards |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository.
2. Create a dedicated branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it for personal and commercial projects.

<div align="center">

Built with ❤️ by [Eslam6104](https://github.com/Eslam6104)

</div>
