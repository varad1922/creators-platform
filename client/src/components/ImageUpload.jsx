import { useState, useEffect } from 'react';

const ImageUpload = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return 'Please select an image file (JPEG, PNG, WEBP, GIF).';
        }
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return `File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Max size is 5MB.`;
        }

        return null;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setSelectedFile(null);
            setPreviewUrl(null);
            setError(null);
            return;
        }

        const validationError = validateFile(file);
        
        // Revoke the old preview URL if replacing
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        if (validationError) {
            setError(validationError);
            setSelectedFile(null);
            setPreviewUrl(null);
            return;
        }

        setError(null);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedFile || error) {
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        
        onUpload(formData);
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <form onSubmit={handleSubmit} className="image-upload-container">
            <div className="form-group">
                <label htmlFor="image-upload">Select Image</label>
                <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {error && (
                <div style={{ color: 'red', margin: '10px 0', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            {previewUrl && !error && (
                <div style={{ margin: '15px 0' }}>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                            width: '100%',
                            maxHeight: '300px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                        }}
                    />
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedFile || error !== null}
            >
                Upload Image
            </button>
        </form>
    );
};

export default ImageUpload;
