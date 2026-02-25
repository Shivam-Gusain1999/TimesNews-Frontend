import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pageApi } from '../../api/pageApi';
import Loader from '../../components/Loader';
import { format } from 'date-fns';

const DynamicPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await pageApi.getPageBySlug(slug);
                if (res.data) {
                    setPage(res.data);
                } else {
                    navigate('/404');
                }
            } catch (error) {
                console.error("Failed to load page:", error);
                navigate('/404');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPage();
        }
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!page) return null;

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            {/* Page Header */}
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)] mb-4">
                    {page.title}
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span>Last updated: {format(new Date(page.updatedAt), 'MMMM d, yyyy')}</span>
                </div>
            </header>

            {/* Rich Text Content Area */}
            {/* The 'prose' classes come from Tailwind Typography plugin (if installed), 
                otherwise we use custom raw HTML styling below */}
            <article
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 md:p-10 shadow-sm
                           prose prose-lg dark:prose-invert max-w-none
                           [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:font-[var(--font-serif)]
                           [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-[var(--font-serif)]
                           [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-4
                           [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-[var(--color-text-secondary)]
                           [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-[var(--color-text-secondary)]
                           [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-[var(--color-text-secondary)]
                           [&_li]:mb-2
                           [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary-dark
                           [&_img]:rounded-xl [&_img]:my-8 [&_img]:max-w-full [&_img]:h-auto shadow-sm
                           [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-gray-500
                           [&_pre]:bg-gray-800 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto
                           "
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </main>
    );
};

export default DynamicPage;
