import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { AuthContext } from '../auth/authContext';
import { SocketContext } from '../sockets/SocketContext';
import '../../assets/styles/common/login.css';

function Login() {
  const { setToken, setUserData } = useContext(AuthContext);
  const { connectSocket } = useContext(SocketContext);

  const [formData, setFormData] = useState({
    username_or_email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${API_URL}/users/login`, formData)
      .then((response) => {
        if (response.status === 200) {
          const accessToken = response.data.token;
          const userData = response.data.user;

          setToken(accessToken);
          setUserData(userData);
          connectSocket(userData.id);

          // **Redirigir según el rol del usuario**
          
          if (userData.admin) {
            window.location.href = '/admin/games'; // Página de administración para el administrador
          } else {
            
            window.location.href = '/modo-partida'; // Página estándar para usuarios normales
          }
        }
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
        alert('Usuario o contraseña incorrectos.');
      });
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-box">
          <h1>Iniciar Sesión</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username_or_email">Usuario o Correo Electrónico:</label>
            <input
              type="text"
              id="username_or_email"
              name="username_or_email"
              value={formData.username_or_email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Ingresar</button>
          </form>
          <div className="register-link">
            ¿No tienes cuenta? <a href="/registro">Regístrate</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
