import { useState, useEffect } from 'react';
import Layout from './Layout';
import api from '../services/api';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [reservaActual, setReservaActual] = useState({
    clienteId: '',
    servicioId: '',
    habitacion: '',
    fechaEntrada: '',
    fechaSalida: '',
    cantidadPersonas: 1,
    estado: 'Pendiente',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modo, setModo] = useState('crear');
  const [clienteBusqueda, setClienteBusqueda] = useState('');

  // ---------------------------------------------------------
  // CARGAR RESERVAS
  // ---------------------------------------------------------
  const cargarReservas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/Reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // BUSCAR POR CLIENTE
  // ---------------------------------------------------------
  const buscarPorCliente = async () => {
    if (!clienteBusqueda.trim()) {
      cargarReservas();
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/Reservas/cliente/${clienteBusqueda}`);
      setReservas(response.data);
    } catch (error) {
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // CREAR / EDITAR RESERVA (BODY LIMPIO)
  // ---------------------------------------------------------
  const guardarReserva = async () => {
    if (
      !reservaActual.clienteId ||
      !reservaActual.servicioId ||
      !reservaActual.habitacion ||
      !reservaActual.fechaEntrada ||
      !reservaActual.fechaSalida
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const cleanBody = {
      reservaId: reservaActual.reservaId ?? 0,
      clienteId: Number(reservaActual.clienteId),
      servicioId: Number(reservaActual.servicioId),
      habitacion: reservaActual.habitacion,
      fechaEntrada: reservaActual.fechaEntrada,
      fechaSalida: reservaActual.fechaSalida,
      cantidadPersonas: Number(reservaActual.cantidadPersonas),
      estado: reservaActual.estado,
      descripcion: reservaActual.descripcion ?? ""
    };

    setLoading(true);
    try {
      if (modo === 'crear') {
        await api.post('/Reservas', cleanBody);
      } else {
        await api.put(`/Reservas/${cleanBody.reservaId}`, cleanBody);
      }

      setModalVisible(false);
      cargarReservas();
      resetForm();
    } catch (error) {
      console.error('Error al guardar reserva:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // CAMBIAR ESTADO
  // ---------------------------------------------------------
  const cambiarEstado = async (reserva) => {
    const nuevoEstado =
      reserva.estado === 'Pendiente'
        ? 'Confirmada'
        : reserva.estado === 'Confirmada'
        ? 'Cancelada'
        : 'Pendiente';

    try {
      await api.patch(
        `/Reservas/${reserva.reservaId}/estado?estado=${nuevoEstado}`
      );
      cargarReservas();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  // ---------------------------------------------------------
  // ELIMINAR RESERVA
  // ---------------------------------------------------------
  const eliminarReserva = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta reserva?')) {
      try {
        await api.delete(`/Reservas/${id}`);
        cargarReservas();
      } catch (error) {
        console.error('Error al eliminar reserva:', error);
      }
    }
  };

  // ---------------------------------------------------------
  // RESET FORM
  // ---------------------------------------------------------
  const resetForm = () => {
    setReservaActual({
      clienteId: '',
      servicioId: '',
      habitacion: '',
      fechaEntrada: '',
      fechaSalida: '',
      cantidadPersonas: 1,
      estado: 'Pendiente',
      descripcion: ''
    });
  };

  // ---------------------------------------------------------
  // ABRIR MODAL (LIMPIANDO OBJETOS NAVEGACIONALES)
  // ---------------------------------------------------------
  const abrirModal = (reserva = null) => {
    if (reserva) {
      setReservaActual({
        reservaId: reserva.reservaId,
        clienteId: reserva.clienteId,
        servicioId: reserva.servicioId,
        habitacion: reserva.habitacion,
        fechaEntrada: reserva.fechaEntrada.substring(0, 10),
        fechaSalida: reserva.fechaSalida.substring(0, 10),
        cantidadPersonas: reserva.cantidadPersonas,
        estado: reserva.estado,
        descripcion: reserva.descripcion ?? ""
      });
      setModo('editar');
    } else {
      resetForm();
      setModo('crear');
    }
    setModalVisible(true);
  };

  // ---------------------------------------------------------
  // UTILS
  // ---------------------------------------------------------
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Confirmada':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Cancelada':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    }
  };

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-CO');

  useEffect(() => {
    cargarReservas();
  }, []);

  return (
    <Layout title="Gestión de Reservas">
      <div className="min-h-screen bg-hotel-navy p-6">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-hotel-gold mb-6">
            Gestión de Reservas — Hotel SGS
          </h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Buscar por ID de cliente..."
                value={clienteBusqueda}
                onChange={(e) => setClienteBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarPorCliente()}
                className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white placeholder-white/60 focus:border-hotel-gold focus:outline-none"
              />
            </div>

            <button
              onClick={buscarPorCliente}
              className="px-4 py-2 bg-hotel-gold text-hotel-navy font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Buscar
            </button>

            <button
              onClick={() => abrirModal()}
              className="px-6 py-2 bg-hotel-gold text-hotel-navy font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Agregar Reserva
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white/5 rounded-xl border border-hotel-gold/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-hotel-gold/20">
                <tr>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Cliente</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Servicio</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Habitación</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Entrada</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Salida</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Personas</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-hotel-gold font-semibold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-white">
                      Cargando...
                    </td>
                  </tr>
                ) : reservas.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-white/60">
                      No se encontraron reservas
                    </td>
                  </tr>
                ) : (
                  reservas.map((reserva) => (
                    <tr key={reserva.reservaId} className="border-b border-hotel-gold/10 hover:bg-white/5">
                      <td className="px-6 py-4 text-hotel-gold font-semibold">{reserva.reservaId}</td>
                      <td className="px-6 py-4 text-white">{reserva.clienteId}</td>
                      <td className="px-6 py-4 text-white">{reserva.servicioId}</td>
                      <td className="px-6 py-4 text-white font-medium">{reserva.habitacion}</td>
                      <td className="px-6 py-4 text-white">{formatearFecha(reserva.fechaEntrada)}</td>
                      <td className="px-6 py-4 text-white">{formatearFecha(reserva.fechaSalida)}</td>
                      <td className="px-6 py-4 text-white">{reserva.cantidadPersonas}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            reserva.estado
                          )}`}
                        >
                          {reserva.estado}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex space-x-2">

                          <button
                            onClick={() => abrirModal(reserva)}
                            className="p-2 text-hotel-gold hover:bg-hotel-gold/10 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </button>

                          <button
                            onClick={() => cambiarEstado(reserva)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              reserva.estado === 'Confirmada' 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : reserva.estado === 'Cancelada'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-yellow-500 text-white hover:bg-yellow-600'
                            }`}
                          >
                            Cambiar Estado
                          </button>

                          <button
                            onClick={() => eliminarReserva(reserva.reservaId)}
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

        {/* MODAL */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-hotel-gold rounded-xl p-6 w-full max-w-md">

              <h2 className="text-xl font-serif font-semibold text-hotel-gold mb-6">
                {modo === 'crear' ? 'Agregar Reserva' : 'Editar Reserva'}
              </h2>

              <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Cliente ID *</label>
                    <input
                      type="number"
                      value={reservaActual.clienteId}
                      onChange={(e) =>
                        setReservaActual({ ...reservaActual, clienteId: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Servicio ID *</label>
                    <input
                      type="number"
                      value={reservaActual.servicioId}
                      onChange={(e) =>
                        setReservaActual({ ...reservaActual, servicioId: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Habitación *</label>
                  <input
                    type="text"
                    value={reservaActual.habitacion}
                    onChange={(e) =>
                      setReservaActual({ ...reservaActual, habitacion: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Fecha Entrada *</label>
                    <input
                      type="date"
                      value={reservaActual.fechaEntrada}
                      onChange={(e) =>
                        setReservaActual({ ...reservaActual, fechaEntrada: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Fecha Salida *</label>
                    <input
                      type="date"
                      value={reservaActual.fechaSalida}
                      onChange={(e) =>
                        setReservaActual({ ...reservaActual, fechaSalida: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Personas *</label>
                    <input
                      type="number"
                      min="1"
                      value={reservaActual.cantidadPersonas}
                      onChange={(e) =>
                        setReservaActual({
                          ...reservaActual,
                          cantidadPersonas: Number(e.target.value)
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Estado</label>
                    <select
                      value={reservaActual.estado}
                      onChange={(e) =>
                        setReservaActual({ ...reservaActual, estado: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-hotel-gold/30 rounded-lg text-white"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
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
                  onClick={guardarReserva}
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

export default Reservas;
