import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentApi } from '../api/commentApi';
import toast from 'react-hot-toast';
import { HiTrash, HiUserCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const CommentSection = ({ articleId }) => {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const { data } = await commentApi.getAll(articleId);
            setComments(data.data.comments || []);
        } catch (error) {
            console.error("Failed to load comments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (articleId) fetchComments();
    }, [articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            const { data } = await commentApi.add(articleId, content);
            // Optimistic update or refetch
            setComments([data.data, ...comments]);
            setContent('');
            toast.success('Comment posted!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await commentApi.delete(commentId);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success('Comment deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const canDelete = (comment) => {
        if (!user) return false;
        // 1. Owner can delete
        if (comment.owner._id === user._id) return true;
        // 2. Admin/Editor can delete
        if (['admin', 'editor'].includes(user.role)) return true;
        return false;
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] animate-fade-in">
            <h3 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)] mb-6">
                Comments ({comments.length})
            </h3>

            {/* Input Area */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-4">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}`}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 hidden sm:block"
                        />
                        <div className="flex-1">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What are your thoughts?"
                                className="w-full p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-[var(--color-text-primary)]"
                                rows="3"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={submitting || !content.trim()}
                                    className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark active:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                                >
                                    {submitting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-[var(--color-surface-alt)] p-6 rounded-xl text-center mb-8 border border-[var(--color-border)]">
                    <p className="text-[var(--color-text-muted)] mb-3">Join the conversation</p>
                    <Link to="/login" className="inline-block px-6 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
                        Log in to comment
                    </Link>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-4 text-[var(--color-text-muted)]">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-[var(--color-text-muted)] italic">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 group">
                            <img
                                src={comment.owner?.avatar || `https://ui-avatars.com/api/?name=User`}
                                alt={comment.owner?.fullName}
                                className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--color-border)] flex-shrink-0"
                            />
                            <div className="flex-1">
                                <div className="bg-[var(--color-surface-alt)] p-4 rounded-xl rounded-tl-none border border-[var(--color-border)]">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="font-bold text-sm text-[var(--color-text-primary)] mr-2">
                                                {comment.owner?.fullName || 'Unknown User'}
                                            </span>
                                            {['admin', 'editor'].includes(comment.owner?.role) && (
                                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                                                    {comment.owner.role}
                                                </span>
                                            )}
                                            <span className="text-xs text-[var(--color-text-muted)] ml-2">
                                                • {timeAgo(comment.createdAt)}
                                            </span>
                                        </div>
                                        {canDelete(comment) && (
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="text-[var(--color-text-muted)] hover:text-red-500 active:text-red-600 transition-colors p-2 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 min-w-[36px] min-h-[36px] flex items-center justify-center"
                                                title="Delete Comment"
                                            >
                                                <HiTrash size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[var(--color-text-secondary)] text-sm whitespace-pre-wrap leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
