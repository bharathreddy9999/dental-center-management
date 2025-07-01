const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
};

const isDateInFuture = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date > today;
};

export { formatDate, formatDateTime, isDateInFuture };