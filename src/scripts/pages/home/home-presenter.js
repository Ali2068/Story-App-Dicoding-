import { getStories } from '../../services/story-api';
import { IdbStory } from '../../utils/idb';
import IdbFavorite from '../../utils/idb-favorite';
import L from 'leaflet';

const HomePresenter = {
  async showStories() {
    const container = document.getElementById('storiesList');
    const map = L.map('map').setView([-6.2, 106.8], 5);

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=EfFI5S58oabOINQgUA1h', {
      attribution: 'Map data &copy; OpenStreetMap contributors',
    }).addTo(map);

    let storiesList = [];
    try {
      const fetched = await getStories();
      storiesList = fetched;
      await IdbStory.clear();
      fetched.forEach((story) => IdbStory.put(story));
    } catch (err) {
      console.warn('Gagal fetch cerita, ambil dari cache:', err.message);
      storiesList = await IdbStory.getAll();
    }

    if (storiesList.length === 0) {
      container.innerHTML = '<p>Belum ada cerita tersedia.</p>';
      return;
    }

    container.innerHTML = ''; // clear container

    storiesList.forEach((story) => {
      const item = document.createElement('div');
      item.classList.add('story-item');
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto ${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>Dibuat pada: ${new Date(story.createdAt).toLocaleString()}</small></p>
        <button class="fav-btn" data-id="${story.id}">❤️ Simpan</button>
      `;
      container.appendChild(item);

      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });

    // Event tombol favorit
    document.querySelectorAll('.fav-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const selectedStory = storiesList.find((s) => s.id === id);
        if (selectedStory) {
          await IdbFavorite.put(selectedStory);
          alert('Ditambahkan ke favorit!');
        }
      });
    });
  }
};

export default HomePresenter;