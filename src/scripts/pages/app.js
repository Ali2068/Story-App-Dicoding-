import UrlParser from '../routes/url-parser.js';
import routes from '../routes/routes.js';

const App = {
  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url] || routes['/'];
    const main = document.querySelector('main');

    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        main.innerHTML = await page.render();
        await page.afterRender?.();
      });
    } else {
      main.innerHTML = await page.render();
      await page.afterRender?.();
    }
  },
};

export default App;
