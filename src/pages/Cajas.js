import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Swal from 'sweetalert2';

import Navbar from '../components/Navbar'; // Importamos el componente Navbar

const Cajas = () => {
  const [cajas, setCajas] = useState([]);
  const [caja, setCaja] = useState({ idBolsa: '', secuenciaEmbarque: '', verificadoPor: '' });
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  // URL base para la API
  const apiUrl = 'http://localhost:3000/api';

  useEffect(() => {
    obtenerCajas();
  }, []);

  // Obtener lista de cajas
  const obtenerCajas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/cajas`);
      setCajas(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error al obtener cajas', 'error');
    }
  };

  // Crear o actualizar caja
  const guardarCaja = async () => {
    try {
      if (isEditMode) {
        // Actualizar caja
        await axios.put(`${apiUrl}/cajas/${caja.idCaja}`, caja);
        Swal.fire('Actualizado', 'Caja actualizada con éxito', 'success');
      } else {
        // Crear caja
        await axios.post(`${apiUrl}/cajas`, caja);
        Swal.fire('Creado', 'Caja creada con éxito', 'success');
      }
      setDialogVisible(false);
      obtenerCajas();
      setCaja({ idBolsa: '', secuenciaEmbarque: '', verificadoPor: '' });
    } catch (error) {
      Swal.fire('Error', 'Error al guardar caja', 'error');
    }
  };

  // Eliminar caja
  const eliminarCaja = async (id) => {
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
          await axios.delete(`${apiUrl}/cajas/${id}`);
          Swal.fire('Eliminado', 'Caja eliminada con éxito', 'success');
          obtenerCajas();
        } catch (error) {
          Swal.fire('Error', 'Error al eliminar caja', 'error');
        }
      }
    });
  };

  // Editar caja
  const editarCaja = (caja) => {
    setCaja(caja);
    setEditMode(true);
    setDialogVisible(true);
  };

  // Abrir el diálogo para crear una nueva caja
  const abrirNuevaCaja = () => {
    setCaja({ idBolsa: '', secuenciaEmbarque: '', verificadoPor: '' });
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
      <h2>Cajas</h2>
      <Button label="Nueva Caja" icon="pi pi-plus" onClick={abrirNuevaCaja} className="mb-3" />
      
      <DataTable value={cajas} responsiveLayout="scroll">
        <Column field="idCaja" header="ID Caja" sortable></Column>
        <Column field="idBolsa" header="ID Bolsa" sortable></Column>
        <Column field="secuenciaEmbarque" header="Secuencia Embarque" sortable></Column>
        <Column field="verificadoPor" header="Verificado Por" sortable></Column>
        
        <Column
          field="fechaVerificacion"
          header="Fecha Verificacion"
          body={(rowData) => formatearFecha(rowData.fechaVerificacion)}
          sortable
        ></Column>
        <Column
          header="Acciones"
          body={(rowData) => (
            <div>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editarCaja(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarCaja(rowData.idCaja)} />
            </div>
          )}
        ></Column>
      </DataTable>

      <Dialog
        visible={isDialogVisible}
        style={{ width: '400px' }}
        header={isEditMode ? 'Editar Caja' : 'Nueva Caja'}
        modal
        onHide={() => setDialogVisible(false)}
        footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
            <Button label="Guardar" icon="pi pi-check" onClick={guardarCaja} autoFocus />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="idBolsa">ID Bolsa</label>
            <InputText
              id="idBolsa"
              value={caja.idBolsa}
              onChange={(e) => setCaja({ ...caja, idBolsa: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="secuenciaEmbarque">Secuencia Embarque</label>
            <InputText
              id="secuenciaEmbarque"
              value={caja.secuenciaEmbarque}
              onChange={(e) => setCaja({ ...caja, secuenciaEmbarque: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="verificadoPor">Verificado Por</label>
            <InputText
              id="verificadoPor"
              value={caja.verificadoPor}
              onChange={(e) => setCaja({ ...caja, verificadoPor: e.target.value })}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Cajas;
