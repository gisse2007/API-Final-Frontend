import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      )
    },
    { 
      name: 'Clientes', 
      path: '/clientes', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      )
    },
    { 
      name: 'Servicios', 
      path: '/servicios', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
        </svg>
      )
    },
    { 
      name: 'Reservas', 
      path: '/reservas', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="w-64 bg-hotel-navy h-full shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-hotel-gold/20">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-hotel-gold tracking-wider">
            Hotel SGS
          </h1>
          <div className="w-16 h-0.5 bg-hotel-gold mx-auto mt-2"></div>
          <p className="text-hotel-gold/70 text-xs mt-1 font-light tracking-widest">
            MANAGEMENT
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center px-6 py-4 text-left transition-all duration-300 group ${
              location.pathname === item.path
                ? 'bg-hotel-gold/10 border-r-4 border-hotel-gold text-hotel-gold'
                : 'text-white hover:bg-hotel-gold/10 hover:text-hotel-gold'
            }`}
          >
            <span className="mr-4 group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </span>
            <span className="font-medium tracking-wide">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-6 border-t border-hotel-gold/20">
        <div className="text-center">
          <p className="text-hotel-gold/60 text-xs font-light">
            Sistema de Gestión Hotelera
          </p>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-hotel-gold/40 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-hotel-gold/40 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-hotel-gold/40 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;