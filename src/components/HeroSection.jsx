import { Link } from 'react-router-dom';
import { HiEye, HiClock } from 'react-icons/hi';

const HeroSection = ({ article }) => {
    if (!article) return null;

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <section className="relative overflow-hidden rounded-xl sm:rounded-2xl group">
            <Link to={`/article/${article.slug}`} className="block">
                {/* Background Image */}
                <div className="relative h-[280px] sm:h-[400px] md:h-[500px]">
                    <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient Overlay — stronger on mobile for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent sm:from-black/90 sm:via-black/40" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                            <span className="px-2.5 sm:px-3 py-1 bg-primary text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md">
                                {article.category?.name || 'Breaking News'}
                            </span>
                            {article.isFeatured && (
                                <span className="px-2.5 sm:px-3 py-1 bg-yellow-400 text-black text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md">
                                    ⚡ Featured
                                </span>
                            )}
                        </div>
                        <h1 className="text-lg sm:text-2xl md:text-4xl font-bold font-[var(--font-serif)] text-white leading-tight mb-2 sm:mb-3 max-w-3xl line-clamp-3 sm:line-clamp-none">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-x-3 sm:gap-x-4 gap-y-1 flex-wrap text-white/70 text-xs sm:text-sm">
                            {article.author && (
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <img
                                        src={article.author.avatar || `https://ui-avatars.com/api/?name=${article.author.fullName}&size=32&background=e94560&color=fff`}
                                        alt={article.author.fullName}
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white/20"
                                    />
                                    <span className="font-medium text-white">{article.author.fullName}</span>
                                </div>
                            )}
                            <span className="flex items-center gap-1"><HiClock size={14} /> {timeAgo(article.createdAt)}</span>
                            <span className="flex items-center gap-1"><HiEye size={14} /> {article.views?.toLocaleString()} views</span>
                        </div>
                    </div>
                </div>
            </Link>
        </section>
    );
};

export default HeroSection;
