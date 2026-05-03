import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiSave, FiEdit2, FiCheck, FiPhone, FiAlertCircle, FiEye, FiEyeOff, FiMail, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../features/auth/authHooks';
import { toast } from 'react-hot-toast';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user, updateUser, updatePassword, login } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        username: user?.username || '',
        email: user?.email || '',
        mobile: user?.number || '',
        gender: user?.gender || '',
        dob: user?.date_of_birth || '',
    });

    // Password State
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                username: user.username,
                email: user.email,
                mobile: user.number,
                gender: user.gender,
                dob: user.date_of_birth
            });
        }
    }, [user]);

    const handleVerifyPassword = async () => {
        if (!user?.email || !passwords.current) return;
        const success = await login(user.email, passwords.current);
        if (success) {
            setIsPasswordVerified(true);
            toast.success('Identity verified. Security portal open.');
        } else {
            toast.error('Authentication failed. Incorrect password.');
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const updates = {
            username: profile.username,
            email: profile.email,
            number: profile.mobile,
            gender: profile.gender,
            date_of_birth: profile.dob
        };
        const success = await updateUser(updates);
        setIsSaving(false);
        if (success) {
            setIsSaved(true);
            setIsEditing(false);
            toast.success('Core profile synchronized successfully.');
            setTimeout(() => setIsSaved(false), 3000);
        } else {
            toast.error('Synchronization failed. Check connectivity or unique constraints.');
        }
    };

    const handleUpdatePassword = async () => {
        if (passwords.new.length < 6) {
            toast.error('Security protocols require at least 6 characters.');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            toast.error('Password mismatch detected.');
            return;
        }
        const success = await updatePassword(passwords.new);
        if (success) {
            toast.success('Access keys rotated successfully.');
            setPasswords({ current: '', new: '', confirm: '' });
            setIsPasswordVerified(false);
        } else {
            toast.error('Failed to rotate access keys.');
        }
    };

    return (
        <PageShell className="pb-32 animate-in fade-in duration-700">
            <PageHeader 
                title="Account Architecture"
                subtitle="Manage your personal identity and security infrastructure."
                icon={<FiUser className="text-indigo-600" />}
            />

            <div className="mt-12 flex flex-col lg:flex-row gap-12">
                {/* Left Sidebar: Identity Card */}
                <div className="lg:w-1/3">
                    <div className="bg-indigo-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 p-1 mb-8 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                                    alt="Identity"
                                    className="w-full h-full rounded-[2rem] object-cover"
                                />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter mb-2">{user?.username}</h2>
                            <p className="text-indigo-300/60 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Elite Tier Member</p>
                            
                            <div className="w-full space-y-4 pt-10 border-t border-white/5">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-indigo-200/40">
                                    <span>Member Since</span>
                                    <span className="text-white">Q1 2024</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-indigo-200/40">
                                    <span>Account Status</span>
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                        Verified
                                    </div>
                                </div>
                            </div>

                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="mt-12 w-full py-5 bg-white/10 hover:bg-white text-white hover:text-indigo-950 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all border border-white/10 flex items-center justify-center gap-3"
                                >
                                    <FiEdit2 /> Modify Identity
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Content: Forms */}
                <div className="lg:w-2/3 space-y-12">
                    {/* Personal Details */}
                    <div className={`bg-white border border-indigo-50 p-10 md:p-12 rounded-[3.5rem] shadow-sm relative transition-all duration-700 ${!isEditing ? 'opacity-60 cursor-not-allowed select-none overflow-hidden' : 'opacity-100'}`}>
                        {!isEditing && <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[1px]"></div>}
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                <FiUser size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">Core Identity</h3>
                        </div>

                        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest ml-2">Display Alias</label>
                                <div className="relative group">
                                    <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-200 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        className="w-full pl-14 pr-6 py-5 bg-indigo-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-indigo-950 text-sm"
                                        placeholder="Username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest ml-2">Communication Node</label>
                                <div className="relative group">
                                    <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-200 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="email"
                                        disabled={!isEditing}
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full pl-14 pr-6 py-5 bg-indigo-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-indigo-950 text-sm"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest ml-2">Mobile Verification</label>
                                <div className="relative group">
                                    <FiPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-200 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="tel"
                                        disabled={!isEditing}
                                        value={profile.mobile}
                                        onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                                        className="w-full pl-14 pr-6 py-5 bg-indigo-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-indigo-950 text-sm"
                                        placeholder="Mobile Number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest ml-2">Biological Chronology</label>
                                <div className="relative group">
                                    <FiCalendar className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-200 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="date"
                                        disabled={!isEditing}
                                        value={profile.dob}
                                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                        className="w-full pl-14 pr-6 py-5 bg-indigo-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-indigo-950 text-sm"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="md:col-span-2 flex items-center gap-4 mt-4 animate-in slide-in-from-bottom-2 duration-500">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-5 bg-indigo-50 text-indigo-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-100 transition-all"
                                    >
                                        Abort Changes
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className={`flex-[2] py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl flex items-center justify-center gap-3 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                    >
                                        {isSaving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : isSaved ? (
                                            <><FiCheck size={18} /> Sync Complete</>
                                        ) : (
                                            <><FiSave size={18} /> Synchronize Profile</>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Security Settings */}
                    <div className={`bg-white border border-indigo-50 p-10 md:p-12 rounded-[3.5rem] shadow-sm relative transition-all duration-700 ${!isEditing ? 'opacity-60' : 'opacity-100'}`}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                <FiLock size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">Security Protocol</h3>
                        </div>

                        {!isPasswordVerified ? (
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-8 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest ml-2">Current Authorization Key</label>
                                    <div className="relative group">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            disabled={!isEditing}
                                            value={passwords.current}
                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                            className="w-full px-8 py-5 bg-indigo-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-indigo-950 text-sm tracking-widest"
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-200 hover:text-indigo-600 transition-colors"
                                        >
                                            {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <button
                                        onClick={handleVerifyPassword}
                                        disabled={!isEditing || !passwords.current}
                                        className="flex-1 py-5 bg-indigo-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-20"
                                    >
                                        Verify Identity for Key Rotation
                                    </button>
                                    <Link 
                                        to="/forgot-password"
                                        className="flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        <FiAlertCircle /> Lost Authorization?
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-8 animate-in slide-in-from-right-8 duration-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest ml-2">New Security Key</label>
                                        <div className="relative group">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                className="w-full px-8 py-5 bg-emerald-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-600 outline-none transition-all font-black text-indigo-950 text-sm tracking-widest"
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-600 transition-colors"
                                            >
                                                {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-indigo-900/30 uppercase tracking-widest ml-2">Confirm Rotation</label>
                                        <div className="relative group">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                className="w-full px-8 py-5 bg-emerald-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-600 outline-none transition-all font-black text-indigo-950 text-sm tracking-widest"
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-600 transition-colors"
                                            >
                                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <button 
                                        onClick={() => setIsPasswordVerified(false)}
                                        className="px-8 py-5 bg-indigo-50 text-indigo-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-100 transition-all"
                                    >
                                        Revert
                                    </button>
                                    <button 
                                        onClick={handleUpdatePassword}
                                        className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-xl"
                                    >
                                        Execute Key Rotation
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default Profile;
