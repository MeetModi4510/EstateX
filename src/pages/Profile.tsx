import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { updateProfile } from '../api/client';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: 'Arjun',
    lastName: 'Kumar',
    email: 'arjun.kumar@estatex.com',
    phone: '+91 98765 12345',
    licenseNo: 'RERA-MH-123456'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const nameParts = (user.name || '').split(' ');
        setProfile({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || '+91 98765 12345',
          licenseNo: user.licenseNumber || 'RERA-MH-123456'
        });
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const name = `${profile.firstName} ${profile.lastName}`.trim();
      const updatedData = await updateProfile({
        name,
        email: profile.email,
        phone: profile.phone,
        licenseNumber: profile.licenseNo
      });

      // Backend returns updated user info, store it
      const userStr = localStorage.getItem('user');
      let user = {};
      if (userStr) {
        try { user = JSON.parse(userStr); } catch (e) {}
      }
      
      const mergedUser = {
        ...user,
        ...updatedData.user
      };
      
      localStorage.setItem('user', JSON.stringify(mergedUser));
      setSaved(true);
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase() || 'BR';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Broker Profile</h1>
        <p className="text-neutral-secondary">Manage your professional information and credentials.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-divider flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl overflow-hidden">
              {initials}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl text-neutral-primary">{profile.firstName} {profile.lastName}</h3>
            <p className="text-neutral-secondary mb-3">Senior Real Estate Broker</p>
            <Button size="sm" variant="outline">Update Photo</Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-primary mb-2">First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={profile.firstName} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-primary mb-2">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={profile.lastName} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-neutral-primary mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={profile.email} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-neutral-primary mb-2">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={profile.phone} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-neutral-primary mb-2">Broker License No.</label>
              <input 
                type="text" 
                name="licenseNo"
                value={profile.licenseNo} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-border focus:border-primary outline-none" 
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving || saved}>
              {saved ? (
                <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Saved</span>
              ) : isSaving ? (
                'Saving...'
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
