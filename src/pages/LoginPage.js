import React from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import LoginForm from '../components/LoginForm';
import Swal from 'sweetalert2';
import '../css/LoginPage.css'; // Asegúrate de tener este archivo CSS para el estilo

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async ({ nombreUsuario, passUser }) => {
    try {
      const data = await login(nombreUsuario, passUser);
      Swal.fire({
        icon: 'success',
        title: 'Login exitoso',
        text: `Bienvenido, ${data.usuario.nombreUsuario}`,
      }).then(() => {
        navigate('/dashboard');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: error.error || 'Usuario o contraseña incorrectos',
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <img
            src="/logoMac.jpeg" // Ruta a la imagen
            alt="Logo"
            className="logo"
          />
        </div>
        <h2>Iniciar Sesión</h2>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
