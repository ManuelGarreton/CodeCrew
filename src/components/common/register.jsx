import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import '../../assets/styles/common/register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/users/register`, formData)
      .then((response) => {
        if (response.status === 200) {
          // Redirigir al usuario a la página de inicio de sesión
          window.location.href = '/ingreso';
        }
      })
      .catch((error) => {
        console.error('Error al registrar usuario:', error);
      });
  };

  return (
    <div className="register">
      <div className="register-box">
        <h1>Nuevo Usuario</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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
            placeholder="Mínimo 8 caracteres"
          />

          <label htmlFor="confirm_password">Repetir Contraseña:</label>
          <input
            type="password"
            id="confirm_password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Comenzar</button>
        </form>
        <p className="login-link">
          ¿Ya tienes cuenta? <a href="/ingreso">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
