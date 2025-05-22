import IdbFavorite from '../../utils/idb-favorite';

const FavoritePresenter = {
  async showFavorites(container) {
    const favorites = await IdbFavorite.getAll();

    if (favorites.length === 0) {
      container.innerHTML = '<p>Belum ada cerita favorit.</p>';
      return;
    }

    container.innerHTML = '';
    favorites.forEach((story) => {
      const item = document.createElement('div');
      item.classList.add('story-item');
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto ${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>Dibuat pada: ${new Date(story.createdAt).toLocaleString()}</small></p>
        <button class="remove-fav-btn" data-id="${story.id}">🗑️ Hapus</button>
      `;
      container.appendChild(item);
    });

    container.querySelectorAll('.remove-fav-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await IdbFavorite.delete(id);
        this.showFavorites(container);
        this._showToast('Cerita dihapus dari favorit');
      });
    });
  },

  async clearAll(container) {
    const favorites = await IdbFavorite.getAll();
    await Promise.all(favorites.map((item) => IdbFavorite.delete(item.id)));
    this.showFavorites(container);
    this._showToast('Semua cerita favorit telah dihapus');
  },

  _showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      background: #323232;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      z-index: 1000;
      opacity: 0.95;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }
};

export default FavoritePresenter;