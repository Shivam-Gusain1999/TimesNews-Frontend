import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6
import { pageApi } from '../../api/pageApi';
import Loader from '../../components/Loader';
import { HiArrowLeft, HiOutlineSave } from 'react-icons/hi';

const ManagePagesForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        status: 'published'
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchPage = async () => {
                try {
                    const res = await pageApi.getPageById(id);
                    if (res.data) {
                        setFormData({
                            title: res.data.title || '',
                            slug: res.data.slug || '',
                            content: res.data.content || '',
                            status: res.data.status || 'published'
                        });
                    }
                } catch (error) {
                    toast.error('Failed to fetch page data');
                    navigate('/admin/pages');
                } finally {
                    setLoading(false);
                }
            };
            fetchPage();
        }
    }, [id, navigate, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast.error('Title and Content are required');
            return;
        }

        setSaving(true);
        try {
            if (isEditMode) {
                await pageApi.updatePage(id, formData);
                toast.success('Page updated successfully');
            } else {
                await pageApi.createPage(formData);
                toast.success('Page created successfully');
            }
            navigate('/admin/pages');
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} page`);
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // React Quill Formats & Modules Configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in relative">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/admin/pages" className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-secondary)] hover:text-primary transition-colors">
                    <HiArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">
                        {isEditMode ? 'Edit Page' : 'Create New Page'}
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {isEditMode ? 'Update existing dynamic page content.' : 'Build a new static page for your readers.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-primary)]">Page Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="E.g. About Us"
                            className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-primary)]">Custom Slug (Optional)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="e.g. about-us (Auto-generated if left blank)"
                            className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-primary)] block">Page Content *</label>
                    <div className="bg-white text-black min-h-[300px] rounded-xl border border-gray-300 overflow-hidden">
                        <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={formData.content}
                            onChange={handleContentChange}
                            className="h-[300px] pb-10" // Padding bottom ensures space for quill toolbar and long text
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
                    <label className="text-sm font-medium text-[var(--color-text-primary)]">Visibility Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full md:w-1/3 px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors disabled:opacity-70 shadow-md"
                    >
                        {saving ? <Loader size="w-5 h-5" /> : <HiOutlineSave size={20} />}
                        {saving ? 'Saving...' : (isEditMode ? 'Update Page' : 'Publish Page')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManagePagesForm;
