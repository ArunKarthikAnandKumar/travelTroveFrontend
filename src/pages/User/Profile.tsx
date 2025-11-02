import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../../api/userServices';
import { getToken } from '../../utils/token';

interface ProfileData {
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    userName: '',
    email: '',
    phoneNumber: '',
    country: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setError('Please login to view your profile');
        return;
      }
      const response = await getUserProfile();
      if (response.error === false) {
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to fetch profile');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!profile.userName.trim()) {
      setError('User name is required');
      return false;
    }
    if (!profile.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (changePassword) {
      if (!passwordData.newPassword) {
        setError('New password is required');
        return false;
      }
      if (passwordData.newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(passwordData.newPassword)) {
        setError('Password must include uppercase, lowercase, number and special character');
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const updateData: any = {
        userName: profile.userName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        country: profile.country
      };

      if (changePassword && passwordData.newPassword) {
        updateData.password = passwordData.newPassword;
      }

      const response = await updateUserProfile(updateData);
      if (response.error === false) {
        setProfile(response.data);
        setIsEditing(false);
        setChangePassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
    setChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-person-circle me-2"></i>My Profile
                </h4>
                {!isEditing && (
                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bi bi-pencil me-1"></i>Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}

              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {success}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess(null)}
                  ></button>
                </div>
              )}

              <form>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">User Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="userName"
                        value={profile.userName}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p className="form-control-plaintext">{profile.userName || 'N/A'}</p>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p className="form-control-plaintext">{profile.email || 'N/A'}</p>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="form-control"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="10 digit phone number"
                      />
                    ) : (
                      <p className="form-control-plaintext">{profile.phoneNumber || 'N/A'}</p>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Country</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={profile.country}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p className="form-control-plaintext">{profile.country || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mb-4">
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="changePassword"
                        checked={changePassword}
                        onChange={(e) => setChangePassword(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="changePassword">
                        Change Password
                      </label>
                    </div>

                    {changePassword && (
                      <div className="border rounded p-3 bg-light">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Minimum 8 characters with uppercase, lowercase, number and special character"
                            minLength={8}
                          />
                          <small className="form-text text-muted">
                            Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                          </small>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Confirm Password</label>
                          <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm your new password"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
