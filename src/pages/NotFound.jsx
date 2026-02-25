import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center animate-fade-in">
                <h1 className="text-8xl font-bold text-primary mb-2">404</h1>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">Page Not Found</h2>
                <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                    Back to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
