import type { Appointment } from '$lib/types';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Juan Pérez',
    phone: '3764 123456',
    address: 'Av. Corrientes 1234',
    neighborhood: 'Centro',
    equipmentType: 'AIRE_ACONDICIONADO',
    visitReason: 'MANTENIMIENTO',
    problemDescription: 'El aire enfría poco y hace ruido al encender.',
    preferredDate: '2026-06-10',
    preferredTime: '08:30',
    status: 'PENDIENTE',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'María Gómez',
    phone: '3764 654321',
    address: 'San Martín 850',
    neighborhood: 'Villa Sarita',
    equipmentType: 'HELADERA',
    visitReason: 'REPARACION',
    problemDescription: 'La heladera no enfría bien.',
    preferredDate: '2026-06-10',
    preferredTime: '15:00',
    status: 'CONFIRMADO',
    createdAt: new Date().toISOString()
  }
];