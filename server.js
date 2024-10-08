const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    process.exit(1);
  } else {
    console.log('Успешное подключение к базе данных');
  }
});

// Регистрация редактора
app.post('/api/register', async (req, res) => {
  const { email_or_username, password } = req.body;

  if (!email_or_username || !password) {
    return res.status(400).send('Email/Username и пароль обязательны');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO editors (email_or_username, password) VALUES (?, ?)';
    db.query(query, [email_or_username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Ошибка при добавлении редактора:', err);
        return res.status(500).send('Ошибка на сервере');
      }
      res.status(201).send('Редактор успешно зарегистрирован');
    });
  } catch (error) {
    console.error('Ошибка при хешировании пароля:', error);
    res.status(500).send('Ошибка на сервере');
  }
});

// CRUD операции для клиентов

// Создать клиента
app.post('/api/clients', (req, res) => {
  const { name, logo, status } = req.body;

  if (!name) {
    return res.status(400).send('Имя клиента обязательно');
  }

  const query = 'INSERT INTO clients (name, logo, status) VALUES (?, ?, ?)';
  db.query(query, [name, logo || '', status || 'active'], (err, result) => {
    if (err) {
      console.error('Ошибка при добавлении клиента:', err);
      return res.status(500).send('Ошибка на сервере');
    }
    res.status(201).send('Клиент успешно добавлен');
  });
});

// Получить список всех клиентов
app.get('/api/clients', (req, res) => {
  const query = 'SELECT * FROM clients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Ошибка при получении клиентов:', err);
      return res.status(500).send('Ошибка на сервере');
    }
    res.status(200).json(results);
  });
});

// Обновить клиента
app.put('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  const { name, logo, status } = req.body;

  const query = 'UPDATE clients SET name = ?, logo = ?, status = ? WHERE id = ?';
  db.query(query, [name, logo, status, id], (err, result) => {
    if (err) {
      console.error('Ошибка при обновлении клиента:', err);
      return res.status(500).send('Ошибка на сервере');
    }
    res.status(200).send('Клиент успешно обновлен');
  });
});

// Удалить клиента
app.delete('/api/clients/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM clients WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Ошибка при удалении клиента:', err);
      return res.status(500).send('Ошибка на сервере');
    }
    res.status(200).send('Клиент успешно удален');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
