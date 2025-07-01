const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(new Error('File upload failed'));
        };
        reader.readAsDataURL(file);
    });
};

const validateFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
};

const validateFileSize = (file, maxSize) => {
    return file.size <= maxSize;
};

export { uploadFile, validateFileType, validateFileSize };