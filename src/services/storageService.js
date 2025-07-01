const storageService = {
    getItem: (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },

    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    removeItem: (key) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    }
};

export default storageService;