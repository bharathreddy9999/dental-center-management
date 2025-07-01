const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    return password.length >= 6; // Minimum length of 6 characters
};

const validateRequired = (value) => {
    return value.trim() !== '';
};

const validateDateOfBirth = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    return age >= 0 && (monthDifference > 0 || (monthDifference === 0 && today.getDate() >= birthDate.getDate()));
};

export { validateEmail, validatePassword, validateRequired, validateDateOfBirth };