<script lang="ts">
	let { data } = $props();

	const appointment = $derived(data.appointment);

	const equipmentLabels: Record<string, string> = {
		AIRE_ACONDICIONADO: 'Aire acondicionado',
		HELADERA: 'Heladera',
		FREEZER: 'Freezer',
		OTRO: 'Otro equipo de frío'
	};

	const reasonLabels: Record<string, string> = {
		LIMPIEZA: 'Limpieza',
		MANTENIMIENTO: 'Mantenimiento',
		REPARACION: 'Reparación',
		OTRO: 'Otro'
	};

	const whatsappMessage = $derived(
	encodeURIComponent(
		`Hola, quiero confirmar mi solicitud de turno para Oso Polar Refrigeración.

Nombre: ${appointment.client.fullName}
WhatsApp: ${appointment.client.phone}
Dirección: ${appointment.address}
Barrio/Zona: ${appointment.neighborhood ?? '-'}
Equipo: ${equipmentLabels[appointment.equipmentType]}
Motivo: ${reasonLabels[appointment.visitReason]}
Fecha: ${new Date(appointment.date).toLocaleDateString('es-AR')}
Horario: ${appointment.time}
Problema: ${appointment.problemDescription}`
	)
);
</script>

<svelte:head>
	<title>Turno solicitado | Oso Polar Refrigeración</title>
</svelte:head>

<section class="min-h-screen bg-sky-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-3xl">
		<div class="rounded-3xl bg-white p-6 text-center shadow-xl sm:p-10">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
				✓
			</div>

			<h1 class="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
				Solicitud recibida
			</h1>

			<p class="mx-auto mt-4 max-w-xl text-slate-600">
				Tu turno fue registrado como <strong>pendiente</strong>. Para agilizar la confirmación,
				podés enviar el detalle por WhatsApp.
			</p>

			<div class="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
				<h2 class="font-bold text-slate-950">Resumen del turno</h2>

				<div class="mt-4 grid gap-3 text-sm text-slate-700">
					<p><strong>Cliente:</strong> {appointment.client.fullName}</p>
					<p><strong>WhatsApp:</strong> {appointment.client.phone}</p>
					<p><strong>Equipo:</strong> {equipmentLabels[appointment.equipmentType]}</p>
					<p><strong>Motivo:</strong> {reasonLabels[appointment.visitReason]}</p>
					<p><strong>Fecha:</strong> {new Date(appointment.date).toLocaleDateString('es-AR')}</p>
					<p><strong>Horario:</strong> {appointment.time}</p>
					<p><strong>Estado:</strong> {appointment.status}</p>
				</div>
			</div>

			<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
				<a
					href={`https://wa.me/?text=${whatsappMessage}`}
					target="_blank"
					rel="noreferrer"
					class="rounded-full bg-green-600 px-6 py-3 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700"
				>
					Enviar por WhatsApp
				</a>

				<a
					href="/"
					class="rounded-full border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
				>
					Volver al inicio
				</a>
			</div>
		</div>
	</div>
</section>