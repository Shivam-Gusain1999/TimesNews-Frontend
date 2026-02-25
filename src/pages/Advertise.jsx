import React from 'react';

const Advertise = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
            <div className="text-center mb-16">
                <span className="text-primary font-semibold tracking-wider uppercase text-sm">Partner with us</span>
                <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)] mt-3 mb-6">Reach Millions of Readers</h1>
                <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                    Connect with an engaged, global audience through Times News' premium advertising solutions.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-[var(--color-surface-alt)] p-8 rounded-2xl border border-[var(--color-border)]">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Display Ads</h3>
                    <p className="text-[var(--color-text-muted)] mb-6">High-impact banner ads placed strategically across our homepage and article pages.</p>
                    <button className="text-primary font-semibold hover:underline">Learn more &rarr;</button>
                </div>
                <div className="bg-[var(--color-surface-alt)] p-8 rounded-2xl border border-[var(--color-border)] border-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Sponsored Content</h3>
                    <p className="text-[var(--color-text-muted)] mb-6">Native articles written by our expert team that seamlessly integrate with our editorial content.</p>
                    <button className="text-primary font-semibold hover:underline">Learn more &rarr;</button>
                </div>
                <div className="bg-[var(--color-surface-alt)] p-8 rounded-2xl border border-[var(--color-border)]">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Newsletter</h3>
                    <p className="text-[var(--color-text-muted)] mb-6">Direct access to our subscribers' inboxes with dedicated newsletter sponsorships.</p>
                    <button className="text-primary font-semibold hover:underline">Learn more &rarr;</button>
                </div>
            </div>

            <div className="bg-primary rounded-3xl p-8 md:p-12 text-center text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to grow your brand?</h2>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">Contact our sales team today to discuss a custom package tailored to your marketing goals.</p>
                <button className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">
                    Contact Sales
                </button>
            </div>
        </div>
    );
};

export default Advertise;
