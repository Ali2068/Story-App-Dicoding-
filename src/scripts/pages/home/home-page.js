import HomePresenter from './home-presenter.js';

const HomePage = {
  async render() {
    return `
      <section class="home">
        <h2>Daftar Cerita</h2>
        <div id="storiesList" class="story-list"></div>
        <div id="map" style="height: 400px; margin-top: 2rem;"></div>
      </section>
    `;
  },
  
  async afterRender() {
    await HomePresenter.showStories();
  }
};

export default HomePage;
