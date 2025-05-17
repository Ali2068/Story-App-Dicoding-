import AddPresenter from './add-presenter.js';

const AddPage = {
  async render() {
    return `
      <section class="add" class:"form-container">
        <h2>Tambah Cerita</h2>
        <form id="storyForm" class="form">
          <label for="description">Cerita</label>
          <textarea id="description" required></textarea>

          <label for="camera">Ambil Gambar</label>
          <video id="camera" autoplay></video>
          <button type="button" id="captureBtn">Ambil Gambar</button>
          <canvas id="canvas" style="display:none;"></canvas>
          <img id="preview" alt="Preview" style="display:none; max-width: 100%; margin-top: 1rem;" />

          <label for="map">Pilih Lokasi</label>
          <div id="map" style="height: 300px;"></div>

          <input type="hidden" id="lat" />
          <input type="hidden" id="lng" />
          <button type="submit">Kirim Cerita</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    AddPresenter.init({
      form: document.getElementById('storyForm'),
      video: document.getElementById('camera'),
      canvas: document.getElementById('canvas'),
      preview: document.getElementById('preview'),
      captureBtn: document.getElementById('captureBtn'),
      latInput: document.getElementById('lat'),
      lngInput: document.getElementById('lng'),
      coordsPreview: document.getElementById('coordsPreview'),
    });
  }
};

export default AddPage;
