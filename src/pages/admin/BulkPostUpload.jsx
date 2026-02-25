import { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { articleApi } from '../../api/articleApi';
import {
    HiOutlineUpload,
    HiOutlineDocumentText,
    HiX,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiDownload
} from 'react-icons/hi';
import Loader from '../../components/Loader';

const BulkPostUpload = () => {
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
            toast.error('Please upload a valid CSV file.');
            return;
        }

        setFile(selectedFile);
        parseCSV(selectedFile);
    };

    const parseCSV = (csvFile) => {
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                if (results.data && results.data.length > 0) {
                    setParsedData(results.data);
                } else {
                    toast.error('The CSV file appears to be empty.');
                    setFile(null);
                }
            },
            error: function (error) {
                toast.error('Error parsing CSV file');
                console.error(error);
                setFile(null);
            }
        });
    };

    const handleUploadSubmit = async () => {
        if (!parsedData || parsedData.length === 0) {
            toast.error('No data to upload');
            return;
        }

        setLoading(true);
        try {
            const res = await articleApi.bulkUpload(parsedData);
            setResults(res.data);
            toast.success(res.message || 'Bulk upload completed!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk upload failed');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setParsedData([]);
        setResults(null);
    };

    const downloadTemplate = () => {
        const template = [
            {
                title: "Example News Title",
                content: "<p>This is the HTML content of the news article.</p>",
                category: "Technology", // Must match existing category name or slug
                tags: "tech, apple, news",
                status: "PUBLISHED", // DRAFT or PUBLISHED
                isFeatured: "false",
                thumbnail: "https://example.com/image.jpg" // Optional
            }
        ];
        const csv = Papa.unparse(template);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'articles_template.csv';
        link.click();
    };

    return (
        <div className="space-y-6 animate-fade-in relative min-h-[60vh]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Bulk Post Upload</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Upload multiple articles at once using a CSV file.</p>
                </div>

                <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                    <HiDownload size={18} />
                    Download Template
                </button>
            </div>

            {/* Step 1: Upload / Preview */}
            {!results && (
                <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    {!file ? (
                        <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-10 text-center hover:bg-[var(--color-surface-hover)] transition-colors relative cursor-pointer group">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                                    <HiOutlineUpload size={32} />
                                </div>
                                <div>
                                    <p className="text-base font-medium text-[var(--color-text-primary)]">Click or drag CSV file here to upload</p>
                                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Only .csv files are supported</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                        <HiOutlineDocumentText size={24} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--color-text-primary)]">{file.name}</p>
                                        <p className="text-xs text-[var(--color-text-secondary)]">{(file.size / 1024).toFixed(2)} KB • {parsedData.length} rows found</p>
                                    </div>
                                </div>
                                <button onClick={resetForm} className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <HiX size={20} />
                                </button>
                            </div>

                            {/* Data Preview Table */}
                            {parsedData.length > 0 && (
                                <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                                    <div className="bg-[var(--color-surface)] px-4 py-3 border-b border-[var(--color-border)]">
                                        <h3 className="font-medium text-[var(--color-text-primary)] text-sm">Data Preview (First 5 Rows)</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                                                <tr>
                                                    <th className="px-4 py-2 font-medium">Title</th>
                                                    <th className="px-4 py-2 font-medium">Category</th>
                                                    <th className="px-4 py-2 font-medium">Status</th>
                                                    <th className="px-4 py-2 font-medium">Tags</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--color-border)]">
                                                {parsedData.slice(0, 5).map((row, idx) => (
                                                    <tr key={idx} className="text-[var(--color-text-primary)]">
                                                        <td className="px-4 py-2 truncate max-w-[200px]">{row.title || <span className="text-red-500">Missing</span>}</td>
                                                        <td className="px-4 py-2">{row.category || <span className="text-red-500">Missing</span>}</td>
                                                        <td className="px-4 py-2">
                                                            <span className={`px-2 py-1 rounded text-xs ${row.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                                                {row.status || 'DRAFT'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 truncate max-w-[150px] text-[var(--color-text-secondary)]">{row.tags || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleUploadSubmit}
                                    disabled={loading || parsedData.length === 0}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors disabled:opacity-70"
                                >
                                    {loading ? <Loader size="w-5 h-5" /> : <HiOutlineUpload size={18} />}
                                    {loading ? 'Uploading...' : `Upload ${parsedData.length} Articles`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Results Display */}
            {results && (
                <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm animate-fade-in space-y-6">
                    <div className="text-center">
                        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
                            <HiOutlineCheckCircle size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Upload Complete</h3>
                        <p className="text-[var(--color-text-secondary)] mt-1">Review the results of your bulk import below.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <div className="bg-[var(--color-surface)] border border-green-500/20 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-green-500">{results.successful}</p>
                            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">Successfully Imported</p>
                        </div>
                        <div className={`bg-[var(--color-surface)] border ${results.failed > 0 ? 'border-red-500/20' : 'border-[var(--color-border)]'} rounded-xl p-4 text-center`}>
                            <p className={`text-3xl font-bold ${results.failed > 0 ? 'text-red-500' : 'text-[var(--color-text-primary)]'}`}>{results.failed}</p>
                            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">Failed</p>
                        </div>
                    </div>

                    {results.errors && results.errors.length > 0 && (
                        <div className="border border-red-500/20 rounded-xl overflow-hidden mt-6">
                            <div className="bg-red-500/10 px-4 py-3 border-b border-red-500/20 flex items-center gap-2 text-red-600">
                                <HiOutlineExclamationCircle size={18} />
                                <h4 className="font-semibold text-sm">Error Logs</h4>
                            </div>
                            <div className="max-h-60 overflow-y-auto bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
                                {results.errors.map((err, idx) => (
                                    <div key={idx} className="p-3 text-sm">
                                        <p className="font-medium text-[var(--color-text-primary)] mb-1">"{err.title}"</p>
                                        <p className="text-red-500 text-xs">{err.error}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center pt-4">
                        <button
                            onClick={resetForm}
                            className="px-6 py-2.5 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium rounded-xl transition-colors"
                        >
                            Upload Another File
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkPostUpload;
