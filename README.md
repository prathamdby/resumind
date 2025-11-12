# Resumind - AI Resume Analyzer

An intelligent resume analysis platform that provides personalized feedback to help you land your dream job. Get detailed insights on your resume's ATS compatibility, content quality, structure, and more.

## ⚠️ Current Status - UI Shell with Authentication

**This application is currently in migration.** The UI shell has been migrated to Next.js 16 with authentication implemented. The following features are placeholder:

- ❌ Resume analysis (returns placeholder error)
- ❌ PDF upload/storage (no persistence)
- ❌ PDF preview generation (not implemented)
- ❌ Viewing past analyses (no data storage)

**What works:**

- ✅ Authentication with Google OAuth (Better Auth)
- ✅ Protected routes (all routes except `/auth` require authentication)
- ✅ UI shell with navigation
- ✅ Form validation
- ✅ Job import from URLs (via Jina.ai + Cerebras AI)
- ✅ Toast notifications
- ✅ Responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 16 App Router with TypeScript
- **Runtime**: Bun (for development and builds)
- **Authentication**: Better Auth with Google OAuth
- **Database**: Neon PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4 with custom animations
- **File Upload**: React Dropzone
- **UI Components**: Lucide React icons, Sonner toasts

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher
- A Neon PostgreSQL database (sign up at [neon.tech](https://neon.tech))
- Google OAuth credentials (from [Google Cloud Console](https://console.cloud.google.com))
- A modern web browser

### Installation

1. Clone the repository:

```bash
git clone https://github.com/prathamdby/ai-resume-analyzer.git
cd ai-resume-analyzer
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
# PostgreSQL pooled connection for queries (from Neon dashboard)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require&pgbouncer=true"

# Direct database connection for migrations (from Neon dashboard - without pgbouncer)
DIRECT_DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="<generate-random-32-char-string>"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="<your-google-oauth-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-oauth-client-secret>"

# Cerebras AI Configuration
CEREBRAS_API_KEY="<your-cerebras-api-key>"

# PDF Service Configuration
PDF_SERVICE_URL="http://localhost:8000"  # URL of the Python FastAPI service for PDF to markdown conversion

# Rate Limiting (optional)
DISABLE_RATE_LIMITING="false"  # Set to "true" in development if needed
```

**Important Notes:**

- Get your Neon connection strings from the Neon dashboard. Use the pooled connection URL for `DATABASE_URL` and the direct connection URL for `DIRECT_DATABASE_URL`.
- Generate a random 32-character string for `BETTER_AUTH_SECRET` (e.g., using `openssl rand -base64 32`).
- For Google OAuth setup:
  1. Go to [Google Cloud Console](https://console.cloud.google.com)
  2. Create a new project or select an existing one
  3. Enable the Google+ API
  4. Create OAuth 2.0 credentials
  5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (for development)
  6. Copy the Client ID and Client Secret to your `.env` file

4. Set up the database:

```bash
# Generate Prisma Client
bunx prisma generate

# Run migrations to create auth tables and rate limiting
bunx prisma migrate dev --name init_better_auth
```

**Note:**

- The job import feature uses rate limiting (5 requests per minute per user) to prevent abuse. Rate limits are stored in the database and persist across serverless invocations.
- Resume analysis uses rate limiting (2 requests per minute per user).
- The PDF service processes PDFs synchronously (one at a time). Under concurrent load, requests will queue and may timeout.
- Maximum file size is 20 MB. PDFs are converted to markdown (max 15K characters) before AI analysis.

5. Start the development server:

```bash
bun run dev
```

6. Open your browser and navigate to `http://localhost:3000`

You'll be redirected to `/auth` to sign in with Google.

### Type Checking

Run TypeScript type checking:

```bash
bun run typecheck
```

## 📖 How to Use (Current - UI Shell with Auth)

1. **Auth Page** (`/auth`) - Sign in with Google OAuth (required to access other pages)
2. **Home Page** (`/`) - View hero section and empty state (no resumes stored) - Protected route
3. **Upload Page** (`/upload`) - Fill out form and upload PDF (shows "backend not ready" toast) - Protected route
4. **Resume Detail** (`/resume/:id`) - Shows placeholder with mock feedback structure - Protected route

### Available Routes

- **`/auth`** - Google OAuth sign-in page (public)
- **`/`** (home) - Dashboard with hero section (always shows empty state) - Protected
- **`/upload`** - Upload form with placeholder backend call - Protected
- **`/resume/:id`** - Resume detail page with placeholder feedback - Protected

All routes except `/auth` are protected and require authentication. Unauthenticated users are automatically redirected to `/auth`.

## 🔧 Development

### Build for Production

```bash
bun run build
```

### Run Production Build

```bash
bun run start
```

This serves the production build via Next.js on port 3000.

## 📁 Project Structure

```
├── app/
│   ├── components/         # Reusable UI components (Navbar, FileUploader, etc.)
│   ├── lib/
│   │   └── utils.ts       # Utility functions (UUID generation, etc.)
│   ├── upload/            # Upload page
│   ├── resume/[id]/       # Resume detail page (dynamic route)
│   ├── auth/              # Auth placeholder page
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/
│   ├── api.ts             # Placeholder API functions
│   ├── auth.ts            # Better Auth server configuration
│   ├── auth-client.ts     # Better Auth client utilities
│   └── prisma.ts          # Prisma client singleton
├── app/
│   └── api/
│       └── auth/
│           └── [...all]/
│               └── route.ts  # Auth API route handler
├── middleware.ts          # Route protection middleware
├── prisma/
│   ├── schema.prisma      # Prisma schema with Better Auth models
│   └── migrations/        # Database migration history
├── constants/
│   └── index.ts           # AI prompts and response format schemas (for future backend)
├── types/
│   └── index.d.ts         # Application type definitions
└── public/                # Static assets (icons, images)
```

## 🔮 Backend TODO (Post-Migration)

The following backend features need to be implemented:

1. **API Endpoints**:
   - `POST /api/analyze` - Accepts PDF file, converts to markdown, sends to AI, returns Feedback
   - `POST /api/job-import` - Proxy for CORS-blocked job sites
   - `GET/POST /api/resumes` - CRUD operations for resume storage

2. **PDF Processing**:
   - PDF to markdown conversion (e.g., `pdf-parse`, `pdfjs-dist` server-side, or `pypdf2`)

3. **AI Integration**:
   - Integrate AI provider (Anthropic Claude API, OpenAI, etc.)
   - Use prompts from `constants/index.ts`

4. **Database**:
   - ✅ Neon PostgreSQL configured with Prisma ORM
   - ⏳ Resume storage models need to be added

5. **Authentication**:
   - ✅ Implemented with Better Auth and Google OAuth

6. **Blob Storage** (if needed):
   - Add blob storage for PDFs (S3, Vercel Blob, etc.)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Install dependencies: `bun install`
4. Make your changes following the repository guidelines (see `AGENTS.md`)
5. Run type checking: `bun run typecheck`
6. Test manually: `bun run dev`
7. Commit your changes with a clear message: `git commit -m 'Add new feature'`
8. Push to the branch: `git push origin feature/new-feature`
9. Submit a pull request with:
   - Clear problem statement
   - Screenshots/recordings for UI changes
   - Notes on testing performed

### Development Guidelines

- Use **Bun** for all package management and scripts
- Follow **TypeScript** strict mode conventions
- Use **Tailwind CSS** utility classes (2-space indentation)
- Keep pages modular: page logic in `app/`, shared UI in `app/components/`
- Maintain type safety: all PRs must pass `bun run typecheck`

### Database Migrations

For development:

```bash
bunx prisma migrate dev --name <migration-name>
```

For production:

```bash
bunx prisma migrate deploy
```

**Important**: Always use migrations (`migrate dev`/`migrate deploy`) instead of `prisma db push` for production safety.

## 📄 License

This project is available under the MIT License.

---

Built with ❤️ using Next.js 16. Backend integration coming soon.
