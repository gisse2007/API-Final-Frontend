import { useState, useEffect } from 'react';
import Layout from './Layout';
import api from '../services/api';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [servicioActual, setServicioActual] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    duracionMinutos: 0,
    activo: true
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modo, setModo] = useState('crear');

  // Cargar servicios
  const cargarServicios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/Servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear/Editar servicio
  const guardarServicio = async () => {
    if (!servicioActual.nombre || servicioActual.precio <= 0 || servicioActual.duracionMinutos <= 0) {
      alert('Nombre es obligatorio, precio y duración deben ser mayor a 0');
      return;
    }

    setLoading(true);
    try {
      if (modo === 'crear') {
        await api.post('/Servicios', servicioActual);
      } else {
        await api.put(`/Servicios/${servicioActual.servicioId}`, servicioActual);
      }
      setModalVisible(false);
      cargarServicios();
      resetForm();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar servicio
  const eliminarServicio = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este servicio?')) {
      try {
        await api.delete(`/Servicios/${id}`);
        cargarServicios();
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
      }
    }
  };

  const resetForm = () => {
    setServicioActual({
      nombre: '',
      descripcion: '',
      precio: 0,
      duracionMinutos: 0,
      activo: true
    });
  };

  const abrirModal = (servicio = null) => {
    if (servicio) {
      setServicioActual(servicio);
      setModo('editar');
    } else {
      resetForm();
      setModo('crear');
    }
    setModalVisible(true);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(precio);
  };

  const formatearDuracion = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${mins}m`;
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  return (
    <Layout title="Gestión de Servicios">
      <div className="min-h-screen bg-hotel-navy p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-hotel-gold mb-6">
            Gestión de Servicios — Hotel SGS
          </h1>
          
          <div className="flex justify-end">
            <button
              onClick={() => abrirModal()}
              className="px-6 py-2 bg-hotel-gold text-hotel-navy font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Agregar Servicio
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white/5 rounded-xl border border-hotel-gold/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-hotel-gold/20">
                <tr>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Nombre</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Descripción</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Precio</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Duración</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-white">
                      Cargando...
                    </td>
                  </tr>
                ) : servicios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-white/60">
                      No se encontraron servicios
                    </td>
                  </tr>
                ) : (
                  servicios.map((servicio) => (
                    <tr key={servicio.servicioId} className="border-b border-hotel-gold/10 hover:bg-white/5">
                      <td className="px-6 py-4 text-white font-medium">{servicio.nombre}</td>
                      <td className="px-6 py-4 text-white/80 max-w-xs truncate">
                        {servicio.descripcion || '-'}
                      </td>
                      <td className="px-6 py-4 text-hotel-gold font-semibold">
                        {formatearPrecio(servicio.precio)}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {formatearDuracion(servicio.duracionMinutos)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          servicio.activo 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {servicio.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => abrirModal(servicio)}
                            className="p-2 text-hotel-gold hover:bg-hotel-gold/10 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => eliminarServicio(servicio.servicioId)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-hotel-gold rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: '#10243d' }}>
              <h2 className="text-xl font-serif font-semibold text-hotel-gold mb-6">
                {modo === 'crear' ? 'Agregar Servicio' : 'Editar Servicio'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={servicioActual.nombre}
                    onChange={(e) => setServicioActual({...servicioActual, nombre: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white focus:border-hotel-gold focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Descripción</label>
                  <textarea
                    value={servicioActual.descripcion}
                    onChange={(e) => setServicioActual({...servicioActual, descripcion: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white focus:border-hotel-gold focus:outline-none"
                    rows="3"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Precio *</label>
                    <input
                      type="number"
                      min="1"
                      value={servicioActual.precio}
                      onChange={(e) => setServicioActual({...servicioActual, precio: Number(e.target.value)})}
                      className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white focus:border-hotel-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Duración (min) *</label>
                    <input
                      type="number"
                      min="1"
                      value={servicioActual.duracionMinutos}
                      onChange={(e) => setServicioActual({...servicioActual, duracionMinutos: Number(e.target.value)})}
                      className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white focus:border-hotel-gold focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={servicioActual.activo}
                    onChange={(e) => setServicioActual({...servicioActual, activo: e.target.checked})}
                    className="mr-2 w-4 h-4 text-hotel-gold bg-white/10 border-hotel-gold/30 rounded focus:ring-hotel-gold"
                  />
                  <label htmlFor="activo" className="text-white text-sm">Servicio activo</label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setModalVisible(false)}
                  className="px-4 py-2 text-white border border-hotel-gold/30 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarServicio}
                  disabled={loading}
                  className="px-6 py-2 bg-hotel-gold text-hotel-navy font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Servicios;