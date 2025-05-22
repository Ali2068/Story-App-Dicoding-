import FavoritePresenter from './favorite-presenter';

const FavoritePage = {
  async render() {
    return `
      <section class="favorites">
        <h2>Favorit Saya</h2>
        <div id="favoriteList" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('favoriteList');
    await FavoritePresenter.showFavorites(container);
  }
};

export default FavoritePage;