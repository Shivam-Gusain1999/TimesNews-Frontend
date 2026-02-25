import React from 'react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)] mb-4">About Times News</h1>
                <p className="text-lg text-[var(--color-text-secondary)]">Empowering the world with truth, integrity, and unbiased journalism.</p>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Our Mission</h2>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        At Times News, we believe that information is the cornerstone of a free society. Our mission is to provide accurate, timely, and comprehensive news coverage that empowers our readers to make informed decisions. We are committed to journalistic integrity, independence, and the pursuit of truth.
                    </p>
                </section>

                <section className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-[var(--color-surface-alt)] rounded-2xl border border-[var(--color-border)] text-center">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-2">Integrity</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">We adhere to the highest standards of ethical journalism.</p>
                    </div>
                    <div className="p-6 bg-[var(--color-surface-alt)] rounded-2xl border border-[var(--color-border)] text-center">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-2">Innovation</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Leveraging technology to deliver news in engaging ways.</p>
                    </div>
                    <div className="p-6 bg-[var(--color-surface-alt)] rounded-2xl border border-[var(--color-border)] text-center">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-2">Impact</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Stories that matter and drive positive change in society.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
