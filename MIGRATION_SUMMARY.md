# PDF Service Migration Summary

## Overview

Migrated from an external Python PDF microservice to using the LlamaParse TypeScript SDK and native PDF preview library.

## Changes Made

### 1. Dependencies Installed

- `@llamaindex/cloud@^4.1.3` - For LlamaParse PDF-to-markdown conversion
- `pdf-to-img@^5.0.0` - For local PDF preview image generation

### 2. New Library Files Created

#### `lib/pdf-parser.ts`

- Implements `parsePDF(filePath: string): Promise<string>`
- Uses LlamaParseReader from @llamaindex/cloud
- Uploads PDFs to LlamaCloud using `LLAMA_CLOUD_API_KEY`
- 120-second timeout for parsing operations
- Returns markdown content
- Graceful error handling with meaningful error messages

#### `lib/pdf-preview.ts`

- Implements `generatePreview(filePath: string): Promise<string | null>`
- Uses pdf-to-img to convert first page to PNG
- Returns Base64 Data URL string (data:image/png;base64,...)
- Gracefully handles errors by returning null
- Enforces 5MB max size for preview images

### 3. Refactored API Routes

#### `app/api/analyze/route.ts`

- Removed `convertPdfToMarkdown` function
- Removed `PDF_SERVICE_URL` environment variable reference
- Removed health check for external PDF service
- Now uses `Promise.all` to run `parsePDF` and `generatePreview` concurrently
- Maintains existing logic for markdown truncation, AI analysis, and database storage

#### `app/api/import-job-pdf/route.ts`

- Removed `convertPdfToMarkdown` function
- Removed `PDF_SERVICE_URL` environment variable reference
- Removed health check for external PDF service
- Now uses `parsePDF` directly
- No preview generation needed for this route

### 4. Documentation Updates

#### `README.md`

- Updated tech stack section to reflect LlamaParse and pdf-to-img
- Changed prerequisites from "PDF service endpoint" to "LlamaCloud API key"
- Updated environment variables section
- Added LlamaCloud setup instructions
- Updated notes about PDF processing timeouts

#### `AGENTS.md`

- Updated "Immediate hazards" table to reflect LlamaParse integration
- Updated "Ghosts in the machine" section
- Added entries for `lib/pdf-parser.ts` and `lib/pdf-preview.ts` in Directory signals

#### `.env.example`

- Replaced `PDF_SERVICE_URL` with `LLAMA_CLOUD_API_KEY`

### 5. Environment Variables

**Removed:**

- `PDF_SERVICE_URL`

**Added:**

- `LLAMA_CLOUD_API_KEY` - API key for LlamaCloud/LlamaParse service

## Key Implementation Details

### PDF Parsing Flow

1. PDF file is written to temp location
2. LlamaParse uploads file to LlamaCloud
3. Service polls for completion (max 120s)
4. Returns markdown content
5. Markdown is truncated to 15K characters if needed
6. Temp file is cleaned up

### Preview Generation Flow

1. PDF file is processed locally with pdf-to-img
2. First page is converted to PNG at 2x scale
3. Image is converted to Base64 data URL
4. Returns null if generation fails (no error thrown)
5. Max preview size: 5MB

### Error Handling

- PDF parsing errors include timeout detection and API key validation
- Preview generation fails gracefully without breaking the analysis flow
- API routes maintain existing error handling patterns
- User-friendly error messages for common failure scenarios

## Testing Recommendations

1. Test with valid LlamaCloud API key
2. Test with various PDF sizes and complexities
3. Test timeout scenarios (large/complex PDFs)
4. Test preview generation with various PDF formats
5. Test error handling when API key is missing/invalid
6. Verify rate limiting still works correctly
7. Ensure database storage of markdown and preview images works

## Migration Benefits

1. **Self-contained**: No external Python service dependency
2. **Simpler deployment**: One less service to manage
3. **Better scaling**: LlamaCloud handles processing infrastructure
4. **Native TypeScript**: Better type safety and IDE support
5. **Concurrent processing**: PDF parsing and preview generation run in parallel
6. **Graceful degradation**: Preview failures don't break analysis

## Future Migration Note

The `@llamaindex/cloud` package is deprecated as of version 4.1.0. Future work should migrate to `llama-cloud-services` as recommended in the [LlamaCloud documentation](https://docs.cloud.llamaindex.ai). The current implementation works correctly but shows deprecation warnings during build.
