import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { pollApi } from '../../api/pollApi';
import Loader from '../../components/Loader';
import { HiOutlineChartPie, HiPlus, HiX, HiOutlineTrash, HiOutlineRefresh } from 'react-icons/hi';
import { format } from 'date-fns';

const ManagePolls = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state for new poll
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([{ text: '' }, { text: '' }]);
    const [status, setStatus] = useState('active');

    const fetchPolls = async () => {
        try {
            setLoading(true);
            const res = await pollApi.getAllPollsAdmin();
            if (res.data) setPolls(res.data);
        } catch (error) {
            toast.error('Failed to load polls');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
    }, []);

    const handleAddOption = () => {
        if (options.length >= 10) return toast.error("Maximum 10 options allowed");
        setOptions([...options, { text: '' }]);
    };

    const handleRemoveOption = (index) => {
        if (options.length <= 2) return toast.error("Minimum 2 options required");
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!question.trim()) return toast.error("Question is required");
        const validOptions = options.filter(opt => opt.text.trim() !== '');
        if (validOptions.length < 2) return toast.error("At least two valid options are required");

        setSaving(true);
        try {
            await pollApi.createPoll({
                question,
                options: validOptions,
                status
            });
            toast.success('Poll created successfully!');

            // Reset form
            setQuestion('');
            setOptions([{ text: '' }, { text: '' }]);
            setStatus('active');
            setIsCreating(false);

            // Refresh list
            fetchPolls();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create poll');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        try {
            await pollApi.updatePollStatus(id, newStatus);
            toast.success(`Poll marked as ${newStatus}`);
            setPolls(polls.map(p => p._id === id ? { ...p, status: newStatus } : p));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this poll entirely?')) return;
        try {
            await pollApi.deletePoll(id);
            toast.success('Poll deleted');
            setPolls(polls.filter(p => p._id !== id));
        } catch (error) {
            toast.error('Failed to delete poll');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                        <HiOutlineChartPie size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Manage Polls</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Create interactive polls to engage your readers.</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium text-sm"
                >
                    {isCreating ? <HiX size={18} /> : <HiPlus size={18} />}
                    {isCreating ? "Cancel" : "Create New Poll"}
                </button>
            </div>

            {/* Create Poll Form */}
            {isCreating && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm mb-8 animate-fade-in">
                    <h3 className="font-semibold text-lg text-[var(--color-text-primary)] mb-4">Create a new Poll</h3>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Question</label>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="E.g. Who will win the 2026 World Cup?"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Options</label>
                            <div className="space-y-2">
                                {options.map((opt, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 px-4 py-2 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary"
                                        />
                                        {options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(index)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                            >
                                                <HiX size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {options.length < 10 && (
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="mt-2 text-sm text-primary font-medium hover:underline flex items-center gap-1"
                                >
                                    <HiPlus size={16} /> Add another option
                                </button>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors disabled:opacity-70"
                            >
                                {saving ? <Loader size="w-5 h-5" /> : 'Publish Poll'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Polls List */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-12"><Loader /></div>
                    ) : polls.length === 0 ? (
                        <div className="text-center py-12 text-[var(--color-text-secondary)]">
                            No polls have been created yet.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)]">
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Question</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Total Votes</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Date</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {polls.map((poll) => {
                                    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                                    return (
                                        <tr key={poll._id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-[var(--color-text-primary)]">{poll.question}</p>
                                                <div className="mt-2 space-y-1">
                                                    {poll.options.map((opt, i) => (
                                                        <div key={i} className="text-xs flex justify-between text-[var(--color-text-secondary)]">
                                                            <span>- {opt.text}</span>
                                                            <span className="font-medium">{opt.votes} votes</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 font-semibold text-primary">
                                                {totalVotes}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${poll.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                                    {poll.status === 'active' ? 'Active' : 'Closed'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                                                {format(new Date(poll.createdAt), 'MMM d, yyyy')}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(poll._id, poll.status)}
                                                        className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                                                        title={poll.status === 'active' ? 'Close Poll' : 'Re-open Poll'}
                                                    >
                                                        <HiOutlineRefresh size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(poll._id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                                        title="Delete Poll"
                                                    >
                                                        <HiOutlineTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagePolls;
