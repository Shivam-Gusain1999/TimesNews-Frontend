import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { messageApi } from '../api/messageApi';

const Contact = () => {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', subject: 'General Inquiry', message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await messageApi.sendMessage(formData);
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)] mb-3">Contact Us</h1>
                <p className="text-[var(--color-text-secondary)]">We'd love to hear from you. Send us a message below.</p>
            </div>

            <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} type="text" required className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                            <input name="email" value={formData.email} onChange={handleChange} type="email" required className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Subject</label>
                        <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Editorial Feedback">Editorial Feedback</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Partnership">Partnership</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Message</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" placeholder="How can we help?"></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-70"
                    >
                        {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
