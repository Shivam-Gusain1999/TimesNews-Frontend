import { useState } from 'react';
import toast from 'react-hot-toast';
import { newsletterApi } from '../api/newsletterApi';
import Loader from './Loader';
import { HiOutlineMail } from 'react-icons/hi';

const NewsletterForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            await newsletterApi.subscribe(email);
            setSuccess(true);
            toast.success('Successfully subscribed!');
            setEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Subscription failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-2xl text-center">
                <HiOutlineMail className="mx-auto mb-2" size={32} />
                <h4 className="font-bold mb-1">You're on the list!</h4>
                <p className="text-sm opacity-80">Thank you for subscribing to our newsletter.</p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm text-center">
            <h4 className="text-xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)] mb-2">
                Subscribe to Our Newsletter
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Get the latest news and updates delivered straight to your inbox daily. No spam, we promise.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <HiOutlineMail size={20} />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                    {loading ? <Loader size="w-5 h-5" /> : 'Subscribe Now'}
                </button>
            </form>
        </div>
    );
};

export default NewsletterForm;
