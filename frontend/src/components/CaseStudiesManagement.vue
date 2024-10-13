<template>
  <div class="case-studies-management-page">
    <header class="management-header">
      <h1 class="management-title">Case Studies Management</h1>
      <button @click="logout" class="logout-button">Logout</button>
    </header>
    <div class="management-container">
      <aside class="editor-info">
        <!-- Avatar entfernt -->
        <h2 class="editor-welcome">Willkommen, {{ editorName }}!</h2>
      </aside>
      <main class="management-main">
        <div class="actions-container">
          <button @click="showAddForm = true" class="action-button">Case Study hinzufügen</button>
        </div>
        <div v-if="showAddForm || isEditing" class="case-study-form">
          <h3>{{ isEditing ? 'Case Study bearbeiten' : 'Case Study hinzufügen' }}</h3>
          <form @submit.prevent="isEditing ? saveCaseStudy() : addCaseStudy()" enctype="multipart/form-data">
            <input type="text" v-model.trim="formData.title" placeholder="Titel" class="styled-input" required />
            <textarea v-model.trim="formData.description" placeholder="Beschreibung" class="styled-input" required></textarea>
            <div class="form-group">
              <label for="customer" class="form-label">Kunde:</label>
              <select id="customer" v-model.number="formData.customer_id" class="styled-input select-input" required>
                <option value="" disabled>Wählen Sie einen Kunden</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="image" class="form-label">Bild:</label>
              <input type="file" id="image" @change="onFileChange" class="styled-input" />
            </div>
            <button type="submit" class="styled-button">Speichern</button>
            <button type="button" @click="cancelForm" class="styled-button secondary">Abbrechen</button>
          </form>
        </div>
        <div class="case-studies-list">
          <table class="case-studies-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titel</th>
                <th>Kunde</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="caseStudy in caseStudies" :key="caseStudy.id">
                <td>{{ caseStudy.id }}</td>
                <td>{{ caseStudy.title }}</td>
                <td>{{ caseStudy.clientName }}</td>
                <td>
                  <button @click="editCaseStudy(caseStudy)" class="edit-button">Bearbeiten</button>
                  <button @click="deleteCaseStudy(caseStudy.id)" class="delete-button">Löschen</button>
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
      caseStudies: [],
      clients: [],
      showAddForm: false,
      isEditing: false,
      formData: {
        id: null,
        title: '',
        description: '',
        customer_id: null,
        image: null,
      },
    };
  },
  created() {
    this.fetchClients().then(() => {
      this.fetchCaseStudies().then(() => {
        this.mapClientNames();
      });
    });
  },
  methods: {
    fetchCaseStudies() {
      return apiClient.get('/case-studies')
        .then(response => {
          this.caseStudies = response.data;
        })
        .catch(error => {
          console.error('Fehler beim Abrufen der Fallstudien:', error);
        });
    },
    fetchClients() {
      return apiClient.get('/clients')
        .then(response => {
          this.clients = response.data.filter(client => client.status === 'active');
        })
        .catch(error => {
          console.error('Fehler beim Abrufen der Kunden:', error);
        });
    },
    mapClientNames() {
      this.caseStudies = this.caseStudies.map(caseStudy => {
        const client = this.clients.find(c => c.id === caseStudy.customer_id);
        return {
          ...caseStudy,
          clientName: client ? client.name : 'Unbekannter Kunde',
        };
      });
    },
    onFileChange(event) {
      // Verarbeitung der ausgewählten Datei
      this.formData.image = event.target.files[0];
    },
    addCaseStudy() {
      if (!this.formData.title || !this.formData.customer_id) {
        alert('Titel und Kundennummer sind erforderlich.');
        return;
      }

      const formData = new FormData();
      formData.append('title', this.formData.title);
      formData.append('description', this.formData.description);
      formData.append('customer_id', this.formData.customer_id);

      // Fügen Sie das Feld 'image' nur hinzu, wenn eine Datei ausgewählt wurde
      if (this.formData.image) {
        formData.append('image', this.formData.image);
      }

      apiClient.post('/case-studies', formData)
        .then(() => {
          alert('Fallstudie erfolgreich hinzugefügt!');
          this.showAddForm = false;
          // Nach dem Hinzufügen die Fallstudien neu laden und Kundennamen mappen
          this.fetchCaseStudies().then(() => {
            this.mapClientNames();
          });
        })
        .catch(error => {
          console.error('Fehler beim Hinzufügen der Fallstudie:', error);
        });
    },
    editCaseStudy(caseStudy) {
      this.isEditing = true;
      this.showAddForm = true;
      this.formData = { ...caseStudy };
    },
    saveCaseStudy() {
      if (!this.formData.title || !this.formData.customer_id) {
        alert('Titel und Kundennummer sind erforderlich.');
        return;
      }

      const formData = new FormData();
      formData.append('title', this.formData.title);
      formData.append('description', this.formData.description);
      formData.append('customer_id', this.formData.customer_id);

      if (this.formData.image) {
        formData.append('image', this.formData.image);
      }

      apiClient.put(`/case-studies/${this.formData.id}`, formData)
        .then(() => {
          alert('Fallstudie erfolgreich aktualisiert!');
          this.isEditing = false;
          this.showAddForm = false;
          // Nach dem Aktualisieren die Fallstudien neu laden und Kundennamen mappen
          this.fetchCaseStudies().then(() => {
            this.mapClientNames();
          });
        })
        .catch(error => {
          console.error('Fehler beim Aktualisieren der Fallstudie:', error);
        });
    },
    deleteCaseStudy(caseStudyId) {
      if (confirm('Sind Sie sicher, dass Sie diese Fallstudie löschen möchten?')) {
        apiClient.delete(`/case-studies/${caseStudyId}`)
          .then(() => {
            alert('Fallstudie erfolgreich gelöscht!');
            // Nach dem Löschen die Fallstudien neu laden und Kundennamen mappen
            this.fetchCaseStudies().then(() => {
              this.mapClientNames();
            });
          })
          .catch(error => {
            console.error('Fehler beim Löschen der Fallstudie:', error);
          });
      }
    },
    cancelForm() {
      this.showAddForm = false;
      this.isEditing = false;
      this.formData = {
        id: null,
        title: '',
        description: '',
        customer_id: null,
        image: null,
      };
    },
    logout() {
      apiClient.post('/logout')
        .then(() => {
          alert('Erfolgreich abgemeldet!');
          this.$router.push('/'); // Weiterleitung zur Hauptseite
        })
        .catch(error => {
          console.error('Fehler beim Abmelden:', error);
        });
    },
  },
};
</script>

<style scoped>
.case-studies-management-page {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to right, #ffecd2, #fcb69f); /* Aktualisierter Hintergrund */
  color: #333;
  min-height: 100vh;
  padding: 20px;
}
.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.management-title {
  color: #ff6b6b;
  font-size: 2.5em;
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
.management-container {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}
.editor-info {
  width: 25%;
  text-align: center;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.editor-welcome {
  color: #ff6b6b;
  font-size: 1.5em;
}
.management-main {
  width: 75%;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.actions-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
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
  background: linear-gradient(45deg, #4caf50, #81c784);
  color: white;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}
.action-button:hover {
  background: linear-gradient(45deg, #45a049, #66bb6a);
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
.case-study-form {
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.form-label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.styled-input {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 2px solid #ddd;
  font-size: 1.1em;
}
.select-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpolygon points='0,0 10,0 5,5' fill='%23ddd'/%3E%3C/svg%3E") no-repeat right 10px center;
  background-color: #ffffff;
  padding-right: 30px;
}
.styled-button {
  padding: 15px 30px;
  font-size: 1.2em;
  font-weight: bold;
  background: linear-gradient(45deg, #ff6b6b, #fcb69f);
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s ease, transform 0.3s ease;
}
.styled-button:hover {
  background: linear-gradient(45deg, #e55e5e, #fcb69f);
  transform: translateY(-5px);
}
.styled-button.secondary {
  background: linear-gradient(45deg, #ffcc00, #ffeb3b);
  color: #333;
  margin-left: 10px;
}
.styled-button.secondary:hover {
  background: linear-gradient(45deg, #fbc02d, #ffeb3b);
}
.case-studies-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.case-studies-table th,
.case-studies-table td {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}
.case-studies-table th {
  background: #ff6b6b;
  color: white;
  font-size: 1.1em;
}
.edit-button,
.delete-button {
  background: linear-gradient(45deg, #007bff, #64b5f6);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 15px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 1em;
  transition: background 0.3s ease, transform 0.3s ease;
}
.edit-button:hover {
  background: linear-gradient(45deg, #0056b3, #42a5f5);
  transform: translateY(-3px);
}
.delete-button {
  background: linear-gradient(45deg, #dc3545, #e57373);
}
.delete-button:hover {
  background: linear-gradient(45deg, #c82333, #ef5350);
  transform: translateY(-3px);
}
</style>
