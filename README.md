# Elevate Exam Platform — Full-Stack Web Application

A full-stack online examination platform featuring a modern **Next.js** frontend and an integrated serverless backend. Both frontend and backend live in this single repository and deploy seamlessly to Vercel in one click.

---

## 🚀 Features

- **Integrated Full-Stack Architecture**: Next.js App Router with built-in API routes (`/api/v1/...`). No separate server or port needed!
- **Zero-Config Vercel Deployment**: Deploy this repository to Vercel and both the frontend and backend work immediately.
- **Standalone Express Backend Included**: A standalone Express server is also preserved in the [`backend/`](file:///c:/Users/LOQ/Desktop/exam-app/exam-platform/backend) folder for standalone deployment or Docker if desired.
- **Robust Image Handling**: High-resolution Unsplash course visuals, SVG local fallbacks, in-memory image uploads with instant preview, and support for any image host without Next.js domain crashes.
- **Quick Demo Login**: 1-click demo login buttons on the login screen for Student and Admin roles.

---

## 🔑 Demo Test Accounts

| Role | Username | Password |
|---|---|---|
| **Admin** | `admin` | `Admin@123` |
| **Student** | `student` | `Student@123` |

> **OTP for demo verification:** `123456`

---

## 🛠️ Getting Started (Local Development)

### Run the App
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Both the frontend and the mock backend API routes (`/api/v1`) are fully functional right away!

---

## 🌐 Deploy to Vercel (1-Click)

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: unified fullstack backend + frontend with image support"
   git push origin main
   ```
2. In [Vercel](https://vercel.com):
   - Click **Add New Project** → Import your repository `Eslam6104/elevate-exam-app`.
   - Framework Preset: **Next.js**.
   - Root Directory: `./` (or leave default).
   - Click **Deploy**!
3. That's it! When Vercel builds the project, the Next.js API routes under `/api/v1` deploy as serverless functions alongside the frontend. No extra backend configuration required.

---

## 📁 Repository Structure

```
elevate-exam-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/   # NextAuth authentication handlers
│   │   │   └── v1/[...path]/         # Serverless API routes (Diplomas, Exams, Questions, etc.)
│   │   ├── uploads/[id]/             # Serves uploaded images dynamically
│   │   ├── admin/                    # Admin dashboard, exams, diplomas, audit logs
│   │   ├── student/                  # Student exam taking & diploma views
│   │   └── login/                    # Login page with 1-click demo accounts
│   ├── features/                     # Domain modules (auth, student, admin)
│   ├── lib/
│   │   └── backend/                  # In-memory database, seeds, JWT & password helpers
│   └── shared/                       # Shared UI, API clients, dropzones
├── backend/                          # Standalone Express backend (backup / standalone server)
│   ├── api/index.js                  # Express API server
│   ├── package.json                  # Express dependencies
│   └── vercel.json                   # Express Vercel configuration
├── public/                           # Public assets, placeholder SVG images
└── next.config.ts                    # Next.js configuration (unoptimized images, rewrites)
```
