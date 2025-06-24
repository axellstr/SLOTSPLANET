# Casino CMS Authentication Setup

## Overview

The Casino CMS now includes a secure login system to protect the admin dashboard. This ensures only authorized users can access and manage casino listings.

## Quick Setup

### 1. Set Environment Variables

Copy the `env.example` file to `.env.local` and set your admin credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` and set your credentials:

```bash
# Admin Authentication
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

### 2. Default Credentials

If no environment variables are set, the system uses these default credentials:

- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Important**: Change these default credentials immediately in production!

## Using the System

### Accessing the Admin Dashboard

1. Navigate to `/admin` in your browser
2. You'll see a professional login screen
3. Enter your username and password
4. Click "Sign In" to access the dashboard

### Features

- **Secure Authentication**: Session-based authentication with token verification
- **Auto-logout**: Sessions expire after 24 hours for security
- **Password Visibility**: Toggle password visibility with the eye icon
- **Loading States**: Professional loading indicators during authentication
- **Error Handling**: Clear error messages for invalid credentials
- **Logout Button**: Easy logout from the dashboard header

### Session Management

- Sessions are stored temporarily and expire after 24 hours
- Logging out immediately invalidates your session
- Refreshing the page verifies your session automatically
- Invalid sessions redirect back to login

## Security Features

### Current Implementation

- Environment-based credential configuration
- Session token generation and validation
- Automatic session expiry
- Client-side token storage with validation
- Protected API endpoints

### Production Recommendations

For production use, consider implementing:

1. **Database-stored user accounts** with hashed passwords
2. **Multi-factor authentication (MFA)**
3. **Role-based access control**
4. **Session storage in Redis or database**
5. **Rate limiting** for login attempts
6. **HTTPS enforcement**
7. **Regular security audits**

## Troubleshooting

### Can't Login

1. Verify your credentials in `.env.local`
2. Check browser console for any errors
3. Ensure the API endpoint `/api/auth` is accessible
4. Clear browser localStorage if needed

### Session Issues

1. Clear browser localStorage: `localStorage.removeItem('admin_token')`
2. Refresh the page to restart authentication
3. Check browser network tab for API call errors

### Environment Setup

1. Ensure `.env.local` file exists in the project root
2. Restart your development server after changing environment variables
3. Verify environment variables are loaded correctly

## API Endpoints

The authentication system uses these API endpoints:

- `POST /api/auth` - Login, logout, and session verification
  - Actions: `login`, `logout`, `verify`

## Development Notes

- The authentication system is designed to be simple but secure
- Sessions are stored in memory (restart clears all sessions)
- The login UI matches the admin dashboard design
- All authentication states are properly handled with loading indicators

---

**Need help?** Check the main README.md for general setup instructions or create an issue in the repository. 