import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            const fileData = {
                name: selectedFile.name,
                url: previewUrl,
            };
            onFileUpload(fileData);
            setSelectedFile(null);
            setPreviewUrl('');
        }
    };

    return (
        <div className="file-upload">
            <input type="file" onChange={handleFileChange} />
            {previewUrl && (
                <div className="file-preview">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                </div>
            )}
            <button onClick={handleUpload} disabled={!selectedFile}>
                Upload
            </button>
        </div>
    );
};

export default FileUpload;