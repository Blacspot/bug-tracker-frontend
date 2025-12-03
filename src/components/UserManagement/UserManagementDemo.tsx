import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import type { AppDispatch } from '../../store';
import { 
  getAllUsersThunk, 
  getProfileThunk, 
  updateProfileThunk, 
  changePasswordThunk, 
  deleteUserThunk 
} from '../../store/authSlice';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface Profile {
  username: string;
  email: string;
  // Add other profile fields as needed
}

export const UserManagementDemo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<User[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'profile'>('users');

  // Load all users (admin function)
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const result = await dispatch(getAllUsersThunk()).unwrap();
      setUsers(result);
    } catch (error) {
      toast.error(error as string || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Load user profile
  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const result = await dispatch(getProfileThunk()).unwrap();
      setProfile(result);
    } catch (error) {
      toast.error(error as string || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const handleUpdateProfile = async (profileData: Partial<Profile>) => {
    try {
      await dispatch(updateProfileThunk(profileData)).unwrap();
      toast.success('Profile updated successfully');
      loadProfile(); // Reload profile
    } catch (error) {
      toast.error(error as string || 'Failed to update profile');
    }
  };

  // Change password
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await dispatch(changePasswordThunk({ currentPassword, newPassword })).unwrap();
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error as string || 'Failed to change password');
    }
  };

  // Delete user (admin function)
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUserThunk(userId)).unwrap();
        toast.success('User deleted successfully');
        loadUsers(); // Reload users
      } catch (error) {
        toast.error(error as string || 'Failed to delete user');
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else {
      loadProfile();
    }
  }, [activeTab]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Management Demo</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('users')}
        >
          All Users (Admin)
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          {isLoading ? (
            <div className="loading loading-spinner" />
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">Role: {user.role}</p>
                  </div>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Profile</h2>
          {isLoading ? (
            <div className="loading loading-spinner" />
          ) : profile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleUpdateProfile(profile)}
              >
                Update Profile
              </button>

              <hr className="my-6" />

              <h3 className="text-lg font-semibold">Change Password</h3>
              <ChangePasswordForm onChangePassword={handleChangePassword} />
            </div>
          ) : (
            <p>No profile data available</p>
          )}
        </div>
      )}
    </div>
  );
};

// Component for changing password
interface ChangePasswordFormProps {
  onChangePassword: (current: string, newPassword: string) => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    onChangePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Current Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Confirm New Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-secondary">
        Change Password
      </button>
    </form>
  );
};
