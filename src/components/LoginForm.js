import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

const LoginForm = ({ onSubmit }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [passUser, setPassUser] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombreUsuario, passUser });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="p-field">
        <label htmlFor="username">Nombre de Usuario</label>
        <InputText
          id="username"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          required
        />
      </div>
      <div className="p-field">
        <label htmlFor="password">Contraseña</label>
        <Password
          id="password"
          value={passUser}
          onChange={(e) => setPassUser(e.target.value)}
          required
          toggleMask
        />
      </div>
      <Button label="Iniciar Sesión" icon="pi pi-sign-in" type="submit" />
    </form>
  );
};

export default LoginForm;
