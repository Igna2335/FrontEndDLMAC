import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const login = async (nombreUsuario, passUser) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      nombreUsuario,
      passUser,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Error al conectar con el servidor' };
  }
};
