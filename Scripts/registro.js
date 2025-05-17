document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:4000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('message').textContent = `Usuario registrado: ${result.user.username}`;
    } else {
      document.getElementById('message').textContent = result.message;
    }
  } catch (err) {
    document.getElementById('message').textContent = 'Error de conexión con la API';
  }
});
