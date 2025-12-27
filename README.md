# Bug Tracker Frontend

A modern, responsive frontend application for bug tracking and project management built with React, TypeScript, and Vite.

## Features

- **User Authentication**: Secure login, registration, and email verification system
- **Role-Based Access Control**: Different dashboards and permissions for admins and regular users
- **Bug Management**: Create, view, edit, and track bugs with detailed information
- **Project Management**: Organize bugs within projects
- **User Management**: Admin interface for managing user accounts
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS and DaisyUI
- **State Management**: Redux Toolkit for efficient state handling
- **API Integration**: RESTful API communication for backend services
- **Testing**: End-to-end testing with Cypress

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with DaisyUI components
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router
- **Form Handling**: React Hook Form with Yup validation
- **Icons**: Lucide React and React Icons
- **Testing**: Cypress for E2E tests
- **Linting**: ESLint with TypeScript support

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bug-tracker-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint for code linting
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Bugs/           # Bug-related components
│   ├── Dashboard/      # Dashboard components
│   ├── Dashboards/     # Role-based dashboards
│   ├── Projects/       # Project management
│   └── UserManagement/ # User management
├── services/           # API service functions
├── store/              # Redux store and slices
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.
