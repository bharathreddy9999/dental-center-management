import { users } from '../data/mockData';

const authService = {
  login: (email, password) => {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid email or password');
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

export default authService;