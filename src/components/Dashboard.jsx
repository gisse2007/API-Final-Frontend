import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [contadores, setContadores] = useState({
    clientes: 0,
    servicios: 0,
    reservas: 0
  });

  const cargarContadores = async () => {
    try {
      const [clientesRes, serviciosRes, reservasRes] = await Promise.all([
        api.get('/Clientes'),
        api.get('/Servicios'),
        api.get('/Reservas')
      ]);
      setContadores({
        clientes: clientesRes.data.length,
        servicios: serviciosRes.data.length,
        reservas: reservasRes.data.length
      });
    } catch (error) {
      console.error('Error al cargar contadores:', error);
    }
  };

  useEffect(() => {
    cargarContadores();
  }, []);

  const menuCards = [
    {
      title: 'Gestión de Clientes',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
      description: 'Administrar información de huéspedes',
      path: '/clientes'
    },
    {
      title: 'Servicios del Hotel',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
        </svg>
      ),
      description: 'Gestionar servicios disponibles',
      path: '/servicios'
    },
    {
      title: 'Reservas',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
      description: 'Control de reservaciones',
      path: '/reservas'
    }
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-hotel-navy mb-4">
            Bienvenido al Panel Hotel SGS
          </h2>
          <div className="w-24 h-1 bg-hotel-gold mx-auto"></div>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="bg-slate-800 border-2 border-hotel-gold/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-hotel-gold hover:shadow-2xl hover:shadow-hotel-gold/20 hover:-translate-y-2 group"
              style={{ backgroundColor: '#10243d' }}
            >
              <div className="text-center">
                <div className="text-hotel-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl font-serif font-semibold text-hotel-gold mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="w-12 h-0.5 bg-hotel-gold/50 group-hover:bg-hotel-gold transition-colors duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-hotel-gold/20">
          <h3 className="text-xl font-serif font-semibold text-hotel-navy mb-4">
            Resumen del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-hotel-gold">{contadores.clientes}</div>
              <div className="text-sm text-gray-600">Clientes Registrados</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-hotel-gold">{contadores.reservas}</div>
              <div className="text-sm text-gray-600">Reservas Realizadas</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-hotel-gold">{contadores.servicios}</div>
              <div className="text-sm text-gray-600">Servicios Registrados</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;