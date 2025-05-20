const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware para habilitar CORS y parsear JSON
app.use(cors());
app.use(express.json());

// Función para cargar los usuarios desde el archivo
function loadUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Función para guardar los usuarios en el archivo
function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// Ruta: Obtener todos los usuarios
app.get('/api/users', (req, res) => {
  const users = loadUsers();
  res.json(users);
});

// Ruta: Obtener usuario por ID
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const users = loadUsers();
  const user = users.find(u => u.id === id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

// Ruta: Registrar nuevo usuario
app.post('/api/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }

  const users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'El usuario ya existe' });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    password
  };

  users.push(newUser);
  saveUsers(users); // Guardamos los usuarios en el archivo

  res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
});

// Ruta: Validar usuario (login)
app.post('/api/users/validate', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ message: 'Login exitoso', user });
  } else {
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`API Manager corriendo en http://localhost:${PORT}`);
});
