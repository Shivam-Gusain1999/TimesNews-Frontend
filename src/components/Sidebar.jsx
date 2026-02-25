import { Link } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import { HiTrendingUp, HiTag } from 'react-icons/hi';
import NewsletterForm from './NewsletterForm';
import PublicPoll from './PublicPoll';
import AdSlot from './AdSlot';

const Sidebar = ({ trendingArticles = [], categories = [] }) => {
    return (
        <aside className="space-y-8">
            {/* Sidebar Ad Widget */}
            <AdSlot type="adSidebar" />

            {/* Trending Articles */}
            {trendingArticles.length > 0 && (
                <div className="bg-[var(--color-surface-alt)] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <HiTrendingUp className="text-primary" size={20} />
                        <h3 className="font-bold text-base text-[var(--color-text-primary)]">Trending Now</h3>
                    </div>
                    <div className="space-y-1">
                        {trendingArticles.slice(0, 5).map((article, i) => (
                            <div key={article._id} className="flex items-start gap-3">
                                <span className="text-2xl font-bold text-primary/30 shrink-0 w-8 text-center">{i + 1}</span>
                                <ArticleCard article={article} variant="horizontal" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <div className="bg-[var(--color-surface-alt)] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <HiTag className="text-primary" size={18} />
                        <h3 className="font-bold text-base text-[var(--color-text-primary)]">Categories</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                            const catSlug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                            return (
                                <Link
                                    key={cat._id}
                                    to={`/category/${catSlug}`}
                                    className="px-3.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-medium text-[var(--color-text-secondary)] hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                                >
                                    {cat.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Poll Widget */}
            <PublicPoll />

            {/* Newsletter Box */}
            <div className="mt-6">
                <NewsletterForm />
            </div>
        </aside>
    );
};

export default Sidebar;
