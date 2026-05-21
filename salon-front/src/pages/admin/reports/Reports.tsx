import { useState, useEffect } from 'react';
import { reportsApi } from './services/reports';
import type { FinancialReportResponse, AppointmentReportResponse } from './services/reports';
import { cashFlowApi } from '../cashflow/services/cashflow';
import type { CashFlowData } from '../cashflow/services/cashflow';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';
import { useAlert } from '../../../hooks/useAlert';
import { getApiErrorMessage } from '../../../utils/apiError';

const inputCls = 'text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#be8a83]/20 focus:border-[#be8a83] outline-none transition-all';
const labelCls = 'block text-xs font-semibold text-[#3b3036]/70 uppercase tracking-wider mb-1.5';

export const Reports = () => {
  const [financial, setFinancial] = useState<FinancialReportResponse | null>(null);
  const [appointments, setAppointments] = useState<AppointmentReportResponse | null>(null);
  const [cashFlows, setCashFlows] = useState<CashFlowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { error: showError } = useAlert();

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const [finData, aptData, cfData] = await Promise.all([
        reportsApi.getFinancialReport(dateFrom || undefined, dateTo || undefined),
        reportsApi.getAppointmentReport(dateFrom || undefined, dateTo || undefined),
        cashFlowApi.findByPeriod(dateFrom || undefined, dateTo || undefined)
      ]);
      setFinancial(finData);
      setAppointments(aptData);
      setCashFlows(cfData);
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Erro ao carregar relatórios');
      await showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadReports(); }, [dateFrom, dateTo]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relatório Financeiro e Agendamentos', 14, 22);
    doc.setFontSize(11);
    doc.text(`Período: ${financial?.period || 'N/A'}`, 14, 30);
    doc.setFontSize(14);
    doc.text('Resumo Financeiro', 14, 45);
    autoTable(doc, {
      startY: 50,
      head: [['Receitas', 'Despesas', 'Lucro Líquido']],
      body: [[
        `R$ ${financial?.totalIncome.toFixed(2) || '0.00'}`,
        `R$ ${financial?.totalExpense.toFixed(2) || '0.00'}`,
        `R$ ${financial?.netProfit.toFixed(2) || '0.00'}`
      ]],
    });
    const finalY = (doc as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || 50;
    doc.text('Resumo de Agendamentos', 14, finalY + 15);
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Total', 'Concluídos', 'Pendentes', 'Cancelados']],
      body: [[
        appointments?.totalAppointments || 0,
        appointments?.done || 0,
        appointments?.pending || 0,
        appointments?.cancelled || 0
      ]],
    });
    doc.save('relatorio-salao.pdf');
  };

  const chartDataEmployee = Object.entries(appointments?.byEmployee || {}).map(([name, count]) => ({ name, Agendamentos: count }));
  const chartDataService = Object.entries(appointments?.byService || {}).map(([name, count]) => ({ name, Agendamentos: count }));

  const revenueByDate: Record<string, number> = {};
  cashFlows.forEach(cf => {
    if (cf.type === 'INCOME') {
      const d = cf.date.substring(0, 10);
      revenueByDate[d] = (revenueByDate[d] || 0) + cf.amount;
    }
  });
  const chartDataRevenue = Object.entries(revenueByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({
      Data: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      Receita: amount
    }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading text-2xl font-bold text-[#3b3036]">Dashboard & Relatórios</h2>
        <button
          onClick={generatePDF}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50 disabled:pointer-events-none"
        >
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
        <div className="space-y-1.5">
          <label className={labelCls}>De</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Até</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputCls} />
        </div>
        <button
          onClick={() => { setDateFrom(''); setDateTo(''); }}
          className="px-4 py-2.5 border border-gray-200 text-sm font-semibold text-[#3b3036]/80 hover:bg-gray-50 rounded-xl transition-all"
        >
          Mês Atual (Padrão)
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#be8a83]"></div>
          <p className="text-sm text-[#3b3036]/60 font-medium">Gerando relatórios...</p>
        </div>
      ) : (
        <>
          {/* Financial Summary */}
          <div>
            <h4 className="font-heading font-bold text-lg text-[#3b3036] mb-4">
              Resumo Financeiro <span className="text-sm font-normal text-gray-400">({financial?.period})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border-l-4 border-emerald-500 border border-gray-100 p-5 shadow-xs">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Receitas</p>
                <p className="text-3xl font-extrabold text-emerald-600">R$ {financial?.totalIncome.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-2xl border-l-4 border-rose-500 border border-gray-100 p-5 shadow-xs">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Despesas</p>
                <p className="text-3xl font-extrabold text-rose-600">R$ {financial?.totalExpense.toFixed(2)}</p>
              </div>
              <div className={`bg-white rounded-2xl border-l-4 ${financial?.netProfit! >= 0 ? 'border-[#be8a83]' : 'border-rose-500'} border border-gray-100 p-5 shadow-xs`}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lucro Líquido</p>
                <p className={`text-3xl font-extrabold ${financial?.netProfit! >= 0 ? 'text-[#be8a83]' : 'text-rose-600'}`}>
                  R$ {financial?.netProfit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div>
            <h4 className="font-heading font-bold text-lg text-[#3b3036] mb-4">Evolução de Receitas</h4>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
              <div style={{ height: 300, width: '100%' }}>
                {chartDataRevenue.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={chartDataRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="Data" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(val: any) => `R$ ${Number(val).toFixed(2)}`} />
                      <Legend />
                      <Line type="monotone" dataKey="Receita" stroke="#be8a83" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">
                    Nenhuma receita no período selecionado.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appointment Stats */}
          <div>
            <h4 className="font-heading font-bold text-lg text-[#3b3036] mb-4">
              Desempenho de Agendamentos <span className="text-sm font-normal text-gray-400">({appointments?.period})</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total', value: appointments?.totalAppointments, color: 'text-indigo-600' },
                { label: 'Concluídos', value: appointments?.done, color: 'text-emerald-600' },
                { label: 'Pendentes', value: appointments?.pending, color: 'text-amber-600' },
                { label: 'Cancelados', value: appointments?.cancelled, color: 'text-rose-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-xs">
                  <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-50">
                  <span className="font-semibold text-sm text-[#3b3036]">Por Profissional</span>
                </div>
                <div className="p-4" style={{ height: 300 }}>
                  {chartDataEmployee.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={chartDataEmployee}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="Agendamentos" fill="#be8a83" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">Nenhum dado</div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-50">
                  <span className="font-semibold text-sm text-[#3b3036]">Por Serviço</span>
                </div>
                <div className="p-4" style={{ height: 300 }}>
                  {chartDataService.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={chartDataService} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="Agendamentos" fill="#3b3036" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">Nenhum dado</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
