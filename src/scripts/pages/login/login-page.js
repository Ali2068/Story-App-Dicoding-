import { loginUser } from '../../services/story-api';
import { saveUserToken } from '../../utils/auth';

const LoginPage = {
  async render() {
    return `
      <section class="login" class:"form-container">
        <h2>Login</h2>
        <form id="loginForm" class="form">
          <label for="email">Email</label>
          <input type="email" id="email" required />

          <label for="password">Kata Sandi</label>
          <input type="password" id="password" required />

          <button type="submit">Masuk</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = form.email.value.trim();
      const password = form.password.value.trim();

      try {
        const response = await loginUser({ email, password });

        const token = response.loginResult.token;
        saveUserToken(token);

        alert('Login berhasil!');
        window.location.hash = '/';
        updateAuthButtons();
      } catch (err) {
        console.error('Login error:', err);
        alert(`Login gagal: ${err.message}`);
      }
      window.updateAuthButtons?.();
    });
  }
};

export default LoginPage;
