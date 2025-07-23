# LIMS Web Frontend - Claude Development Guidelines

## Project Overview

This is the frontend web application for the Scientific Research Council LIMS (Laboratory Information Management System).

## Tech Stack

- React 18
- Vite
- JavaScript (JSX)
- TailwindCSS
- Context API for state management

## Development Guidelines

### Commit Messages

- Use clear, descriptive commit messages
- Follow conventional commit format when possible
- Do NOT include "Generated with Claude Code" references in commit messages
- Focus on the "why" rather than the "what" in commit descriptions

### Pull Request Guidelines

- Create descriptive PR titles that summarize the change
- Include a clear summary of what was changed and why
- Add test plan or verification steps when applicable
- Do NOT include AI tool references in PR descriptions

### Code Standards

- Follow existing code conventions and patterns
- Use existing utility functions and components
- Maintain consistent file structure
- Ensure proper error handling and loading states

### Authentication Context

- The AuthContext handles JWT token management
- Uses localStorage for token persistence
- Implements automatic token refresh via interceptors
- Handles token expiry and forced logout scenarios

### Key Services

- `authService.js` - Authentication and token management
- `api.js` - API client with interceptors
- `tokenUtils.js` - Token validation utilities

### Testing Credentials

- Email: `rgowdie@src-jamaica.org`
- Password: `AdminPass123!`
- Local Site: http://localhost:5173
- Live Dev Site on Vercel: https://src-lims-web-dev.vercel.app

## Common Issues

- Infinite re-render in useEffect: Ensure proper dependency arrays
- Token refresh loops: Check token validation logic
- State updates: Avoid direct state mutations in Context providers
