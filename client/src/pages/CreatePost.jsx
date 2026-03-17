import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import './CreatePost.css';
import ImageUpload from '../components/ImageUpload';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/posts', { title, content });
            toast.success('Post created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create post');
            setLoading(false);
        }
    };

    const handleUpload = (formData) => {
        console.log('Image File from form data:', formData.get('image'));
        toast.info('Image selected. Check console for FormData output.');
    };

    return (
        <div className="create-post-container">
            <div className="create-post-card">
                <h1>Create New Post</h1>

                <div className="form-group" style={{ marginBottom: '25px', padding: '15px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Upload Cover Image</h3>
                    <ImageUpload onUpload={handleUpload} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter post title"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your content here..."
                            rows="10"
                            required
                        ></textarea>
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
// small update for pull request