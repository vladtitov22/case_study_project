<template>
  <div class="login-page">
    <form @submit.prevent="login">
      <h2 class="login-heading">Anmeldung</h2>
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button type="submit" class="login-button">Einloggen</button>
      <button type="button" class="register-button" @click="register">Registrieren</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      // Weiterleitung zum Editor-Dashboard nach dem Klick auf "Einloggen"
      this.$router.push('/dashboard/editor');
    },
    register() {
      // Weiterleitung zur Registrierungsseite
      this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #ffecd2, #fcb69f);
}

form {
  background: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.login-heading {
  text-align: center;
  font-size: 2em;
  color: #ff6b6b;
  margin-bottom: 20px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1.1em;
}

.login-button,
.register-button {
  width: 100%;
  padding: 15px;
  font-size: 1.2em;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  transition: background 0.3s ease, transform 0.3s ease;
  margin-bottom: 10px;
}

/* Stil für die Login-Schaltfläche */
.login-button {
  background: linear-gradient(45deg, #ff6b6b, #fcb69f);
}

.login-button:hover {
  background: linear-gradient(45deg, #e55e5e, #fcb69f);
  transform: translateY(-5px);
}

/* Stil für die Registrierungs-Schaltfläche */
.register-button {
  background: linear-gradient(45deg, #4caf50, #81c784);
}

.register-button:hover {
  background: linear-gradient(45deg, #45a049, #66bb6a);
  transform: translateY(-5px);
}
</style>
