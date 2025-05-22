import IdbFavorite from '../../utils/idb-favorite';

const FavoritePresenter = {
  async showFavorites(container) {
    const favorites = await IdbFavorite.getAll();

    if (favorites.length === 0) {
      container.innerHTML = '<p>Belum ada cerita favorit.</p>';
      return;
    }

    favorites.forEach((story) => {
      const item = document.createElement('div');
      item.classList.add('story-item');
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto ${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>Dibuat pada: ${new Date(story.createdAt).toLocaleString()}</small></p>
        <button class="remove-fav-btn" data-id="${story.id}">Hapus</button>
      `;
      container.appendChild(item);
    });

    container.querySelectorAll('.remove-fav-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await IdbFavorite.delete(id);
        this.showFavorites(container); // refresh
      });
    });
  }
};

export default FavoritePresenter;