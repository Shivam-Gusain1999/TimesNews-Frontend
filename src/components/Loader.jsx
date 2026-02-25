const Loader = ({ type = 'spinner', count = 3 }) => {
    if (type === 'spinner') {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (type === 'cards') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="skeleton h-48 rounded-xl mb-3" />
                        <div className="skeleton h-4 w-20 rounded mb-2" />
                        <div className="skeleton h-5 rounded mb-1" />
                        <div className="skeleton h-5 w-3/4 rounded mb-3" />
                        <div className="flex gap-3">
                            <div className="skeleton h-3 w-16 rounded" />
                            <div className="skeleton h-3 w-12 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'hero') {
        return <div className="skeleton h-[400px] md:h-[500px] rounded-2xl" />;
    }

    if (type === 'article') {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="skeleton h-8 w-32 rounded mb-4" />
                <div className="skeleton h-10 rounded mb-2" />
                <div className="skeleton h-10 w-3/4 rounded mb-6" />
                <div className="skeleton h-[400px] rounded-2xl mb-8" />
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="skeleton h-4 rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

export default Loader;
