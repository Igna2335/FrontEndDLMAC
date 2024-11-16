import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Swal from 'sweetalert2';

import Navbar from '../components/Navbar'; // Importamos el componente Navbar

const Bolsas = () => {
  const [bolsas, setBolsas] = useState([]);
  const [bolsa, setBolsa] = useState({ sku: '', cantidadPedida: '', cantidadSurtida: '', planeacion: '', surtidoPor: '', fechaSurtido: '' });
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    obtenerBolsas();
  }, []);

  // Obtener lista de bolsas
  const obtenerBolsas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/bolsas`);
      setBolsas(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error al obtener bolsas', 'error');
    }
  };

  // Crear o actualizar bolsa
  const guardarBolsa = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${apiUrl}/bolsas/${bolsa.idBolsa}`, bolsa);
        Swal.fire('Actualizado', 'Bolsa actualizada con éxito', 'success');
      } else {
        await axios.post(`${apiUrl}/bolsas`, bolsa);
        Swal.fire('Creado', 'Bolsa creada con éxito', 'success');
      }
      setDialogVisible(false);
      obtenerBolsas();
      setBolsa({ sku: '', cantidadPedida: '', cantidadSurtida: '', planeacion: '', surtidoPor: '', fechaSurtido: '' });
    } catch (error) {
      Swal.fire('Error', 'Error al guardar bolsa', 'error');
    }
  };

  // Eliminar bolsa
  const eliminarBolsa = async (id) => {
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
          await axios.delete(`${apiUrl}/bolsas/${id}`);
          Swal.fire('Eliminado', 'Bolsa eliminada con éxito', 'success');
          obtenerBolsas();
        } catch (error) {
          Swal.fire('Error', 'Error al eliminar bolsa', 'error');
        }
      }
    });
  };

  // Editar bolsa
  const editarBolsa = (bolsa) => {
    setBolsa(bolsa);
    setEditMode(true);
    setDialogVisible(true);
  };

  // Abrir el diálogo para crear una nueva bolsa
  const abrirNuevaBolsa = () => {
    setBolsa({ sku: '', cantidadPedida: '', cantidadSurtida: '', planeacion: '', surtidoPor: '', fechaSurtido: '' });
    setEditMode(false);
    setDialogVisible(true);
  };

   // Función para formatear la fecha
   const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  };

  return (
    <div id='espacioNavbar'>
      <Navbar /> {/* Insertamos el Navbar aquí */}
      <h2>Bolsas</h2>
      <Button label="Nueva Bolsa" icon="pi pi-plus" onClick={abrirNuevaBolsa} className="mb-3" />

      <DataTable value={bolsas} responsiveLayout="scroll">
        <Column field="idBolsa" header="ID" sortable></Column>
        <Column field="sku" header="SKU" sortable></Column>
        <Column field="cantidadPedida" header="Cantidad Pedida" sortable></Column>
        <Column field="cantidadSurtida" header="Cantidad Surtida" sortable></Column>
        <Column field="planeacion" header="Planeación" sortable></Column>
        <Column field="surtidoPor" header="Surtido Por" sortable></Column>
        <Column
          field="fechaSurtido"
          header="Fecha surtido"
          body={(rowData) => formatearFecha(rowData.fechaSurtido)}
          sortable
        ></Column>
        <Column
          header="Acciones"
          body={(rowData) => (
            <div>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editarBolsa(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarBolsa(rowData.idBolsa)} />
            </div>
          )}
        ></Column>
      </DataTable>

      <Dialog
        visible={isDialogVisible}
        style={{ width: '400px' }}
        header={isEditMode ? 'Editar Bolsa' : 'Nueva Bolsa'}
        modal
        onHide={() => setDialogVisible(false)}
        footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
            <Button label="Guardar" icon="pi pi-check" onClick={guardarBolsa} autoFocus />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="sku">SKU</label>
            <InputText id="sku" value={bolsa.sku} onChange={(e) => setBolsa({ ...bolsa, sku: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="cantidadPedida">Cantidad Pedida</label>
            <InputText id="cantidadPedida" value={bolsa.cantidadPedida} onChange={(e) => setBolsa({ ...bolsa, cantidadPedida: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="cantidadSurtida">Cantidad Surtida</label>
            <InputText id="cantidadSurtida" value={bolsa.cantidadSurtida} onChange={(e) => setBolsa({ ...bolsa, cantidadSurtida: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="planeacion">Planeación</label>
            <InputText id="planeacion" value={bolsa.planeacion} onChange={(e) => setBolsa({ ...bolsa, planeacion: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="surtidoPor">Surtido Por</label>
            <InputText id="surtidoPor" value={bolsa.surtidoPor} onChange={(e) => setBolsa({ ...bolsa, surtidoPor: e.target.value })} />
          </div>
        
        </div>
      </Dialog>
    </div>
  );
};

export default Bolsas;
