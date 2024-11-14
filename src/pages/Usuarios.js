import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar'; // Importamos el componente Navbar
import '../css/Usuarios.css'; // Asegurándonos de que el CSS se aplica

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({ nombreUsuario: '', passUser: '', rol: '' });
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const apiUrl = 'http://localhost:3000/api';

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get(`${apiUrl}/usuarios`);
      setUsuarios(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error al obtener usuarios', 'error');
    }
  };

  const guardarUsuario = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${apiUrl}/usuarios/${usuario.idUsuario}`, usuario);
        Swal.fire('Actualizado', 'Usuario actualizado con éxito', 'success');
      } else {
        await axios.post(`${apiUrl}/usuarios`, usuario);
        Swal.fire('Creado', 'Usuario creado con éxito', 'success');
      }
      setDialogVisible(false);
      obtenerUsuarios();
      setUsuario({ nombreUsuario: '', passUser: '', rol: '' });
    } catch (error) {
      Swal.fire('Error', 'Error al guardar usuario', 'error');
    }
  };

  const eliminarUsuario = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/usuarios/${id}`);
          Swal.fire('Eliminado', 'Usuario eliminado con éxito', 'success');
          obtenerUsuarios();
        } catch (error) {
          Swal.fire('Error', 'Error al eliminar usuario', 'error');
        }
      }
    });
  };

  const editarUsuario = (usuario) => {
    setUsuario(usuario);
    setEditMode(true);
    setDialogVisible(true);
  };

  const abrirNuevoUsuario = () => {
    setUsuario({ nombreUsuario: '', passUser: '', rol: '' });
    setEditMode(false);
    setDialogVisible(true);
  };

  return (
    <div className="usuarios-container" >
      <Navbar /> {/* Insertamos el Navbar aquí */}
      <div className="content">
        <h2 className="usuarios-title">Usuarios</h2>
        <Button
          label="Nuevo Usuario"
          icon="pi pi-plus"
          onClick={abrirNuevoUsuario}
          className="btn-nuevo-usuario"
        />
        
        <DataTable value={usuarios} responsiveLayout="scroll" className="tabla-usuarios">
          <Column field="idUsuario" header="ID" sortable></Column>
          <Column field="nombreUsuario" header="Nombre de Usuario" sortable></Column>
          <Column field="rol" header="Rol" sortable></Column>
          <Column
            header="Acciones"
            body={(rowData) => (
              <div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-info mr-2"
                  onClick={() => editarUsuario(rowData)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                  onClick={() => eliminarUsuario(rowData.idUsuario)}
                />
              </div>
            )}
          ></Column>
        </DataTable>

        <Dialog
          visible={isDialogVisible}
          style={{ width: '450px', borderRadius: '10px' }}
          header={isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}
          modal
          onHide={() => setDialogVisible(false)}
          footer={
            <div>
              <Button label="Cancelar" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
              <Button label="Guardar" icon="pi pi-check" onClick={guardarUsuario} autoFocus className="btn-guardar" />
            </div>
          }
        >
          <div className="p-fluid">
            <div className="p-field">
              <label htmlFor="nombreUsuario">Nombre de Usuario</label>
              <InputText
                id="nombreUsuario"
                value={usuario.nombreUsuario}
                onChange={(e) => setUsuario({ ...usuario, nombreUsuario: e.target.value })}
                className="input-text"
              />
            </div>
            <div className="p-field">
              <label htmlFor="passUser">Contraseña</label>
              <InputText
                id="passUser"
                type="password"
                value={usuario.passUser}
                onChange={(e) => setUsuario({ ...usuario, passUser: e.target.value })}
                className="input-text"
              />
            </div>
            <div className="p-field">
              <label htmlFor="rol">Rol</label>
              <InputText
                id="rol"
                value={usuario.rol}
                onChange={(e) => setUsuario({ ...usuario, rol: e.target.value })}
                className="input-text"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Usuarios;
