import { useState, useEffect } from 'react';
import Layout from './Layout';
import api from '../services/api';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteActual, setClienteActual] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    activo: true
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modo, setModo] = useState('crear');
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [emailBusqueda, setEmailBusqueda] = useState('');

  // Cargar clientes
  const cargarClientes = async () => {
    setLoading(true);
    try {
      const endpoint = filtroActivo ? '/Clientes/activos' : '/Clientes';
      const response = await api.get(endpoint);
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar por email
  const buscarPorEmail = async () => {
    if (!emailBusqueda.trim()) {
      cargarClientes();
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/Clientes/email/${emailBusqueda}`);
      setClientes([response.data]);
    } catch (error) {
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear/Editar cliente
  const guardarCliente = async () => {
    if (!clienteActual.nombre || !clienteActual.email) {
      alert('Nombre y email son obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (modo === 'crear') {
        await api.post('/Clientes', clienteActual);
      } else {
        await api.put(`/Clientes/${clienteActual.clienteId}`, clienteActual);
      }
      setModalVisible(false);
      cargarClientes();
      resetForm();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado
  const cambiarEstado = async (cliente) => {
    try {
      await api.put(`/Clientes/${cliente.clienteId}/estado`);
      cargarClientes();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await api.delete(`/Clientes/${id}`);
        cargarClientes();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  const resetForm = () => {
    setClienteActual({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      activo: true
    });
  };

  const abrirModal = (cliente = null) => {
    if (cliente) {
      setClienteActual(cliente);
      setModo('editar');
    } else {
      resetForm();
      setModo('crear');
    }
    setModalVisible(true);
  };

  useEffect(() => {
    cargarClientes();
  }, [filtroActivo]);

  return (
    <Layout title="Gestión de Clientes">
      <div className="min-h-screen bg-hotel-navy p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-hotel-gold mb-6">
            Gestión de Clientes — Hotel SGS
          </h1>
          
          {/* Controles */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Buscar por email..."
                value={emailBusqueda}
                onChange={(e) => setEmailBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarPorEmail()}
                className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white placeholder-white/60 focus:border-hotel-gold focus:outline-none"
              />
            </div>
            <button
              onClick={buscarPorEmail}
              className="px-4 py-2 bg-hotel-gold text-hotel-navy font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Buscar
            </button>
            <button
              onClick={() => setFiltroActivo(!filtroActivo)}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                filtroActivo 
                  ? 'bg-hotel-gold text-hotel-navy' 
                  : 'bg-white/10 text-white border border-hotel-gold/30 hover:bg-hotel-gold/10'
              }`}
            >
              {filtroActivo ? 'Ver Todos' : 'Solo Activos'}
            </button>
            <button
              onClick={() => abrirModal()}
              className="px-6 py-2 bg-hotel-gold text-hotel-navy font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Agregar Cliente
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
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Teléfono</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-white">
                      Cargando...
                    </td>
                  </tr>
                ) : clientes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-white/60">
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  clientes.map((cliente) => (
                    <tr key={cliente.clienteId} className="border-b border-hotel-gold/10 hover:bg-white/5">
                      <td className="px-6 py-4 text-white">{cliente.nombre}</td>
                      <td className="px-6 py-4 text-white">{cliente.email}</td>
                      <td className="px-6 py-4 text-white">{cliente.telefono || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cliente.activo 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {cliente.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {/* Editar */}
                          <button
                            onClick={() => abrirModal(cliente)}
                            className="p-2 text-hotel-gold hover:bg-hotel-gold/10 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </button>
                          {/* Cambiar Estado */}
                          <button
                            onClick={() => cambiarEstado(cliente)}
                            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                              cliente.activo 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                          >
                            Cambiar Estado
                          </button>
                          {/* Eliminar */}
                          <button
                            onClick={() => eliminarCliente(cliente.clienteId)}
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
                {modo === 'crear' ? 'Agregar Cliente' : 'Editar Cliente'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={clienteActual.nombre}
                    onChange={(e) => setClienteActual({...clienteActual, nombre: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white focus:border-hotel-gold focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={clienteActual.email}
                    onChange={(e) => setClienteActual({...clienteActual, email: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white focus:border-hotel-gold focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={clienteActual.telefono}
                    onChange={(e) => setClienteActual({...clienteActual, telefono: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white focus:border-hotel-gold focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Dirección</label>
                  <textarea
                    value={clienteActual.direccion}
                    onChange={(e) => setClienteActual({...clienteActual, direccion: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white focus:border-hotel-gold focus:outline-none"
                    rows="3"
                  />
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
                  onClick={guardarCliente}
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

export default Clientes;
