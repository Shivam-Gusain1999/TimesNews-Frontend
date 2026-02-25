import { Link } from 'react-router-dom';
import { HiShieldCheck } from 'react-icons/hi';

const AccessDenied = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
            <div className="text-center animate-fade-in max-w-md">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiShieldCheck className="text-red-600" size={40} />
                </div>
                <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-500 mb-8">
                    You do not have permission to view this page. This area is restricted to administrators only.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="px-6 py-2.5 bg-red-800 hover:bg-red-900 text-white font-medium rounded-xl transition-colors shadow-lg shadow-red-800/20"
                    >
                        Go Home
                    </Link>
                    <Link
                        to="/login"
                        className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
                    >
                        Switch Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
