import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articleApi } from '../api/articleApi';
import { categoryApi } from '../api/categoryApi';
import ArticleCard from '../components/ArticleCard';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

const CategoryPage = () => {
    const { slug } = useParams();
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    const fetchArticles = async (page = 1) => {
        setLoading(true);
        try {
            const { data } = await articleApi.getAll({ category: slug, page, limit: 9 });
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
            .then(({ data }) => {
                const cats = data.data || [];
                setCategories(cats);
                const match = cats.find((c) => {
                    const catSlug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    return catSlug === slug;
                });
                if (match) setCategoryName(match.name);
                else setCategoryName(slug.replace(/-/g, ' '));
            })
            .catch(() => { });
    }, [slug]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 bg-primary rounded-full" />
                    <h1 className="text-2xl md:text-3xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)] capitalize">
                        {categoryName}
                    </h1>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] ml-4 pl-3">
                    Latest news and updates from {categoryName}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {loading ? (
                        <Loader type="cards" count={6} />
                    ) : articles.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {articles.map((article) => (
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
                            <p className="text-5xl mb-4">📂</p>
                            <p className="text-lg font-semibold text-[var(--color-text-primary)]">No articles in this category</p>
                            <p className="text-sm text-[var(--color-text-muted)] mt-1">Stay tuned for updates!</p>
                        </div>
                    )}
                </div>
                <div className="lg:col-span-1">
                    <Sidebar categories={categories} />
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
