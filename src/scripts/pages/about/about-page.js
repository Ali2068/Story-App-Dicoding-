const AboutPage = {
  async render() {
    return `
      <section class="about">
        <h2>Tentang Aplikasi</h2>
        <p>Aplikasi ini dibuat untuk membagikan cerita perjalanan dari berbagai pengguna.</p>
      </section>
    `;
  },

  async afterRender() {
    // opsional: interaksi atau animasi setelah tampil
  },
};

export default AboutPage;
