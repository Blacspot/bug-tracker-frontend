// Mock authentication service for fallback when backend is unavailable
export interface MockUser {
  UserID: number;
  Username: string;
  Email: string;
  Role: string;
  IsVerified: boolean;
  CreatedAt: string;
  CodeExpiry?: string | null;
}

export interface MockLoginResponse {
  success: boolean;
  token: string;
  user: MockUser;
  message: string;
}

// Mock user database
const MOCK_USERS: Record<string, { password: string; user: MockUser }> = {
  'admin@bugtrack.com': {
    password: 'admin123',
    user: {
      UserID: 1,
      Username: 'Admin User',
      Email: 'admin@bugtrack.com',
      Role: 'Admin',
      IsVerified: true,
      CreatedAt: '2024-01-01T00:00:00.000Z'
    }
  },
  'user1@bugtrack.com': {
    password: 'user123',
    user: {
      UserID: 2,
      Username: 'John User',
      Email: 'user1@bugtrack.com',
      Role: 'User',
      IsVerified: true,
      CreatedAt: '2024-01-02T00:00:00.000Z'
    }
  },
  'user2@bugtrack.com': {
    password: 'user123',
    user: {
      UserID: 3,
      Username: 'Jane User',
      Email: 'user2@bugtrack.com',
      Role: 'User',
      IsVerified: true,
      CreatedAt: '2024-01-03T00:00:00.000Z'
    }
  },
  'obwogemcbride73@gmail.com': {
    password: 'password123',
    user: {
      UserID: 22,
      Username: 'blacs2',
      Email: 'obwogemcbride73@gmail.com',
      Role: 'User',
      IsVerified: true,
      CreatedAt: '2025-12-03T08:50:59.300Z'
    }
  }
};

// Generate a mock JWT token
function generateMockToken(user: MockUser): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.UserID.toString(),
    email: user.Email,
    role: user.Role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));
  const signature = btoa('mock-signature-' + user.UserID);
  return `${header}.${payload}.${signature}`;
}

export const mockAuthService = {
  async login(email: string, password: string): Promise<MockLoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userRecord = MOCK_USERS[email.toLowerCase()];
    
    if (!userRecord) {
      return {
        success: false,
        token: '',
        user: {} as MockUser,
        message: 'User not found'
      };
    }

    if (userRecord.password !== password) {
      return {
        success: false,
        token: '',
        user: {} as MockUser,
        message: 'Invalid password'
      };
    }

    if (!userRecord.user.IsVerified) {
      return {
        success: false,
        token: '',
        user: {} as MockUser,
        message: 'Email not verified'
      };
    }

    const token = generateMockToken(userRecord.user);
    
    return {
      success: true,
      token,
      user: userRecord.user,
      message: 'Login successful (Mock Mode)'
    };
  },

  async register(username: string, email: string, password: string): Promise<{ success: boolean; message: string; user?: MockUser }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    if (MOCK_USERS[email.toLowerCase()]) {
      return {
        success: false,
        message: 'User already exists'
      };
    }

    // Create new user
    const newUser: MockUser = {
      UserID: Date.now(), // Simple ID generation
      Username: username,
      Email: email,
      Role: 'User',
      IsVerified: true, // Auto-verify in mock mode
      CreatedAt: new Date().toISOString()
    };

    // Add to mock database
    MOCK_USERS[email.toLowerCase()] = {
      password,
      user: newUser
    };

    return {
      success: true,
      message: 'Registration successful (Mock Mode)',
      user: newUser
    };
  },

  async getProfile(token: string): Promise<MockUser | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email;
      const userRecord = MOCK_USERS[email.toLowerCase()];
      
      if (!userRecord) {
        return null;
      }

      return userRecord.user;
    } catch {
      return null;
    }
  }
};