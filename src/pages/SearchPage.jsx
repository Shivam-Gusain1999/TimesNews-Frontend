import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { articleApi } from '../api/articleApi';
import ArticleCard from '../components/ArticleCard';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { HiSearch } from 'react-icons/hi';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    const fetchResults = async (page = 1) => {
        if (!query) { setArticles([]); setLoading(false); return; }
        setLoading(true);
        try {
            const { data } = await articleApi.getAll({ search: query, page, limit: 9 });
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

    useEffect(() => { fetchResults(); }, [query]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <HiSearch size={24} className="text-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                        Search Results
                    </h1>
                </div>
                {query && (
                    <p className="text-[var(--color-text-muted)]">
                        Showing results for "<span className="font-semibold text-[var(--color-text-primary)]">{query}</span>"
                    </p>
                )}
            </div>

            {loading ? (
                <Loader type="cards" count={6} />
            ) : articles.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <ArticleCard key={article._id} article={article} />
                        ))}
                    </div>
                    <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchResults} />
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-lg font-semibold text-[var(--color-text-primary)]">No results found</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Try different keywords or browse categories</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
