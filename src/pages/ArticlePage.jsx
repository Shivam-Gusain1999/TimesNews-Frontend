import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleApi } from '../api/articleApi';
import Loader from '../components/Loader';
import ArticleCard from '../components/ArticleCard';
import CommentSection from '../components/CommentSection';
import AdSlot from '../components/AdSlot';
import { HiClock, HiEye, HiTag, HiArrowLeft } from 'react-icons/hi';

const ArticlePage = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const { data } = await articleApi.getBySlug(slug);
                setArticle(data.data);

                // View Count Logic (Session Storage check)
                const viewedKey = `viewed_${data.data._id}`;
                if (!sessionStorage.getItem(viewedKey)) {
                    articleApi.incrementView(slug);
                    sessionStorage.setItem(viewedKey, 'true');
                }

                // Fetch related articles from same category
                if (data.data.category) {
                    const catSlug = data.data.category.slug || '';
                    const { data: relData } = await articleApi.getAll({ category: catSlug, limit: 4 });
                    setRelatedArticles(
                        (relData.data.articles || []).filter((a) => a.slug !== slug).slice(0, 3)
                    );
                }
            } catch {
                setArticle(null);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><Loader type="article" /></div>;

    if (!article) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <p className="text-5xl mb-4">😔</p>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Article Not Found</h2>
                <p className="text-[var(--color-text-muted)] mb-6">The article you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                    <HiArrowLeft size={16} /> Back to Home
                </Link>
            </div>
        );
    }

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <article className="max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--color-text-muted)] mb-4 sm:mb-6 overflow-hidden">
                <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
                <span className="shrink-0">/</span>
                {article.category && (
                    <>
                        <Link to={`/category/${article.category.slug}`} className="hover:text-primary transition-colors shrink-0">
                            {article.category.name}
                        </Link>
                        <span className="shrink-0">/</span>
                    </>
                )}
                <span className="text-[var(--color-text-secondary)] truncate">{article.title}</span>
            </div>

            {/* Category Badge */}
            {article.category && (
                <Link
                    to={`/category/${article.category.slug}`}
                    className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-md mb-4 hover:bg-primary hover:text-white transition-colors"
                >
                    {article.category.name}
                </Link>
            )}

            {/* Title */}
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)] leading-snug sm:leading-tight mb-4 sm:mb-5">
                {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-[var(--color-border)]">
                {article.author && (
                    <div className="flex items-center gap-3">
                        <img
                            src={article.author.avatar || `https://ui-avatars.com/api/?name=${article.author.fullName}&size=40&background=e94560&color=fff`}
                            alt={article.author.fullName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                        />
                        <div>
                            <p className="font-semibold text-sm text-[var(--color-text-primary)]">{article.author.fullName}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">@{article.author.username}</p>
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1.5"><HiClock size={15} /> {formatDate(article.createdAt)}</span>
                    <span className="flex items-center gap-1.5"><HiEye size={15} /> {article.views?.toLocaleString()} views</span>
                </div>
            </div>

            {/* Thumbnail */}
            <div className="relative overflow-hidden rounded-2xl mb-8">
                <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                />
            </div>

            {/* Inline Ad Slot */}
            <div className="my-8">
                <AdSlot type="adArticleInline" />
            </div>

            {/* Content */}
            <div className="article-content text-[var(--color-text-primary)] text-[15px] sm:text-base leading-relaxed sm:leading-loose">
                <p>{article.content}</p>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-2 flex-wrap">
                        <HiTag className="text-[var(--color-text-muted)]" size={16} />
                        {article.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-[var(--color-surface-alt)] text-xs font-medium rounded-full text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-7 bg-primary rounded-full" />
                        <h2 className="text-xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Related Articles</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedArticles.map((a) => (
                            <ArticleCard key={a._id} article={a} />
                        ))}
                    </div>
                </div>
            )}

            {/* Comment Section */}
            <CommentSection articleId={article._id} />
        </article>
    );
};

export default ArticlePage;
