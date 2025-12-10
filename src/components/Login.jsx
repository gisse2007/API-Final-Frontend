import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await api.post('/Auth/login', { 
        Email: email, 
        Password: password 
      });

      console.log("Respuesta login:", res.data);

      const token = res.data?.token || res.data?.Token;

      if (token) {
        localStorage.setItem('token', token);
      }

      navigate('/dashboard');

    } catch (err) {
      if (err?.response?.status === 401) {
        setErrorMessage('Correo o contraseña incorrectos');
      } else {
        setErrorMessage('Error al iniciar sesión. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hotel-navy via-slate-800 to-hotel-navy relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-hotel-gold opacity-5 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-hotel-gold opacity-5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-hotel-gold opacity-3 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          
          <div className="text-center mb-8 animate-fade-in">
            <div className="relative inline-block">
              <h1 className="text-3xl font-serif font-bold text-hotel-gold mb-2 tracking-wider hover:scale-105 transition-transform duration-300">
                Hotel SGS
              </h1>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-hotel-gold rounded-full animate-ping"></div>
            </div>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-hotel-gold to-transparent mx-auto animate-pulse"></div>
            <p className="text-hotel-gold/70 text-xs mt-2 font-light tracking-widest">PREMIUM MANAGEMENT SYSTEM</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-hotel-gold/20 hover:shadow-3xl transition-all duration-500 hover:border-hotel-gold/40 animate-slide-up">

            <div className="text-center mb-8 animate-fade-in-delay">
              <h2 className="text-2xl font-serif font-semibold text-hotel-navy mb-2 hover:text-hotel-gold transition-colors duration-300">
                Bienvenido
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bienvenido a la administración del Hotel SGS
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="px-4 py-2 rounded-md bg-red-50 border border-red-100 text-red-700 text-sm mb-2">
                  {errorMessage}
                </div>
              )}

              <div className="animate-fade-in-delay-2">
                <label className="block text-sm font-medium text-hotel-navy mb-2 transition-colors duration-300">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-hotel-gold transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white/90 focus:scale-105"
                  placeholder="admin@hotelsgs.com"
                />
              </div>

              <div className="animate-fade-in-delay-3">
                <label className="block text-sm font-medium text-hotel-navy mb-2 transition-colors duration-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-gold focus:border-hotel-gold transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white/90 focus:scale-105"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-hotel-gold to-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-500 shadow-lg transform relative overflow-hidden group ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-yellow-600 hover:to-hotel-gold hover:shadow-2xl hover:-translate-y-1 hover:scale-105'}`}
              >
                <span className="relative z-10">{loading ? 'Ingresando...' : 'Iniciar sesión'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-hotel-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </form>

            <div className="mt-6 text-center animate-fade-in-delay-5">
              <button
                onClick={() => navigate('/register')}
                className="text-hotel-gold hover:text-yellow-600 text-sm font-medium transition-colors duration-300 hover:underline"
              >
                ¿No has creado una cuenta? Regístrate
              </button>
            </div>

            <div className="mt-8 text-center animate-fade-in-delay-6">
              <p className="text-xs text-gray-500 hover:text-hotel-gold transition-colors duration-300">
                Sistema de gestión hotelera • Hotel SGS
              </p>
            </div>
          </div>

          <div className="text-center mt-6 animate-fade-in-delay-7">
            <div className="inline-flex items-center space-x-2 text-hotel-gold/60 hover:text-hotel-gold transition-colors duration-300">
              <div className="w-8 h-px bg-hotel-gold/40 animate-pulse"></div>
              <span className="text-xs font-light tracking-wider">LUXURY • EXCELLENCE • SERVICE</span>
              <div className="w-8 h-px bg-hotel-gold/40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in-delay { animation: fade-in 1s ease-out 0.2s both; }
        .animate-fade-in-delay-2 { animation: fade-in 1s ease-out 0.4s both; }
        .animate-fade-in-delay-3 { animation: fade-in 1s ease-out 0.6s both; }
        .animate-fade-in-delay-4 { animation: fade-in 1s ease-out 0.8s both; }
        .animate-fade-in-delay-5 { animation: fade-in 1s ease-out 1s both; }
        .animate-fade-in-delay-6 { animation: fade-in 1s ease-out 1.2s both; }
        .animate-fade-in-delay-7 { animation: fade-in 1s ease-out 1.4s both; }
      `}</style>
    </div>
  );
};

export default Login;
