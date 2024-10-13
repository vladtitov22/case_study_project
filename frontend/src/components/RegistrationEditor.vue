<template>
  <div class="registration-page-editor">
    <section id="registration-section-editor" class="registration-section">
      <div class="form-container">
        <h2 class="form-title">Register as Editor</h2>
        <form @submit.prevent="handleRegistration">
          <input type="text" v-model="email_or_username" placeholder="Email or Username" class="styled-input" required />
          <input type="password" v-model="password" placeholder="Password" class="styled-input" required />
          <button type="submit" class="styled-button">Register</button>
        </form>
        <button @click="cancelRegistration" class="styled-button secondary">Cancel</button>
      </div>
    </section>
  </div>
</template>

<script>
import apiClient from '@/services/api';

export default {
  data() {
    return {
      email_or_username: '',
      password: ''
    };
  },
  methods: {
    handleRegistration() {
      const registrationData = {
        role: 'editor',
        email_or_username: this.email_or_username,
        password: this.password
      };
      apiClient.post('/register', registrationData)
        .then(() => {
          alert('Registration successful!');
          this.$router.push('/login');
        })
        .catch(error => {
          console.error('Registration error:', error);
        });
    },
    cancelRegistration() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.registration-page-editor {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to right, #ffecd2, #fcb69f);
  color: #333;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.registration-section {
  display: flex;
  justify-content: center;
  padding: 40px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
}
.form-container {
  text-align: center;
}
.form-title {
  margin-bottom: 20px;
  color: #f76c6c;
  font-weight: 700;
  font-size: 2em;
}
.styled-input {
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 10px;
  transition: border-color 0.3s ease;
  font-size: 1.1em;
}
.styled-input:focus {
  border-color: #f76c6c;
  outline: none;
}
.styled-button {
  width: 100%;
  padding: 15px;
  background: #f76c6c;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 1.1em;
  transition: background 0.3s ease;
}
.styled-button:hover {
  background: #e55e5e;
}
.styled-button.secondary {
  background: #ffcc00;
  color: #333;
  border: 1px solid #ffcc00;
  margin-top: 15px;
}
.styled-button.secondary:hover {
  background: #e6b800;
  border-color: #e6b800;
}
</style>