<template>
  <div class="client-management-page">
    <header class="management-header">
      <h1 class="management-title">Client Management</h1>
      <button @click="logout" class="logout-button">Logout</button>
    </header>
    <div class="management-container">
      <aside class="user-info">
        <!-- Editor-Avatar entfernt -->
        <h2 class="editor-welcome">Willkommen, {{ editorName }}!</h2>
      </aside>
      <main class="management-main">
        <div class="actions-container">
          <button @click="showAddClientForm = true" class="action-button">Client hinzufügen</button>
        </div>
        <div v-if="showAddClientForm" class="client-form">
          <h3>{{ editingClientId ? 'Client bearbeiten' : 'Neuen Client hinzufügen' }}</h3>
          <form @submit.prevent="editingClientId ? updateClient() : addClient()" enctype="multipart/form-data" ref="clientForm">
            <input type="text" v-model="newClient.name" placeholder="Client-Name" class="styled-input" required />
            <input type="file" @change="onFileChange" class="styled-input" :required="!editingClientId" />
            <select v-model="newClient.status" class="styled-input" required>
              <option value="active">Aktiv</option>
              <option value="inactive">Inaktiv</option>
            </select>
            <button type="submit" class="styled-button">Speichern</button>
            <button type="button" @click="showAddClientForm = false" class="styled-button secondary">Abbrechen</button>
          </form>
        </div>
        <div class="client-list">
          <table class="client-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client-Name</th>
                <th>Logo</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in clients" :key="client.id">
                <td>{{ client.id }}</td>
                <td>{{ client.name }}</td>
                <td>
                  <img
                    :src="`http://localhost:3000/${client.logo}`"
                    alt="Client Logo"
                    class="client-logo"
                  />
                </td>
                <td>{{ client.status === 'active' ? 'Aktiv' : 'Inaktiv' }}</td>
                <td>
                  <button @click="editClient(client.id)" class="edit-button">Bearbeiten</button>
                  <button @click="deleteClient(client.id)" class="delete-button">Löschen</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import apiClient from '@/services/api';

export default {
  data() {
    return {
      editorName: 'Editor Name',
      // editorAvatarUrl: '/path/to/avatar.png', // Entfernt
      clients: [],
      showAddClientForm: false,
      editingClientId: null,
      newClient: {
        name: '',
        logo: null,
        status: 'active',
      },
    };
  },
  created() {
    this.fetchClients();
  },
  methods: {
    fetchClients() {
      apiClient
        .get('/clients')
        .then((response) => {
          this.clients = response.data;
        })
        .catch((error) => {
          console.error('Fehler beim Abrufen der Clients:', error);
        });
    },
    onFileChange(event) {
      this.newClient.logo = event.target.files[0];
    },
    addClient() {
      const formData = new FormData();
      formData.append('name', this.newClient.name);
      formData.append('logo', this.newClient.logo);
      formData.append('status', this.newClient.status);

      apiClient
        .post('/clients', formData)
        .then(() => {
          alert('Client erfolgreich hinzugefügt');
          this.showAddClientForm = false;
          this.newClient = { name: '', logo: null, status: 'active' };
          this.fetchClients();
        })
        .catch((error) => {
          console.error('Fehler beim Hinzufügen des Clients:', error);
        });
    },
    editClient(clientId) {
      const client = this.clients.find(({ id }) => id === clientId);
      if (!client) {
        console.warn(`Client mit ID "${clientId}" nicht gefunden`);
        return;
      }

      Object.assign(this.newClient, {
        name: client.name,
        status: client.status,
        logo: null,
      });
      this.editingClientId = clientId;
      this.showAddClientForm = true;
      this.$nextTick(() => {
        if (this.$refs.clientForm) {
          this.$refs.clientForm.focus();
        }
      });
    },
    updateClient() {
      const formData = new FormData();
      formData.append('name', this.newClient.name);
      formData.append('status', this.newClient.status);

      if (this.newClient.logo) {
        formData.append('logo', this.newClient.logo);
      }

      apiClient
        .put(`/clients/${this.editingClientId}`, formData)
        .then(() => {
          alert('Client erfolgreich aktualisiert');
          this.showAddClientForm = false;
          this.newClient = { name: '', logo: null, status: 'active' };
          this.editingClientId = null;
          this.fetchClients();
        })
        .catch((error) => {
          console.error('Fehler beim Aktualisieren des Clients:', error);
        });
    },
    deleteClient(clientId) {
      if (confirm('Sind Sie sicher, dass Sie diesen Client löschen möchten?')) {
        apiClient
          .delete(`/clients/${clientId}`)
          .then(() => {
            alert('Client erfolgreich gelöscht');
            this.fetchClients();
          })
          .catch((error) => {
            console.error('Fehler beim Löschen des Clients:', error);
          });
      }
    },
    logout() {
      // Benutzerdaten löschen und zur Login-Seite navigieren
      localStorage.removeItem('authToken');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.client-management-page {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to right, #ffecd2, #fcb69f);
  min-height: 100vh;
  padding: 20px;
  color: #333;
}
.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.management-title {
  font-size: 2em;
  color: #ff6b6b;
  font-weight: 700;
}
.logout-button {
  padding: 15px 30px;
  font-size: 1.1em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  background: #ff6b6b;
  color: white;
}
.logout-button:hover {
  background: #e55e5e;
}
.management-container {
  display: flex;
  gap: 30px;
}
.user-info {
  flex-basis: 20%;
  text-align: center;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.editor-welcome {
  font-size: 1.5em;
  color: #333;
}
.management-main {
  flex-grow: 1;
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.actions-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
.action-button {
  padding: 15px 30px;
  font-size: 1.2em;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  background: linear-gradient(45deg, #4caf50, #81c784);
  color: white;
}
.action-button:hover {
  background: linear-gradient(45deg, #45a049, #66bb6a);
}
.client-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.styled-input {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 2px solid #ddd;
  font-size: 1em;
}
.styled-button {
  padding: 15px 30px;
  background: linear-gradient(45deg, #ff6b6b, #fcb69f);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 1em;
  transition: background 0.3s ease;
}
.styled-button:hover {
  background: linear-gradient(45deg, #e55e5e, #fcb69f);
}
.styled-button.secondary {
  background: linear-gradient(45deg, #ffcc00, #ffeb3b);
  color: #333;
  margin-left: 10px;
}
.styled-button.secondary:hover {
  background: linear-gradient(45deg, #fbc02d, #ffeb3b);
}
.client-list {
  overflow-x: auto;
}
.client-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.client-table th,
.client-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.client-table th {
  background: #ff6b6b;
  color: white;
  font-size: 1.1em;
}
.client-logo {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}
.edit-button,
.delete-button {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  color: white;
  transition: background 0.3s ease;
}
.edit-button {
  background: linear-gradient(45deg, #007bff, #64b5f6);
}
.edit-button:hover {
  background: linear-gradient(45deg, #0056b3, #42a5f5);
}
.delete-button {
  background: linear-gradient(45deg, #dc3545, #e57373);
}
.delete-button:hover {
  background: linear-gradient(45deg, #c82333, #ef5350);
}
</style>
