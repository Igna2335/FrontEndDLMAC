import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar'; // Importamos el componente Navbar

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({ sku: '', nombreProducto: '', existencia: '', binNum: '', wareHouse: '' });
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  // URL base para el API
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Obtener lista de productos
  const obtenerProductos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/productos`);
      setProductos(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error al obtener productos', 'error');
    }
  };

  // Crear o actualizar producto
  const guardarProducto = async () => {
    try {
      if (isEditMode) {
        // Actualizar producto
        await axios.put(`${apiUrl}/productos/${producto.idProducto}`, producto);
        Swal.fire('Actualizado', 'Producto actualizado con éxito', 'success');
      } else {
        // Crear producto
        await axios.post(`${apiUrl}/productos`, producto);
        Swal.fire('Creado', 'Producto creado con éxito', 'success');
      }
      setDialogVisible(false);
      obtenerProductos();
      setProducto({ sku: '', nombreProducto: '', existencia: '', binNum: '', wareHouse: '' });
    } catch (error) {
      Swal.fire('Error', 'Error al guardar producto', 'error');
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
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
          await axios.delete(`${apiUrl}/productos/${id}`);
          Swal.fire('Eliminado', 'Producto eliminado con éxito', 'success');
          obtenerProductos();
        } catch (error) {
          Swal.fire('Error', 'Error al eliminar producto', 'error');
        }
      }
    });
  };

  // Editar producto
  const editarProducto = (producto) => {
    setProducto(producto);
    setEditMode(true);
    setDialogVisible(true);
  };

  // Abrir el diálogo para crear un nuevo producto
  const abrirNuevoProducto = () => {
    setProducto({ sku: '', nombreProducto: '', existencia: '', binNum: '', wareHouse: '' });
    setEditMode(false);
    setDialogVisible(true);
  };

  return (
    <div id='espacioNavbar'>
        <Navbar /> {/* Insertamos el Navbar aquí */}
      <h2>Productos</h2>
      <Button label="Nuevo Producto" icon="pi pi-plus" onClick={abrirNuevoProducto} className="mb-3" />
      
      <DataTable value={productos} responsiveLayout="scroll">
        <Column field="idProducto" header="ID" sortable></Column>
        <Column field="sku" header="SKU" sortable></Column>
        <Column field="nombreProducto" header="Nombre del Producto" sortable></Column>
        <Column field="existencia" header="Existencia" sortable></Column>
        <Column field="binNum" header="Número de Bin" sortable></Column>
        <Column field="wareHouse" header="Almacén" sortable></Column>
        <Column
          header="Acciones"
          body={(rowData) => (
            <div>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editarProducto(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarProducto(rowData.idProducto)} />
            </div>
          )}
        ></Column>
      </DataTable>

      <Dialog
        visible={isDialogVisible}
        style={{ width: '400px' }}
        header={isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
        modal
        onHide={() => setDialogVisible(false)}
        footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
            <Button label="Guardar" icon="pi pi-check" onClick={guardarProducto} autoFocus />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="sku">SKU</label>
            <InputText
              id="sku"
              value={producto.sku}
              onChange={(e) => setProducto({ ...producto, sku: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="nombreProducto">Nombre del Producto</label>
            <InputText
              id="nombreProducto"
              value={producto.nombreProducto}
              onChange={(e) => setProducto({ ...producto, nombreProducto: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="existencia">Existencia</label>
            <InputText
              id="existencia"
              value={producto.existencia}
              onChange={(e) => setProducto({ ...producto, existencia: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="binNum">Número de Bin</label>
            <InputText
              id="binNum"
              value={producto.binNum}
              onChange={(e) => setProducto({ ...producto, binNum: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="wareHouse">Almacén</label>
            <InputText
              id="wareHouse"
              value={producto.wareHouse}
              onChange={(e) => setProducto({ ...producto, wareHouse: e.target.value })}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Productos;
