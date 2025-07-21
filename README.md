# SRC LIMS Web Application

A modern, responsive web interface for the Scientific Research Centre Laboratory Information Management System (LIMS).

## Features

- **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui components
- **Authentication**: Secure JWT-based authentication with token refresh
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Role-based Access**: Different permissions for different user roles
- **Dashboard**: Overview of laboratory operations with real-time stats
- **Sample Management**: Track samples through the testing process
- **Test Results**: Record and validate test results
- **Reports**: Generate and export laboratory reports
- **User Management**: Admin interface for managing users and permissions

## Tech Stack

- **Frontend**: React 19, Vite, JavaScript (ES6+)
- **Styling**: Tailwind CSS 4.x, shadcn/ui components
- **Routing**: React Router DOM
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- Access to the SRC LIMS API

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd src-lims-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Update the API URL in `.env`:
```
VITE_API_URL=https://src-lims-api.code.orb.local
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.jsx      # Main application layout
│   └── ProtectedRoute.jsx # Route protection component
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   └── Dashboard.jsx   # Main dashboard
├── services/           # API services
│   ├── api.js          # Axios configuration
│   └── authService.js  # Authentication service
└── lib/                # Utilities
    └── utils.js        # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_URL` - Base URL for the LIMS API
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## Authentication

The application uses JWT-based authentication with:

- Access tokens (1 hour expiry)
- Refresh tokens (7 days expiry)
- Automatic token refresh
- Secure token storage in localStorage

## API Integration

The app integrates with the SRC LIMS API for:

- User authentication and authorization
- Sample management
- Test result recording
- Report generation
- User management (admin only)

## Development

### Adding New Components

1. Create component in appropriate directory under `src/components/`
2. Use shadcn/ui components when possible: `npx shadcn@latest add <component-name>`
3. Follow existing patterns for styling and structure

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `App.jsx`
3. Wrap with `ProtectedRoute` if authentication required
4. Add navigation item in `Layout.jsx` if needed

### Styling Guidelines

- Use Tailwind CSS utility classes
- Leverage shadcn/ui components for consistency
- Follow responsive design patterns
- Use semantic color classes (e.g., `text-red-600` for errors)

## Deployment

The application is designed to be deployed as a static site. Build artifacts can be served by any web server (Nginx, Apache, etc.) or static hosting service.

## License

Proprietary - Scientific Research Centre (SRC), Jamaica
