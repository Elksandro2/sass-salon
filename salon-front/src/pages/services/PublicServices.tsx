import { useState, useEffect } from 'react';
import { salonServicesApi, displayServiceDuration } from './services/services';
import type { SalonServiceData } from './services/services';
import { useAlert } from '../../hooks/useAlert';
import { getApiErrorMessage } from '../../utils/apiError';
import { Clock } from 'lucide-react';

export const PublicServices = () => {
  const [services, setServices] = useState<SalonServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError } = useAlert();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await salonServicesApi.findAll();
        setServices(data.filter(s => s.active));
      } catch (err) {
        const msg = getApiErrorMessage(err, 'Erro ao carregar serviços');
        await showError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-[#3b3036] tracking-wide">
          Nosso Menu de Serviços
        </h2>
        <p className="text-sm text-[#3b3036]/60">
          Realce sua beleza com a nossa seleção exclusiva de tratamentos.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#be8a83]"></div>
          <span className="text-sm text-[#3b3036]/60 font-medium">Carregando serviços...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1.5 before:bg-gradient-to-r before:from-[#be8a83] before:to-[#e5a49c] before:opacity-0 hover:before:opacity-100 before:transition-opacity"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <h3 className="font-heading font-bold text-lg text-[#3b3036] leading-snug">
                    {service.name}
                  </h3>
                  {service.price != null && (
                    <span className="inline-flex shrink-0 w-fit px-3 py-1 bg-[#be8a83]/10 text-[#be8a83] text-xs font-bold rounded-full">
                      A partir de R$ {service.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#3b3036]/70 leading-relaxed">
                  {service.description || 'Tratamento especial para os seus cuidados.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium border border-gray-100">
                  <Clock size={14} className="text-gray-400" />
                  <span>{displayServiceDuration(service)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
