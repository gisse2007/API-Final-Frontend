import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-semibold text-hotel-navy">
          {title}
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-hotel-navy text-white text-sm font-medium rounded-lg hover:bg-hotel-gold transition-colors duration-300"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;