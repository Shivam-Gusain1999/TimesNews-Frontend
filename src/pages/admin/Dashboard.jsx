import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Link } from 'react-router-dom';
import { HiDocumentText, HiEye, HiArchive, HiTag, HiTrendingUp, HiClock } from 'react-icons/hi';
import Loader from '../../components/Loader';

const statConfig = [
    { key: 'totalArticles', label: 'Total Articles', icon: HiDocumentText, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600', link: '/admin/articles' },
    { key: 'totalViews', label: 'Total Views', icon: HiEye, color: 'bg-green-500', light: 'bg-green-50 text-green-600', link: '/admin/articles' },
    { key: 'totalCategories', label: 'Categories', icon: HiTag, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600', link: '/admin/categories' },
    { key: 'archivedArticles', label: 'Archived', icon: HiArchive, color: 'bg-orange-500', light: 'bg-orange-50 text-orange-600', link: '/admin/articles?status=ARCHIVED' },
];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getDashboardStats()
            .then(({ data }) => setStats(data.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loader type="spinner" />;

    const formatNumber = (n) => {
        if (!n) return '0';
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
        return n.toString();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statConfig.map(({ key, label, icon: Icon, light, link }) => (
                    <Link to={link || '#'} key={key} className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer block group ${!link && 'pointer-events-none'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-text-muted)] group-hover:text-primary transition-colors">{label}</p>
                                <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{formatNumber(stats?.[key])}</p>
                            </div>
                            <div className={`w-11 h-11 rounded-xl ${light} flex items-center justify-center`}>
                                <Icon size={22} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    to="/admin/articles"
                    className="flex items-center gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <HiDocumentText size={24} className="text-primary group-hover:text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--color-text-primary)]">Manage Articles</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Create, edit, and manage news articles</p>
                    </div>
                </Link>
                <Link
                    to="/admin/categories"
                    className="flex items-center gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                        <HiTag size={24} className="text-purple-500 group-hover:text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--color-text-primary)]">Manage Categories</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Organize content with categories</p>
                    </div>
                </Link>
            </div>

            {/* Latest Articles Table */}
            {stats?.latestArticles?.length > 0 && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
                        <HiTrendingUp className="text-primary" size={18} />
                        <h3 className="font-semibold text-[var(--color-text-primary)]">Latest Articles</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]">
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Title</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Category</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Views</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.latestArticles.map((article) => (
                                    <tr key={article._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                {article.thumbnail && (
                                                    <img src={article.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                )}
                                                <span className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-1">{article.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
                                                {article.category?.name || '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-[var(--color-text-secondary)]">
                                            <span className="flex items-center gap-1"><HiEye size={14} /> {formatNumber(article.views)}</span>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-[var(--color-text-muted)]">
                                            <span className="flex items-center gap-1"><HiClock size={14} /> {new Date(article.createdAt).toLocaleDateString()}</span>
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

export default Dashboard;
