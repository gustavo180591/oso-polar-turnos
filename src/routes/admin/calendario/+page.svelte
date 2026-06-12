<script lang="ts">
	let { data } = $props();

	const weekDays = $derived(data.weekDays);
	const week = $derived(data.week);
	const selectedStatus = $derived(data.selectedStatus);
	const maxAppointmentsPerDay = $derived(data.maxAppointmentsPerDay);

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

	const statusLabels: Record<string, string> = {
		PENDIENTE: 'Pendiente',
		CONFIRMADO: 'Confirmado',
		FINALIZADO: 'Finalizado',
		CANCELADO: 'Cancelado'
	};

	const statusOptions = [
		{
			value: '',
			label: 'Todos'
		},
		{
			value: 'PENDIENTE',
			label: 'Pendientes'
		},
		{
			value: 'CONFIRMADO',
			label: 'Confirmados'
		},
		{
			value: 'FINALIZADO',
			label: 'Finalizados'
		},
		{
			value: 'CANCELADO',
			label: 'Cancelados'
		}
	];

	function formatDayName(date: string | Date) {
		return new Date(date).toLocaleDateString('es-AR', {
			weekday: 'long',
			timeZone: 'UTC'
		});
	}

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			timeZone: 'UTC'
		});
	}

	function formatShortDate(date: string | Date) {
		return new Date(date).toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			timeZone: 'UTC'
		});
	}

	function getStatusClass(status: string) {
		if (status === 'PENDIENTE') {
			return 'border-amber-200 bg-amber-50 text-amber-800';
		}

		if (status === 'CONFIRMADO') {
			return 'border-sky-200 bg-sky-50 text-sky-800';
		}

		if (status === 'FINALIZADO') {
			return 'border-green-200 bg-green-50 text-green-800';
		}

		if (status === 'CANCELADO') {
			return 'border-red-200 bg-red-50 text-red-800';
		}

		return 'border-slate-200 bg-slate-50 text-slate-700';
	}

	function getStatusBadgeClass(status: string) {
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

	function getCalendarUrl(weekValue: string, statusValue = selectedStatus) {
		const weekParam = `week=${encodeURIComponent(weekValue)}`;
		const statusParam = statusValue ? `&status=${encodeURIComponent(statusValue)}` : '';

		return `/admin/calendario?${weekParam}${statusParam}`;
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
	<title>Calendario de turnos | Oso Polar Refrigeración</title>
</svelte:head>

<section>
	<div class="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
		<div>
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Panel administrador
			</p>

			<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
				Calendario de turnos
			</h2>

			<p class="mt-2 max-w-2xl text-slate-600">
				Vista semanal de lunes a sábado. Cada día permite hasta {maxAppointmentsPerDay}
				turnos activos.
			</p>
		</div>

		<a
			href="/admin/turnos/nuevo"
			class="w-full rounded-full bg-sky-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 sm:w-fit"
		>
			Nuevo turno
		</a>
	</div>

	<div class="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
			<div>
				<p class="text-sm font-bold text-slate-500">
					Semana seleccionada
				</p>

				<h3 class="mt-1 text-xl font-black text-slate-950">
					{formatDate(week.start)} al {formatDate(week.end)}
				</h3>
			</div>

			<div class="grid gap-3 sm:grid-cols-3 xl:flex xl:items-center">
				<a
					href={getCalendarUrl(week.previousWeek)}
					class="w-full rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
				>
					← Semana anterior
				</a>

				<a
					href={getCalendarUrl(week.currentWeek)}
					class="w-full rounded-full bg-slate-900 px-5 py-3 text-center text-sm font-bold text-white hover:bg-slate-800"
				>
					Hoy
				</a>

				<a
					href={getCalendarUrl(week.nextWeek)}
					class="w-full rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
				>
					Semana siguiente →
				</a>
			</div>
		</div>

		<div class="mt-5 border-t border-slate-100 pt-5">
			<p class="mb-3 text-sm font-bold text-slate-700">
				Filtrar por estado
			</p>

			<div class="flex flex-wrap gap-2">
				{#each statusOptions as option (option.value)}
					<a
						href={getCalendarUrl(week.start.toISOString().slice(0, 10), option.value)}
						class={`rounded-full px-4 py-2 text-sm font-bold ${
							selectedStatus === option.value
								? 'bg-sky-600 text-white'
								: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
						}`}
					>
						{option.label}
					</a>
				{/each}
			</div>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
		{#each weekDays as day (day.dateKey)}
			<article
				class={`rounded-3xl border bg-white shadow-sm ${
					day.isFull ? 'border-red-200' : 'border-slate-200'
				}`}
			>
				<div class="border-b border-slate-100 p-4">
					<div class="flex items-start justify-between gap-3">
						<div>
							<p class="capitalize text-sm font-black text-slate-950">
								{formatDayName(day.date)}
							</p>

							<p class="mt-1 text-sm font-bold text-slate-500">
								{formatShortDate(day.date)}
							</p>
						</div>

						<span
							class={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
								day.isFull ? 'bg-red-100 text-red-800' : 'bg-sky-100 text-sky-800'
							}`}
						>
							{day.totalAppointments}/{maxAppointmentsPerDay}
						</span>
					</div>

					<p
						class={`mt-3 text-xs font-bold ${
							day.isFull ? 'text-red-700' : 'text-slate-500'
						}`}
					>
						{#if day.isFull}
							Día completo
						{:else}
							{day.availableSlots} lugar{day.availableSlots === 1 ? '' : 'es'} disponible{day.availableSlots === 1 ? '' : 's'}
						{/if}
					</p>
				</div>

				<div class="grid gap-3 p-4">
					{#if day.appointments.length === 0}
						<div class="rounded-2xl bg-slate-50 p-4 text-center">
							<p class="text-sm font-bold text-slate-500">
								Sin turnos
							</p>
						</div>
					{:else}
						{#each day.appointments as appointment (appointment.id)}
							<div class={`rounded-2xl border p-4 ${getStatusClass(appointment.status)}`}>
								<div class="flex items-start justify-between gap-3">
									<div class="min-w-0">
										<p class="text-lg font-black">
											{appointment.time}
										</p>

										<p class="mt-1 wrap-break-word font-black text-slate-950">
											{appointment.client.fullName}
										</p>
									</div>

									<span
										class={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${getStatusBadgeClass(
											appointment.status
										)}`}
									>
										{statusLabels[appointment.status] ?? appointment.status}
									</span>
								</div>

								<div class="mt-3 space-y-1 text-sm text-slate-700">
									<p>
										<strong>Equipo:</strong>
										{equipmentLabels[appointment.equipmentType] ??
											appointment.equipmentType}
									</p>

									<p>
										<strong>Motivo:</strong>
										{reasonLabels[appointment.visitReason] ??
											appointment.visitReason}
									</p>

									<p class="wrap-break-word">
										<strong>Zona:</strong>
										{appointment.neighborhood ?? appointment.address}
									</p>

									{#if appointment.attachments.length > 0}
										<p>
											<strong>Adjuntos:</strong>
											{appointment.attachments.length}
										</p>
									{/if}
								</div>

								<div class="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
									<a
										href={`/admin/turnos/${appointment.id}`}
										class="rounded-full bg-slate-900 px-4 py-2 text-center text-xs font-bold text-white hover:bg-slate-800"
									>
										Ver detalle
									</a>

									<a
										href={getWhatsAppUrl(appointment.client.phone)}
										target="_blank"
										rel="noreferrer"
										class="rounded-full bg-green-600 px-4 py-2 text-center text-xs font-bold text-white hover:bg-green-700"
									>
										WhatsApp
									</a>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</article>
		{/each}
	</div>

	{#if data.appointments.length === 0}
		<div class="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
			<p class="text-lg font-black text-slate-950">
				No hay turnos para esta semana
			</p>

			<p class="mt-2 text-slate-500">
				Podés cambiar de semana, limpiar filtros o crear un nuevo turno.
			</p>
		</div>
	{/if}
</section>