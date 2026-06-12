<script lang="ts">
let { data } = $props();

const clients = $derived(data.clients);
const search = $derived(data.search);

const equipmentLabels: Record<string, string> = {
AIRE_ACONDICIONADO: 'Aire acondicionado',
HELADERA: 'Heladera',
FREEZER: 'Freezer',
OTRO: 'Otro equipo'
};

const reasonLabels: Record<string, string> = {
LIMPIEZA: 'Limpieza',
MANTENIMIENTO: 'Mantenimiento',
REPARACION: 'Reparación',
OTRO: 'Otro'
};

const statusLabels: Record<string, string> = {
PENDIENTE: 'Pendiente',
CONFIRMADO: 'Confirmado',
FINALIZADO: 'Finalizado',
CANCELADO: 'Cancelado'
};

function formatDate(date: string | Date | null | undefined) {
if (!date) {
return 'Sin fecha';
}

return new Date(date).toLocaleDateString('es-AR', {
day: '2-digit',
month: '2-digit',
year: 'numeric',
timeZone: 'UTC'
});
}

function getStatusClass(status: string) {
if (status === 'PENDIENTE') {
return 'bg-amber-100 text-amber-800';
}

if (status === 'CONFIRMADO') {
return 'bg-sky-100 text-sky-800';
}

if (status === 'FINALIZADO') {
return 'bg-green-100 text-green-800';
}

if (status === 'CANCELADO') {
return 'bg-red-100 text-red-800';
}

return 'bg-slate-100 text-slate-700';
}

function getWhatsAppPhone(phone: string) {
let cleanedPhone = phone.replace(/\D/g, '');

if (cleanedPhone.startsWith('00')) {
cleanedPhone = cleanedPhone.slice(2);
}

if (cleanedPhone.startsWith('549')) {
return cleanedPhone;
}

if (cleanedPhone.startsWith('54')) {
const withoutCountryCode = cleanedPhone.slice(2);

if (withoutCountryCode.startsWith('9')) {
return cleanedPhone;
}

return `549${withoutCountryCode}`;
}

if (cleanedPhone.startsWith('0')) {
cleanedPhone = cleanedPhone.slice(1);
}

if (cleanedPhone.startsWith('15')) {
cleanedPhone = cleanedPhone.slice(2);
}

return `549${cleanedPhone}`;
}

function getWhatsAppUrl(phone: string) {
return `https://wa.me/${getWhatsAppPhone(phone)}`;
}
</script>

<svelte:head>
<title>Clientes | Oso Polar Refrigeración</title>
</svelte:head>

<section>
<div class="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
<div>
<p class="text-sm font-black uppercase tracking-wide text-sky-700">
Panel administrador
</p>

<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
Clientes
</h2>

<p class="mt-2 max-w-2xl text-slate-600">
Listado de clientes registrados, cantidad de turnos e historial reciente.
</p>
</div>

<a
href="/admin/turnos/nuevo"
class="w-full rounded-full bg-sky-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 sm:w-fit"
>
Nuevo turno
</a>
</div>

<form method="GET" class="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
<div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
<div>
<label for="search" class="text-sm font-bold text-slate-700">
Buscar cliente
</label>

<input
id="search"
name="search"
type="search"
value={search}
placeholder="Nombre, teléfono, dirección o barrio..."
class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
/>
</div>

<button
type="submit"
class="rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
>
Buscar
</button>
</div>

{#if search}
<div class="mt-4">
<a href="/admin/clientes" class="text-sm font-bold text-sky-700 hover:text-sky-800">
Limpiar búsqueda
</a>
</div>
{/if}
</form>

<div class="mb-5 grid gap-4 sm:grid-cols-3">
<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
<p class="text-sm font-bold text-slate-500">
Clientes encontrados
</p>

<p class="mt-2 text-3xl font-black text-slate-950">
{clients.length}
</p>
</article>

<article class="rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
<p class="text-sm font-bold text-sky-700">
Turnos registrados
</p>

<p class="mt-2 text-3xl font-black text-sky-950">
{clients.reduce((total, client) => total + client._count.appointments, 0)}
</p>
</article>

<article class="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
<p class="text-sm font-bold text-green-700">
Equipos registrados
</p>

<p class="mt-2 text-3xl font-black text-green-950">
{clients.reduce((total, client) => total + client._count.equipments, 0)}
</p>
</article>
</div>

{#if clients.length === 0}
<div class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
<p class="text-lg font-black text-slate-950">
No se encontraron clientes
</p>

<p class="mt-2 text-slate-500">
Probá con otra búsqueda o cargá un nuevo turno.
</p>
</div>
{:else}
<div class="grid gap-4 lg:hidden">
{#each clients as client (client.id)}
{@const lastAppointment = client.appointments[0]}

<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
<div class="flex items-start justify-between gap-3">
<div class="min-w-0">
<p class="wrap-break-word text-lg font-black text-slate-950">
{client.fullName}
</p>

<p class="mt-1 text-sm font-semibold text-slate-500">
{client.phone}
</p>
</div>

<span class="shrink-0 rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">
{client._count.appointments} turno{client._count.appointments === 1 ? '' : 's'}
</span>
</div>

<div class="mt-5 grid gap-3">
<div class="rounded-2xl bg-slate-50 p-4">
<p class="text-sm font-bold text-slate-500">
Dirección
</p>

<p class="mt-1 wrap-break-word font-semibold text-slate-950">
{client.address}
</p>

{#if client.neighborhood}
<p class="mt-1 text-sm text-slate-500">
{client.neighborhood}
</p>
{/if}
</div>

<div class="grid gap-3 sm:grid-cols-2">
<div class="rounded-2xl bg-slate-50 p-4">
<p class="text-sm font-bold text-slate-500">
Equipos
</p>

<p class="mt-1 text-lg font-black text-slate-950">
{client._count.equipments}
</p>
</div>

<div class="rounded-2xl bg-slate-50 p-4">
<p class="text-sm font-bold text-slate-500">
Último turno
</p>

{#if lastAppointment}
<p class="mt-1 font-black text-slate-950">
{formatDate(lastAppointment.date)}
</p>

<p class="mt-1 text-sm text-slate-500">
{lastAppointment.time}
</p>
{:else}
<p class="mt-1 text-sm font-semibold text-slate-400">
Sin turnos
</p>
{/if}
</div>
</div>

{#if lastAppointment}
<div class="rounded-2xl bg-slate-50 p-4">
<div class="flex flex-wrap items-center gap-2">
<span class={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(lastAppointment.status)}`}>
{statusLabels[lastAppointment.status] ?? lastAppointment.status}
</span>

<span class="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
{equipmentLabels[lastAppointment.equipmentType] ??
lastAppointment.equipmentType}
</span>

<span class="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
{reasonLabels[lastAppointment.visitReason] ??
lastAppointment.visitReason}
</span>
</div>
</div>
{/if}
</div>

<div class="mt-5 grid gap-2 sm:grid-cols-2">
<a
href={`/admin/clientes/${client.id}`}
class="rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-800"
>
Ver historial
</a>

<a
href={getWhatsAppUrl(client.phone)}
target="_blank"
rel="noreferrer"
class="rounded-full bg-green-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-green-700"
>
WhatsApp
</a>
</div>
</article>
{/each}
</div>

<div class="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
<div class="overflow-x-auto">
<table class="min-w-[1000px] divide-y divide-slate-200">
<thead class="bg-slate-50">
<tr>
<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
Cliente
</th>

<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
Contacto
</th>

<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
Dirección
</th>

<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
Turnos
</th>

<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
Último turno
</th>

<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
Acciones
</th>
</tr>
</thead>

<tbody class="divide-y divide-slate-100">
{#each clients as client (client.id)}
{@const lastAppointment = client.appointments[0]}

<tr class="hover:bg-slate-50">
<td class="px-5 py-4">
<p class="max-w-xs wrap-break-word font-bold text-slate-950">
{client.fullName}
</p>

<p class="mt-1 text-sm text-slate-500">
Registrado: {formatDate(client.createdAt)}
</p>
</td>

<td class="px-5 py-4 text-sm text-slate-700">
<p class="font-semibold">
{client.phone}
</p>

<a
href={getWhatsAppUrl(client.phone)}
target="_blank"
rel="noreferrer"
class="mt-1 inline-flex font-bold text-green-700 hover:text-green-800"
>
WhatsApp
</a>
</td>

<td class="px-5 py-4 text-sm text-slate-700">
<p class="max-w-xs wrap-break-word">
{client.address}
</p>

{#if client.neighborhood}
<p class="text-slate-500">
{client.neighborhood}
</p>
{/if}
</td>

<td class="px-5 py-4 text-sm text-slate-700">
<p class="font-black text-slate-950">
{client._count.appointments}
</p>

<p class="text-slate-500">
{client._count.equipments} equipo{client._count.equipments === 1 ? '' : 's'}
</p>
</td>

<td class="px-5 py-4 text-sm text-slate-700">
{#if lastAppointment}
<p class="font-bold text-slate-950">
{formatDate(lastAppointment.date)}
</p>

<p class="text-slate-500">
{lastAppointment.time}
</p>

<div class="mt-2 flex flex-wrap gap-1">
<span
class={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
lastAppointment.status
)}`}
>
{statusLabels[lastAppointment.status] ?? lastAppointment.status}
</span>
</div>
{:else}
<span class="text-slate-400">
Sin turnos
</span>
{/if}
</td>

<td class="px-5 py-4">
<div class="flex min-w-44 flex-wrap gap-2">
<a
href={`/admin/clientes/${client.id}`}
class="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
>
Ver historial
</a>

<a
href="/admin/turnos/nuevo"
class="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
>
Nuevo turno
</a>
</div>
</td>
</tr>
{/each}
</tbody>
</table>
</div>
</div>
{/if}
</section>
