import { registerUser } from '../../services/story-api';

const RegisterPage = {
  async render() {
    return `
      <section class="register">
        <h2>Daftar Akun Baru</h2>
        <form id="registerForm">
          <label for="name">Nama</label>
          <input type="text" id="name" name="name" required />

          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Daftar</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      try {
        await registerUser({ name, email, password });
        alert('Registrasi berhasil! Silakan login.');
        window.location.hash = '/login';
      } catch (err) {
        alert(`Registrasi gagal: ${err.message}`);
      }
    });
  }
};

export default RegisterPage;