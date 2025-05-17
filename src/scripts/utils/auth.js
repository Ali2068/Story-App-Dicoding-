const saveUserToken = (token) => localStorage.setItem('token', token);
const getUserToken = () => localStorage.getItem('token');
const removeUserToken = () => localStorage.removeItem('token');
const isLoggedIn = () => !!getUserToken();

export {
  saveUserToken,
  getUserToken,
  removeUserToken,
  isLoggedIn,
};

export default {
  saveUserToken,
  getUserToken,
  removeUserToken,
  isLoggedIn,
};
