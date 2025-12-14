# Resumind - AI Resume Analyzer

An intelligent resume analysis platform that provides personalized, ATS-aligned feedback to help you land your dream job. Get detailed insights on your resume's compatibility, content quality, structure, and actionable improvements tailored to specific job postings.

## ✨ Features

- ✅ **AI-Powered Resume Analysis** - Upload your PDF resume and receive comprehensive feedback across multiple categories (ATS compatibility, tone & style, content, structure, skills)
- ✅ **Job-Specific Tailoring** - Import job postings from URLs or paste descriptions to get targeted feedback for specific roles
- ✅ **Visual Resume Previews** - View preview images of your uploaded resumes alongside analysis results
- ✅ **Detailed Feedback Categories** - Get scored feedback with actionable tips for:
  - ATS compatibility
  - Tone and style
  - Content quality
  - Document structure
  - Skills alignment
  - Line-by-line improvements with suggested rewrites
- ✅ **Resume Management** - Track all your analyses in a dashboard, delete individual resumes, or wipe all data
- ✅ **Secure Authentication** - Google OAuth integration with Better Auth
- ✅ **Rate Limiting** - Built-in protection against abuse (2 analyses/min, 5 job imports/min)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 App Router with TypeScript
- **Runtime**: Bun (for development and builds)
- **Authentication**: Better Auth with Google OAuth
- **Database**: Neon PostgreSQL with Prisma ORM
- **AI**: Cerebras AI for resume analysis and job data extraction
- **PDF Processing**: LlamaParse (LlamaCloud) for markdown conversion and pdf-to-img for preview generation
- **Job Import**: Jina.ai for web content extraction
- **Styling**: Tailwind CSS v4 with custom animations
- **File Upload**: React Dropzone
- **UI Components**: Lucide React icons, Sonner toasts

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher
- A Neon PostgreSQL database (sign up at [neon.tech](https://neon.tech))
- Google OAuth credentials (from [Google Cloud Console](https://console.cloud.google.com))
- Cerebras API key (from [Cerebras Cloud](https://www.cerebras.net/cloud))
- LlamaCloud API key (from [LlamaCloud](https://cloud.llamaindex.ai))
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

# LlamaCloud Configuration
LLAMA_CLOUD_API_KEY="<your-llamacloud-api-key>"  # For PDF parsing via LlamaParse

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
- For LlamaCloud setup:
  1. Sign up at [LlamaCloud](https://cloud.llamaindex.ai)
  2. Create an API key from the dashboard
  3. Copy the API key to your `.env` file as `LLAMA_CLOUD_API_KEY`

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
- PDF parsing is performed using LlamaParse (LlamaCloud) with a 120-second timeout. Large or complex PDFs may take longer to process.
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

## 📖 How to Use

1. **Sign In** (`/auth`) - Authenticate with Google OAuth (required to access other pages)
2. **Upload & Analyze** (`/upload`) - Upload your PDF resume and provide job details:
   - Enter job title and description (required)
   - Optionally import from a job posting URL or paste company name
   - Upload PDF resume (max 20 MB)
   - Receive comprehensive AI feedback within seconds
3. **Dashboard** (`/`) - View all your resume analyses:
   - See preview images, job titles, and companies
   - Click any resume card to view detailed feedback
   - Delete individual resumes or wipe all data
4. **Resume Detail** (`/resume/:id`) - View detailed analysis:
   - Overall score and category breakdowns
   - ATS compatibility tips
   - Tone, content, structure, and skills feedback
   - Line-by-line improvement suggestions with rewrites
   - Visual resume preview

### Available Routes

- **`/auth`** - Google OAuth sign-in page (public)
- **`/`** (home) - Dashboard with all resume analyses - Protected
- **`/upload`** - Upload form for new resume analysis - Protected
- **`/resume/:id`** - Detailed resume analysis view - Protected

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
│   ├── api/
│   │   ├── analyze/          # Resume analysis endpoint
│   │   ├── auth/             # Better Auth route handlers
│   │   ├── import-job/       # Job posting import endpoint
│   │   ├── resumes/          # Resume CRUD endpoints
│   │   └── user/wipe/        # Bulk data deletion endpoint
│   ├── components/           # Reusable UI components
│   │   ├── Accordion.tsx
│   │   ├── AnalysisSection.tsx
│   │   ├── ATS.tsx
│   │   ├── FileUploader.tsx
│   │   ├── ResumeCard.tsx
│   │   └── ...
│   ├── resume/[id]/         # Resume detail page (dynamic route)
│   ├── upload/              # Upload page
│   ├── auth/                # Auth page
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home/dashboard page
│   └── globals.css          # Global styles
├── lib/
│   ├── ai.ts                # Cerebras AI client configuration
│   ├── api.ts               # API client utilities
│   ├── auth.ts              # Better Auth server configuration
│   ├── auth-client.ts       # Better Auth client utilities
│   ├── auth-server.ts       # Server-side auth helpers
│   ├── prisma.ts            # Prisma client singleton
│   ├── rate-limit.ts        # Rate limiting implementation
│   └── schemas.ts           # Zod validation schemas
├── constants/
│   └── index.ts             # AI prompts and response format schemas
├── types/
│   └── index.d.ts           # Application type definitions
├── prisma/
│   ├── schema.prisma        # Prisma schema with Better Auth models
│   └── migrations/          # Database migration history
└── public/                  # Static assets (icons, images)
```

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
- See `AGENTS.md` for detailed architecture patterns and contributor onboarding

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
