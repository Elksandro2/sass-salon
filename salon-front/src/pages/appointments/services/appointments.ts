import api from '../../../services/api';

export interface AppointmentRequestBody {
  employeeId: number;
  serviceId: number;
  /** Fluxo admin: horário já definido */
  scheduledAt?: string | null;
  /** Fluxo cliente: dia preferido */
  preferredDate?: string | null;
  clientNotes?: string | null;
  clientId?: number;
}

export interface AppointmentResponse {
  id: number;
  clientId: number;
  clientName: string;
  employeeId: number;
  employeeName: string;
  serviceId: number;
  serviceName: string;
  scheduledAt: string | null;
  preferredDate?: string | null;
  clientNotes?: string | null;
  status: string;
}

function buildCreatePayload(request: AppointmentRequestBody): Record<string, unknown> {
  const body: Record<string, unknown> = {
    employeeId: Number(request.employeeId),
    serviceId: Number(request.serviceId)
  };
  if (!Number.isFinite(body.employeeId as number) || !Number.isFinite(body.serviceId as number)) {
    throw new Error('IDs inválidos');
  }
  if (request.scheduledAt != null && String(request.scheduledAt).trim() !== '') {
    body.scheduledAt = request.scheduledAt;
  }
  if (request.clientId != null) {
    body.clientId = request.clientId;
  }
  if (request.preferredDate != null && String(request.preferredDate).trim() !== '') {
    body.preferredDate = request.preferredDate;
  }
  if (request.clientNotes != null && request.clientNotes.trim() !== '') {
    body.clientNotes = request.clientNotes.trim();
  }
  return body;
}

export const appointmentsApi = {
  create: async (request: AppointmentRequestBody) => {
    const { data } = await api.post<AppointmentResponse>('/appointments', buildCreatePayload(request));
    return data;
  },

  confirm: async (id: number, scheduledAtIso: string) => {
    const { data } = await api.patch<AppointmentResponse>(`/appointments/${id}/confirm`, {
      scheduledAt: scheduledAtIso
    });
    return data;
  },

  decline: async (id: number) => {
    const { data } = await api.patch<AppointmentResponse>(`/appointments/${id}/decline`);
    return data;
  },

  getMyAppointments: async () => {
    const { data } = await api.get<AppointmentResponse[]>('/appointments/my');
    return data;
  },

  findAll: async () => {
    const { data } = await api.get<AppointmentResponse[]>('/appointments');
    return data;
  },

  cancel: async (id: number) => {
    const { data } = await api.patch<AppointmentResponse>(`/appointments/${id}/cancel`);
    return data;
  },

  updateStatus: async (id: number, status: string) => {
    const { data } = await api.patch<AppointmentResponse>(`/appointments/${id}/status`, null, {
      params: { status }
    });
    return data;
  }
};
