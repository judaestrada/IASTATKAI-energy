import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || ''
  });

  if (!userProfile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">My Profile</h1>
        <p className="text-ink-600">Manage your account information and preferences.</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">Personal Information</h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-brand-600 font-medium text-sm hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1">Address</label>
                <textarea 
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit"
                  className="px-6 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-slate-100 text-ink-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Full Name</p>
                  <p className="font-medium text-ink-900">{userProfile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="font-medium text-ink-900">{userProfile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Phone</p>
                  <p className="font-medium text-ink-900">{userProfile.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Role</p>
                  <p className="font-medium text-brand-600 capitalize">{userProfile.role}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Address</p>
                <p className="font-medium text-ink-900">{userProfile.address || 'Not provided'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
