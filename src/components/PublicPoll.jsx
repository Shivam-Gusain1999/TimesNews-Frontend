import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { pollApi } from '../api/pollApi';
import Loader from './Loader';
import { HiOutlineChartPie } from 'react-icons/hi';

const PublicPoll = () => {
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [results, setResults] = useState(null);
    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {
        const fetchLatestPoll = async () => {
            try {
                // Fetch the 1 most recent active poll
                const res = await pollApi.getActivePolls(1);
                if (res.data && res.data.length > 0) {
                    setPoll(res.data[0]);

                    // Simple localstorage check - in real app the backend prevents this strictly by IP
                    if (localStorage.getItem(`voted_${res.data[0]._id}`)) {
                        setHasVoted(true);
                        calculateExistingResults(res.data[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to load poll", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPoll();
    }, []);

    const calculateExistingResults = (pollData) => {
        const total = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);
        setTotalVotes(total);
        const calcResults = pollData.options.map(opt => ({
            _id: opt._id,
            text: opt.text,
            votes: opt.votes,
            percentage: total > 0 ? Math.round((opt.votes / total) * 100) : 0
        }));
        setResults(calcResults);
    };

    const handleVote = async (optionId) => {
        if (!poll || hasVoted) return;

        setVoting(true);
        try {
            const res = await pollApi.voteInPoll(poll._id, optionId);
            setResults(res.data.results);
            setTotalVotes(res.data.totalVotes);
            setHasVoted(true);
            localStorage.setItem(`voted_${poll._id}`, 'true');
            toast.success('Your vote has been recorded!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit vote');
        } finally {
            setVoting(false);
        }
    };

    if (loading) return null; // Keep it invisible while loading to prevent layout shifts
    if (!poll) return null; // No active polls exist

    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[var(--color-text-secondary)]">
                <HiOutlineChartPie className="text-primary" size={20} />
                <h4 className="font-semibold text-sm uppercase tracking-wider">Reader Poll</h4>
            </div>

            <h3 className="text-lg font-bold font-[var(--font-serif)] text-[var(--color-text-primary)] mb-5 leading-snug">
                {poll.question}
            </h3>

            <div className="space-y-3">
                {hasVoted && results ? (
                    // SHOW RESULTS
                    results.map((opt) => (
                        <div key={opt._id} className="relative">
                            <div className="flex justify-between text-sm mb-1 text-[var(--color-text-primary)]">
                                <span>{opt.text}</span>
                                <span className="font-medium">{opt.percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-[var(--color-surface-hover)] rounded-full overflow-hidden border border-[var(--color-border)]">
                                <div
                                    className="h-full bg-primary transition-all duration-1000 ease-out"
                                    style={{ width: `${opt.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                ) : (
                    // SHOW VOTING OPTIONS
                    poll.options.map((opt) => (
                        <button
                            key={opt._id}
                            onClick={() => handleVote(opt._id)}
                            disabled={voting}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm
                                ${voting
                                    ? 'opacity-50 cursor-not-allowed border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                                    : 'border-[var(--color-border)] bg-[var(--color-surface-hover)] hover:border-primary hover:bg-primary/5 hover:text-primary text-[var(--color-text-primary)]'
                                }`}
                        >
                            {opt.text}
                        </button>
                    ))
                )}
            </div>

            {hasVoted && (
                <div className="mt-4 text-center text-xs text-[var(--color-text-secondary)]">
                    Total votes: {totalVotes}
                </div>
            )}
        </div>
    );
};

export default PublicPoll;
