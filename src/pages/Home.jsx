import { useState, useEffect } from 'react';
import { articleApi } from '../api/articleApi';
import { categoryApi } from '../api/categoryApi';
import HeroSection from '../components/HeroSection';
import ArticleCard from '../components/ArticleCard';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import AdSlot from '../components/AdSlot';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    const fetchArticles = async (page = 1) => {
        setLoading(true);
        try {
            const { data } = await articleApi.getAll({ page, limit: 9 });
            setArticles(data.data.articles || []);
            setPagination({
                page: data.data.pagination.page,
                totalPages: data.data.pagination.totalPages,
            });
        } catch {
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
        categoryApi.getAll()
            .then(({ data }) => setCategories(data.data || []))
            .catch(() => { });
    }, []);

    const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
    const regularArticles = articles.filter((a) => a !== featuredArticle);
    const trendingArticles = [...articles].sort((a, b) => b.views - a.views);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Hero Section */}
            {loading ? (
                <Loader type="hero" />
            ) : (
                featuredArticle && <HeroSection article={featuredArticle} />
            )}

            {/* Header Ad Slot */}
            <div className="mt-8">
                <AdSlot type="adHeader" />
            </div>

            {/* Breaking News Ticker */}
            {!loading && articles.length > 0 && (
                <div className="mt-6 bg-[var(--color-surface-alt)] rounded-xl px-4 py-2.5 flex items-center gap-3 overflow-hidden">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shrink-0 animate-pulse">
                        Breaking
                    </span>
                    <div className="overflow-hidden whitespace-nowrap">
                        <div className="inline-block animate-[marquee_30s_linear_infinite]">
                            {articles.slice(0, 5).map((a, i) => (
                                <span key={a._id} className="text-sm text-[var(--color-text-secondary)] mx-6">
                                    {i > 0 && <span className="text-primary mx-3">•</span>}
                                    {a.title}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content + Sidebar */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Articles Grid */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-7 bg-primary rounded-full" />
                        <h2 className="text-xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Latest News</h2>
                    </div>

                    {loading ? (
                        <Loader type="cards" count={6} />
                    ) : regularArticles.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {regularArticles.map((article) => (
                                    <ArticleCard key={article._id} article={article} />
                                ))}
                            </div>
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={fetchArticles}
                            />
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-5xl mb-4">📰</p>
                            <p className="text-lg font-semibold text-[var(--color-text-primary)]">No articles yet</p>
                            <p className="text-sm text-[var(--color-text-muted)] mt-1">Check back soon for the latest news!</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Sidebar trendingArticles={trendingArticles} categories={categories} />
                </div>
            </div>
        </div>
    );
};

export default Home;
