import FavoritePresenter from './favorite-presenter.js';

const FavoritePage = {
  async render() {
    return `
      <section class="favorite">
        <h2>Cerita Favorit</h2>
        <div style="text-align:right;">
          <button class="clear-fav-btn" id="clearAllBtn">🗑️ Kosongkan Semua</button>
        </div>
        <div id="favoriteList" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('favoriteList');
    await FavoritePresenter.showFavorites(container);

    const clearBtn = document.getElementById('clearAllBtn');
    clearBtn.addEventListener('click', async () => {
      if (confirm('Yakin ingin menghapus semua cerita favorit?')) {
        await FavoritePresenter.clearAll(container);
      }
    });
  }
};

export default FavoritePage;