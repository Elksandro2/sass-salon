import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../utils/apiError';
import { AlertCircle } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.accessToken, response.data.refreshToken, true);
      
      const pending = localStorage.getItem('pending_appointment');
      navigate(pending ? '/appointment' : '/');
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Erro ao realizar login. Tente novamente.');
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-[#fcf9f9] to-[#f7ebeb] px-4 py-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden w-full max-w-4xl flex">
        {/* Left Side: Image (large screens only) */}
        <div className="hidden lg:block lg:w-1/2 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop')] bg-center bg-cover"></div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 px-6 py-12 sm:px-12 flex flex-col justify-center max-w-md mx-auto">
          <h2 className="font-heading text-3xl font-extrabold text-[#3b3036] tracking-tight">
            Bem-vinda de volta
          </h2>
          <p className="text-sm text-[#3b3036]/60 mt-2 mb-8">
            Faça login para gerenciar seus agendamentos.
          </p>

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#3b3036]/70 uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                {...register('email', { required: 'Email é obrigatório' })}
                className={`w-full text-sm px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-[#be8a83]/20 outline-none transition-all ${
                  errors.email ? 'border-rose-300 focus:border-rose-500' : 'border-gray-200 focus:border-[#be8a83]'
                }`}
              />
              {errors.email && (
                <span className="text-xs text-rose-500 font-semibold">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#3b3036]/70 uppercase tracking-wider">
                Senha
              </label>
              <input
                type="password"
                placeholder="Sua senha"
                {...register('password', { required: 'Senha é obrigatória' })}
                className={`w-full text-sm px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-[#be8a83]/20 outline-none transition-all ${
                  errors.password ? 'border-rose-300 focus:border-rose-500' : 'border-gray-200 focus:border-[#be8a83]'
                }`}
              />
              {errors.password && (
                <span className="text-xs text-rose-500 font-semibold">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 bg-[#be8a83] text-white font-semibold text-sm rounded-xl hover:bg-[#a6726b] hover:shadow-lg hover:shadow-[#be8a83]/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? 'Acessando...' : 'Entrar na minha conta'}
            </button>
            
            <div className="text-center pt-4 text-sm">
              <span className="text-gray-500">Não tem uma conta? </span>
              <Link to="/register" className="text-[#be8a83] font-semibold hover:underline">
                Cadastre-se
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
