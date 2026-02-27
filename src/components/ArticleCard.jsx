import { Link } from 'react-router-dom';
import { HiEye, HiClock } from 'react-icons/hi';

const ArticleCard = ({ article, variant = 'default' }) => {
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = [
            { label: 'y', seconds: 31536000 },
            { label: 'mo', seconds: 2592000 },
            { label: 'd', seconds: 86400 },
            { label: 'h', seconds: 3600 },
            { label: 'm', seconds: 60 },
        ];
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) return `${count}${interval.label} ago`;
        }
        return 'Just now';
    };

    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views;
    };

    if (variant === 'horizontal') {
        return (
            <Link to={`/article/${article.slug}`} className="group flex gap-4 p-3 rounded-xl hover:bg-[var(--color-surface-hover)] transition-all duration-300">
                <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-24 h-20 md:w-32 md:h-24 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                <div className="flex flex-col justify-center min-w-0">
                    {article.category && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
                            {article.category.name || article.category}
                        </span>
                    )}
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1"><HiClock size={12} /> {timeAgo(article.createdAt)}</span>
                        <span className="flex items-center gap-1"><HiEye size={12} /> {formatViews(article.views)}</span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/article/${article.slug}`} className="group block animate-fade-in">
            <div className="relative overflow-hidden rounded-xl">
                <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-48 md:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {article.isFeatured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg">
                        Featured
                    </span>
                )}
                {article.category && (
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider rounded-md">
                        {article.category.name || article.category}
                    </span>
                )}
            </div>
            <div className="mt-3 px-1">
                <h3 className="text-base font-bold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-text-muted)]">
                    {article.author && (
                        <div className="flex items-center gap-1.5">
                            <img
                                src={article.author.avatar || `https://ui-avatars.com/api/?name=${article.author.fullName}&size=24&background=e94560&color=fff`}
                                alt={article.author.fullName}
                                className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-medium text-[var(--color-text-secondary)]">{article.author.fullName}</span>
                        </div>
                    )}
                    <span className="flex items-center gap-1"><HiClock size={12} /> {timeAgo(article.createdAt)}</span>
                    <span className="flex items-center gap-1"><HiEye size={12} /> {formatViews(article.views)}</span>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
