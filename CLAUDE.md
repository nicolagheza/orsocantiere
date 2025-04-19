# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Development server: `npm run dev`
- Production server: `npm run start`
- Type check: `npx tsc --noEmit`

## Code Style Guidelines
- **TypeScript**: Use strict typing with explicit return types on functions
- **Imports**: Group imports (React, Next.js, components, utils, types)
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Components**: Use function components with TypeScript interfaces for props
- **Styling**: Use Tailwind CSS with clsx/cva for conditional styles
- **Error Handling**: Use try/catch blocks and return typed error responses
- **File Structure**: Follow Next.js App Router conventions
- **State Management**: Use React hooks for local state
- **Database**: Use Supabase client for database operations