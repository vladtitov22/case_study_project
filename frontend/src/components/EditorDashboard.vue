<template>
  <div class="editor-dashboard">
    <header class="dashboard-header">
      <h1 class="dashboard-title">Editor Dashboard</h1>
      <button @click="logout" class="logout-button">Logout</button>
    </header>
    <div class="dashboard-container">
      <aside class="editor-info">
        <h2 class="editor-welcome">Willkommen, {{ editorName }}!</h2>
      </aside>
      <main class="dashboard-main">
        <div class="actions-container">
          <button @click="navigateToUserManagement" class="action-button">Benutzer verwalten</button>
          <button @click="navigateToCaseManagement" class="action-button">Case Studies verwalten</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editorName: 'Editor Name',
      // editorAvatarUrl: '/path/to/avatar.png', // Entfernt, da nicht mehr benötigt
    };
  },
  methods: {
    navigateToUserManagement() {
      this.$router.push('/dashboard/editor/usermanagement');
    },
    navigateToCaseManagement() {
      this.$router.push('/dashboard/editor/casemanagement');
    },
    logout() {
      // Löschen der Benutzerdaten und Weiterleitung zur Startseite
      localStorage.removeItem('authToken');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.editor-dashboard {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to right, #ffecd2, #fcb69f);
  min-height: 100vh;
  padding: 20px;
  color: #333;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.dashboard-title {
  font-size: 2.5em;
  color: #ff6b6b;
  font-weight: 700;
}
.logout-button {
  padding: 15px 30px;
  font-size: 1.2em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  background: #ff6b6b;
  color: white;
}
.logout-button:hover {
  background: #e55e5e;
  transform: scale(1.05);
}
.dashboard-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}
.editor-info {
  flex-basis: 100%;
  text-align: center;
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.editor-welcome {
  font-size: 2em;
  color: #333;
}
.dashboard-main {
  flex-grow: 1;
  background: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.actions-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}
.action-button {
  width: 80%;
  max-width: 400px;
  padding: 20px;
  font-size: 1.5em;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  background: linear-gradient(45deg, #ff6b6b, #fcb69f);
  color: white;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}
.action-button:hover {
  background: linear-gradient(45deg, #e55e5e, #fcb69f);
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
@media (min-width: 768px) {
  .dashboard-container {
    flex-wrap: nowrap;
  }
  .editor-info {
    flex-basis: 25%;
  }
  .dashboard-main {
    flex-basis: 70%;
  }
  .actions-container {
    flex-direction: row;
    justify-content: space-around;
  }
  .action-button {
    width: auto;
    max-width: none;
  }
}
</style>
