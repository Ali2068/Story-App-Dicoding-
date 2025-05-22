import { getStories } from '../../services/story-api';
import { IdbStory } from '../../utils/idb';
import L from 'leaflet';

const HomePresenter = {
  async showStories() {
    const container = document.getElementById('storiesList');
    const map = L.map('map').setView([-6.2, 106.8], 5);

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=EfFI5S58oabOINQgUA1h', {
      attribution: 'Map data &copy; OpenStreetMap contributors',
    }).addTo(map);

    let stories = [];

    try {
      stories = await getStories();
      await IdbStory.clear();
      stories.forEach((story) => IdbStory.put(story));
    } catch (err) {
      console.warn('Fetch gagal, ambil dari IndexedDB:', err.message);
      stories = await IdbStory.getAll();
    }

    container.innerHTML = '';

    stories.forEach((story) => {
      const item = document.createElement('div');
      item.classList.add('story-item');
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto ${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>Dibuat pada: ${new Date(story.createdAt).toLocaleString()}</small></p>
      `;
      container.appendChild(item);

      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });

      const favBtn = document.createElement('button');
      favBtn.textContent = 'Simpan';
      favBtn.addEventListener('click', async () => {
        await IdbFavorite.put(story);
        alert('Cerita disimpan ke favorit!');
      });
      item.appendChild(favBtn);

  }
};

export default HomePresenter;