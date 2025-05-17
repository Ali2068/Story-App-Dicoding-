import L from 'leaflet';
import { addStory } from '../../services/story-api';
import { getUserToken } from '../../utils/auth';

const AddPresenter = {
  init(elements) {
    this._form = elements.form;
    this._video = elements.video;
    this._canvas = elements.canvas;
    this._preview = elements.preview;
    this._captureBtn = elements.captureBtn;
    this._latInput = elements.latInput;
    this._lngInput = elements.lngInput;
    this._coordsPreview = elements.coordsPreview;

    this._stream = null;
    this._imageBlob = null;

    this._startCamera();
    this._initMap();
    this._bindEvents();
  },

  async _startCamera() {
    if (navigator.mediaDevices.getUserMedia) {
      this._stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this._video.srcObject = this._stream;
    }
  },

  _stopCamera() {
    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
    }
  },

  _bindEvents() {
    this._captureBtn.addEventListener('click', () => {
      const ctx = this._canvas.getContext('2d');
      this._canvas.width = this._video.videoWidth;
      this._canvas.height = this._video.videoHeight;
      ctx.drawImage(this._video, 0, 0, this._canvas.width, this._canvas.height);
      this._canvas.toBlob((blob) => {
        this._imageBlob = blob;
        const imgUrl = URL.createObjectURL(blob);
        this._preview.src = imgUrl;
        this._preview.style.display = 'block';
      }, 'image/jpeg');
    });

    this._form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = this._form.description.value.trim();
      const lat = this._latInput.value;
      const lng = this._lngInput.value;
      const token = getUserToken();

      if (!token || token === 'undefined') {
        alert('Silakan login terlebih dahulu!');
        window.location.hash = '/login';
        return;
      }

      if (!description) return alert('Deskripsi tidak boleh kosong');
      if (!lat || !lng) return alert('Silakan pilih lokasi di peta.');
      if (!this._imageBlob) return alert('Silakan ambil gambar terlebih dahulu.');

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', this._imageBlob);
      formData.append('lat', lat);
      formData.append('lon', lng);

      try {
        await addStory(formData, token);
        alert('Cerita berhasil dikirim!');
        this._stopCamera();
        window.location.hash = '/';
      } catch (err) {
        alert(`Gagal mengirim cerita: ${err.message}`);
      }
    });

    window.addEventListener('hashchange', () => this._stopCamera());
  },

  _initMap() {
    setTimeout(() => {
      const map = L.map('map').setView([-6.2, 106.8], 13);
      const streets = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=EfFI5S58oabOINQgUA1h', {
        attribution: 'Map data &copy; OpenStreetMap contributors',
      }).addTo(map);
      const topo = L.tileLayer('https://api.maptiler.com/maps/topo-v2/{z}/{x}/{y}.png?key=EfFI5S58oabOINQgUA1h');

      L.control.layers({ Streets: streets, Topographic: topo }).addTo(map);

      let marker;
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this._latInput.value = lat;
        this._lngInput.value = lng;
        this._coordsPreview.textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map).bindPopup('Lokasi Dipilih').openPopup();
      });
    }, 300);
  },
};

export default AddPresenter;
