# Mock Authentication System

This application includes a fallback mock authentication system that activates when the backend API is unavailable.

## Test Credentials

The following test accounts are available in mock mode:

### Admin Account
- **Email**: `admin@bugtrack.com`
- **Password**: `admin123`
- **Role**: Admin

### User Accounts
- **Email**: `user1@bugtrack.com`
- **Password**: `user123`
- **Role**: User

- **Email**: `user2@bugtrack.com`
- **Password**: `user123`
- **Role**: User

- **Email**: `obwogemcbride73@gmail.com`
- **Password**: `password123`
- **Role**: User

## How It Works

1. **Primary**: The app first attempts to authenticate with the real backend API
2. **Fallback**: If the backend is unavailable (500 errors, network issues, etc.), it automatically falls back to the mock authentication system
3. **Seamless**: Users won't notice the difference - the interface and functionality remain the same

## Features

- ✅ Full authentication flow (login, logout, session management)
- ✅ Role-based access control (Admin/User)
- ✅ Persistent sessions (localStorage)
- ✅ Profile data management
- ✅ Proper error handling and user feedback

## Development Notes

- Mock tokens are JWT-like but simplified for development purposes
- User data is stored in memory and persists during the session
- All role validation and user mapping logic from the original system is preserved
- The system gracefully handles the transition between backend and mock modes

## Backend Recovery

When the backend becomes available again:
1. Clear browser localStorage (`localStorage.clear()`)
2. Refresh the application
3. The app will automatically use the real backend API

This ensures a smooth transition back to the production authentication system.