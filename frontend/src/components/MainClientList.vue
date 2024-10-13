<template>
  <div class="client-list-page">
    <header class="header">
      <h1 class="header-title">Case Studies Management</h1>
      <div class="header-buttons">
        <button @click="$router.push('/login')" class="header-button">Login</button>
        <button v-if="isEditor" @click="addClient" class="header-button secondary">Client hinzufügen</button>
      </div>
    </header>
    <section id="client-list-section" class="client-list-section">
      <div class="client-list-container">
        <h2 class="client-list-title">Kunden</h2>
        <ul class="client-list">
          <li
            v-for="client in activeClients"
            :key="client.id"
            class="client-item"
          >
            <div @click="toggleClientCases(client.id)" class="client-overview">
              <img
                :src="client.logo"
                alt="Kundenlogo"
                class="client-logo"
              />
              <div class="client-info">
                <h3 class="client-name">{{ client.name }}</h3>
                <p
                  :class="[
                    'client-status',
                    client.status === 'active' ? 'active' : 'inactive',
                  ]"
                >
                  {{ capitalizeStatus(client.status) }}
                </p>
              </div>
            </div>
            <transition name="slide-fade">
              <div
                v-if="selectedClientId === client.id"
                class="case-studies"
              >
                <h4>Case Studies</h4>
                <ul>
                  <li
                    v-for="caseStudy in getCaseStudiesForClient(client.id)"
                    :key="caseStudy.id"
                    class="case-study-item"
                  >
                    <div class="case-study-content">
                      <p><strong>Logo:</strong> {{ caseStudy.logo }}</p>
                      <p><strong>Titel:</strong> {{ caseStudy.title }}</p>
                      <p><strong>Beschreibung:</strong> {{ caseStudy.description }}</p>
                      <p><strong>Bild:</strong> {{ caseStudy.image }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </transition>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import apiClient from '@/services/api';

export default {
  data() {
    return {
      clients: [],
      isEditor: false,
      selectedClientId: null,
      caseStudies: [],
    };
  },
  computed: {
    activeClients() {
      return this.clients.filter((client) => client.status === 'active');
    },
  },
  created() {
    console.log('Komponente erstellt');
    this.fetchClients();
    this.fetchCaseStudies();
    // Überprüfen, ob der Benutzer ein Editor ist
    this.isEditor = localStorage.getItem('userRole') === 'editor';
  },
  methods: {
    fetchClients() {
      apiClient
        .get('/clients')
        .then((response) => {
          console.log('Empfangene Kunden:', response.data);
          this.clients = response.data;
        })
        .catch((error) => {
          console.error('Fehler beim Abrufen der Kunden:', error);
        });
    },
    fetchCaseStudies() {
      apiClient
        .get('/case-studies')
        .then((response) => {
          console.log('Empfangene Case Studies:', response.data);
          this.caseStudies = response.data;
        })
        .catch((error) => {
          console.error('Fehler beim Abrufen der Case Studies:', error);
        });
    },
    toggleClientCases(clientId) {
      if (this.selectedClientId === clientId) {
        this.selectedClientId = null;
      } else {
        this.selectedClientId = clientId;
      }
      console.log('Ausgewählte Kunden-ID:', this.selectedClientId);
    },
    getCaseStudiesForClient(clientId) {
      const filtered = this.caseStudies.filter(
        (caseStudy) => caseStudy.customer_id === clientId
      );
      console.log('Gefilterte Case Studies:', filtered);
      return filtered;
    },
    addClient() {
      this.$router.push('/add-client');
    },
    capitalizeStatus(status) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
  },
};
</script>

<style scoped>
.client-list-page {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to right, #ffecd2, #fcb69f);
  color: #333;
  min-height: 100vh;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.header-title {
  font-size: 2.5em;
  color: #ff6b6b;
  font-weight: 700;
}
.header-buttons {
  display: flex;
  gap: 15px;
}
.header-button {
  padding: 15px 30px;
  font-size: 1.2em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  background: #ff6b6b;
  color: white;
}
.header-button:hover {
  background: #e55e5e;
}
.header-button.secondary {
  background: linear-gradient(45deg, #4caf50, #81c784);
}
.header-button.secondary:hover {
  background: linear-gradient(45deg, #45a049, #66bb6a);
}
.client-list-section {
  display: flex;
  justify-content: center;
  padding: 40px;
}
.client-list-container {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  padding: 40px;
  max-width: 800px;
  width: 100%;
}
.client-list-title {
  text-align: center;
  color: #ff6b6b;
  font-weight: 700;
  font-size: 2.5em;
  margin-bottom: 20px;
}
.client-list {
  list-style-type: none;
  padding: 0;
}
.client-item {
  background: #f7f7f7;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  overflow: hidden;
}
.client-item:hover {
  background: #ffe0b2;
}
.client-overview {
  display: flex;
  align-items: center;
}
.client-logo {
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 50%;
  object-fit: cover;
}
.client-info {
  flex-grow: 1;
}
.client-name {
  font-size: 1.5em;
  color: #333;
}
.client-status {
  font-size: 1em;
  text-transform: capitalize;
}
.client-status.active {
  color: #4caf50;
}
.client-status.inactive {
  color: #f44336;
}
.case-studies {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 15px;
  transition: all 0.5s ease;
}
.case-studies h4 {
  margin-bottom: 15px;
  font-size: 1.8em;
  color: #ff6b6b;
}
.case-study-item {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}
.case-study-item:last-child {
  border-bottom: none;
}
.case-study-content {
  display: flex;
  flex-direction: column;
}
.case-study-content p {
  margin: 5px 0;
  font-size: 1em;
  color: #333;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
