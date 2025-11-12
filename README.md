# Resumind - AI Resume Analyzer

An intelligent resume analysis platform that provides personalized feedback to help you land your dream job. Get detailed insights on your resume's ATS compatibility, content quality, structure, and more.

## ⚠️ Current Status - UI Shell Only

**This application is currently in migration.** The UI shell has been migrated to Next.js 16, but backend functionality is not yet implemented. The following features are placeholder:

- ❌ Resume analysis (returns placeholder error)
- ❌ PDF upload/storage (no persistence)
- ❌ PDF preview generation (not implemented)
- ❌ Viewing past analyses (no data storage)
- ❌ Authentication (coming soon)

**What works:**

- ✅ UI shell with navigation
- ✅ Form validation
- ✅ Job import from URLs (via Jina.ai)
- ✅ Toast notifications
- ✅ Responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 16 App Router with TypeScript
- **Runtime**: Bun (for development and builds)
- **Styling**: Tailwind CSS v4 with custom animations
- **File Upload**: React Dropzone
- **UI Components**: Lucide React icons, Sonner toasts

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher
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

3. Start the development server:

```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Type Checking

Run TypeScript type checking:

```bash
bun run typecheck
```

## 📖 How to Use (Current - UI Shell)

1. **Home Page** (`/`) - View hero section and empty state (no resumes stored)
2. **Upload Page** (`/upload`) - Fill out form and upload PDF (shows "backend not ready" toast)
3. **Resume Detail** (`/resume/:id`) - Shows placeholder with mock feedback structure
4. **Auth Page** (`/auth`) - Shows "authentication coming soon" message

### Available Routes

- **`/`** (home) - Dashboard with hero section (always shows empty state)
- **`/auth`** - Authentication placeholder page
- **`/upload`** - Upload form with placeholder backend call
- **`/resume/:id`** - Resume detail page with placeholder feedback

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
│   └── api.ts             # Placeholder API functions
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
   - Add database (PostgreSQL, MongoDB, etc.) for resume storage

5. **Authentication**:
   - Implement authentication (NextAuth.js, Clerk, etc.)

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

## 📄 License

This project is available under the MIT License.

---

Built with ❤️ using Next.js 16. Backend integration coming soon.
