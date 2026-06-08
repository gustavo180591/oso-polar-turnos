export type AppointmentStatus = 'PENDIENTE' | 'CONFIRMADO' | 'FINALIZADO' | 'CANCELADO';

export type EquipmentType = 'AIRE_ACONDICIONADO' | 'HELADERA' | 'FREEZER' | 'OTRO';

export type VisitReason = 'LIMPIEZA' | 'MANTENIMIENTO' | 'REPARACION' | 'OTRO';

export type PaymentMethod =
  | 'EFECTIVO'
  | 'TRANSFERENCIA'
  | 'MERCADO_PAGO'
  | 'TARJETA'
  | 'OTRO';

export interface Client {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  neighborhood?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  phone: string;
  address: string;
  neighborhood?: string;
  equipmentType: EquipmentType;
  visitReason: VisitReason;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  status: AppointmentStatus;
  attachmentUrl?: string;
  paymentMethod?: PaymentMethod;
  finalPrice?: number;
  notes?: string;
  createdAt: string;
}