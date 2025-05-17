import Navigo from 'navigo';
import { routes } from './routes';
import { isLoggedIn } from '../utils/auth';

const router = new Navigo('/', { hash: true });

export const renderPage = async (page) => {
  const main = document.querySelector('main');

  // View Transition API
  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      main.innerHTML = await page.render();
      await page.afterRender?.();
    });
  } else {
    main.innerHTML = await page.render();
    await page.afterRender?.();
  }
};

const setupRouter = () => {
  Object.entries(routes).forEach(([path, page]) => {
    router.on(path, async () => {
      const requireAuth = ['home', 'add'].includes(path);
      if (requireAuth && !isLoggedIn()) {
        location.hash = '#/login';
        return;
      }
      await renderPage(page);
    });
  });

  router.notFound(() => {
    location.hash = '#/login';
  });

  router.resolve();
};

export default setupRouter;
