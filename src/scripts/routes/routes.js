import HomePage from '../pages/home/home-page.js';
import AboutPage from '../pages/about/about-page.js';
import AddPage from '../pages/add/add-page.js';
import LoginPage from '../pages/login/login-page.js';

const routes = {
  '/login': LoginPage,
  '/': HomePage,
  '/about': AboutPage,
  '/add': AddPage,
};

export default routes;
