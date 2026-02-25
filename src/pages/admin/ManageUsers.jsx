import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { HiSearch, HiBan, HiCheckCircle, HiUserAdd, HiX } from 'react-icons/hi';
import Loader from '../../components/Loader';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        role: 'editor',
        avatar: null
    });

    const fetchUsers = () => {
        setLoading(true);
        adminApi.getUsers({ search, role: roleFilter, limit: 50 })
            .then(({ data }) => setUsers(data.data.users || []))
            .catch(() => toast.error('Failed to load users'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, [search, roleFilter]);

    // ... (handleBlockToggle, handleRoleChange, handleCreateUser functions same rahenge) ...
    // Note: Code short rakhne ke liye wo functions repeat nahi kar raha hu, wo waise hi rakhna.
    // Agar wo bhi chahiye to bata dena.

    const handleBlockToggle = async (user) => {
        if (!window.confirm(`Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} ${user.fullName}?`)) return;
        try {
            await adminApi.toggleBlockUser(user._id);
            toast.success(`User ${user.isBlocked ? 'Unblocked' : 'Blocked'}`);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Change user role to ${newRole.toUpperCase()}?`)) return;
        try {
            await adminApi.updateUserRole(userId, newRole);
            toast.success('User role updated');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update role');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('role', formData.role);
            if (formData.avatar) data.append('avatar', formData.avatar);

            await adminApi.createUser(data);
            toast.success('User created successfully');
            setShowForm(false);
            setFormData({ fullName: '', username: '', email: '', password: '', role: 'editor', avatar: null });
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };


    const inputClass = "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all";

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto"> {/* Added max-width container */}

            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 w-full sm:max-w-xs">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                        />
                    </div>
                    {/* Filter Dropdown */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="reporter">Reporter</option>
                        <option value="user">User</option>
                    </select>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-600/20 transition-all active:scale-95"
                >
                    <HiUserAdd size={18} />
                    <span>Add Member</span>
                </button>
            </div>

            {/* --- MODAL (POPUP) FIX --- */}
            {showForm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
                    onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
                >
                    {/* Modal Content Wrapper - Max Height & Scroll Fix */}
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-up">

                        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">Add New Team Member</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                <HiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-6 space-y-5">
                            {/* Avatar Section */}
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 group hover:border-red-400 transition-colors">
                                    {formData.avatar ? (
                                        <img src={URL.createObjectURL(formData.avatar)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <HiUserAdd className="text-gray-400 group-hover:text-red-400 transition-colors" size={32} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData({ ...formData, avatar: e.target.files[0] })}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-colors cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Full Name</label>
                                    <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className={inputClass} placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Username</label>
                                    <input required type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className={inputClass} placeholder="john_doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Email Address</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="john@example.com" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Password</label>
                                    <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className={inputClass} placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Assign Role</label>
                                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className={inputClass}>
                                        <option value="editor">Editor</option>
                                        <option value="reporter">Reporter</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all mt-2 shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed">
                                {submitting ? 'Creating...' : 'Create Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- TABLE SECTION --- */}
            {loading ? <div className="py-20 flex justify-center"><Loader type="spinner" /></div> : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar"> {/* Horizontal Scroll Enable */}
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">User Details</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-12 text-gray-400">No users found.</td></tr>
                                ) : users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                                                        alt=""
                                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                                                    />
                                                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{user.fullName}</p>
                                                    <p className="text-xs text-gray-500 font-mono">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-none focus:ring-0 cursor-pointer transition-all appearance-none
                                                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        user.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                                                            user.role === 'reporter' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-gray-100 text-gray-700'}`}
                                            >
                                                <option value="admin">ADMIN</option>
                                                <option value="editor">EDITOR</option>
                                                <option value="reporter">REPORTER</option>
                                                <option value="user">USER</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isBlocked ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                                                    <HiBan size={14} /> BLOCKED
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                                    <HiCheckCircle size={14} /> ACTIVE
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleBlockToggle(user)}
                                                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors
                                                    ${user.isBlocked
                                                        ? 'text-green-600 bg-green-50 hover:bg-green-100'
                                                        : 'text-red-500 bg-white hover:bg-red-50 border border-gray-200'}`}
                                            >
                                                {user.isBlocked ? "Unblock" : "Block"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;