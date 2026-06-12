<script lang="ts">
	let { data } = $props();

	const stats = $derived(data.stats);
	const todayAppointments = $derived(data.todayAppointments);
	const upcomingAppointments = $derived(data.upcomingAppointments);
	const recentAppointments = $derived(data.recentAppointments);

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

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			timeZone: 'UTC'
		});
	}

	function formatMoney(value: number | null | undefined) {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			maximumFractionDigits: 0
		}).format(value ?? 0);
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
</script>

<svelte:head>
	<title>Dashboard | Oso Polar Refrigeración</title>
</svelte:head>

<section>
	<div class="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
		<div>
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Panel técnico
			</p>

			<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
				Dashboard
			</h2>

			<p class="mt-2 max-w-2xl text-slate-600">
				Resumen general de turnos, clientes, cobros y actividad reciente de Oso Polar
				Refrigeración.
			</p>
		</div>

		<div class="grid gap-3 sm:grid-cols-2">
			<a
				href="/admin/turnos/nuevo"
				class="rounded-full bg-sky-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
			>
				Nuevo turno
			</a>

			<a
				href="/admin/calendario"
				class="rounded-full border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
			>
				Ver calendario
			</a>
		</div>
	</div>

	<div class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<p class="text-sm font-bold text-slate-500">
				Turnos de hoy
			</p>

			<p class="mt-3 text-4xl font-black text-slate-950">
				{stats.todayAppointmentsCount}
			</p>

			<p class="mt-2 text-sm font-semibold text-slate-500">
				Agenda del día actual
			</p>
		</article>

		<article class="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
			<p class="text-sm font-bold text-amber-700">
				Pendientes
			</p>

			<p class="mt-3 text-4xl font-black text-amber-900">
				{stats.pendingAppointmentsCount}
			</p>

			<p class="mt-2 text-sm font-semibold text-amber-700">
				Esperan confirmación
			</p>
		</article>

		<article class="rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
			<p class="text-sm font-bold text-sky-700">
				Confirmados
			</p>

			<p class="mt-3 text-4xl font-black text-sky-950">
				{stats.confirmedAppointmentsCount}
			</p>

			<p class="mt-2 text-sm font-semibold text-sky-700">
				Listos para visitar
			</p>
		</article>

		<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<p class="text-sm font-bold text-slate-500">
				Clientes
			</p>

			<p class="mt-3 text-4xl font-black text-slate-950">
				{stats.totalClientsCount}
			</p>

			<p class="mt-2 text-sm font-semibold text-slate-500">
				Registrados en el sistema
			</p>
		</article>
	</div>

	<div class="mb-8 grid gap-4 lg:grid-cols-4">
		<article class="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm lg:col-span-1">
			<p class="text-sm font-bold text-green-700">
				Ingresos del mes
			</p>

			<p class="mt-3 text-3xl font-black text-green-950">
				{formatMoney(stats.monthIncome)}
			</p>

			<p class="mt-2 text-sm font-semibold text-green-700">
				Trabajos marcados como pagados
			</p>
		</article>

		<article class="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm lg:col-span-1">
			<p class="text-sm font-bold text-red-700">
				Pendiente de cobro
			</p>

			<p class="mt-3 text-3xl font-black text-red-950">
				{formatMoney(stats.monthDebt)}
			</p>

			<p class="mt-2 text-sm font-semibold text-red-700">
				Trabajos con precio final sin pagar
			</p>
		</article>

		<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
			<p class="text-sm font-bold text-slate-500">
				Finalizados del mes
			</p>

			<p class="mt-3 text-3xl font-black text-slate-950">
				{stats.finalizedThisMonthCount}
			</p>

			<p class="mt-2 text-sm font-semibold text-slate-500">
				Trabajos completados
			</p>
		</article>

		<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
			<p class="text-sm font-bold text-slate-500">
				Servicios activos
			</p>

			<p class="mt-3 text-3xl font-black text-slate-950">
				{stats.activeServicesCount}
			</p>

			<p class="mt-2 text-sm font-semibold text-slate-500">
				Disponibles para el negocio
			</p>
		</article>
	</div>

	<div class="grid gap-6 xl:grid-cols-3">
		<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
			<div class="mb-5 flex items-center justify-between gap-4">
				<div>
					<h3 class="text-xl font-black text-slate-950">
						Turnos de hoy
					</h3>

					<p class="mt-1 text-sm text-slate-500">
						Agenda rápida del día.
					</p>
				</div>

				<a
					href="/admin/calendario"
					class="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
				>
					Calendario
				</a>
			</div>

			{#if todayAppointments.length === 0}
				<div class="rounded-3xl bg-slate-50 p-8 text-center">
					<p class="text-lg font-black text-slate-950">
						No hay turnos para hoy
					</p>

					<p class="mt-2 text-slate-500">
						La agenda de hoy está libre.
					</p>
				</div>
			{:else}
				<div class="grid gap-3">
					{#each todayAppointments as appointment (appointment.id)}
						<a
							href={`/admin/turnos/${appointment.id}`}
							class="rounded-3xl border border-slate-200 p-4 hover:bg-slate-50"
						>
							<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div class="min-w-0">
									<p class="text-lg font-black text-slate-950">
										{appointment.time} · {appointment.client.fullName}
									</p>

									<p class="mt-1 wrap-break-word text-sm font-semibold text-slate-600">
										{equipmentLabels[appointment.equipmentType]} ·
										{reasonLabels[appointment.visitReason]}
									</p>

									<p class="mt-1 wrap-break-word text-sm text-slate-500">
										{appointment.neighborhood ?? appointment.address}
									</p>
								</div>

								<span
									class={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
										appointment.status
									)}`}
								>
									{statusLabels[appointment.status]}
								</span>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</section>

		<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<div class="mb-5">
				<h3 class="text-xl font-black text-slate-950">
					Próximos turnos
				</h3>

				<p class="mt-1 text-sm text-slate-500">
					Pendientes o confirmados.
				</p>
			</div>

			{#if upcomingAppointments.length === 0}
				<div class="rounded-3xl bg-slate-50 p-6 text-center">
					<p class="font-bold text-slate-500">
						No hay próximos turnos
					</p>
				</div>
			{:else}
				<div class="grid gap-3">
					{#each upcomingAppointments as appointment (appointment.id)}
						<a
							href={`/admin/turnos/${appointment.id}`}
							class="rounded-2xl bg-slate-50 p-4 hover:bg-slate-100"
						>
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<p class="font-black text-slate-950">
										{formatDate(appointment.date)} · {appointment.time}
									</p>

									<p class="mt-1 wrap-break-word text-sm font-semibold text-slate-600">
										{appointment.client.fullName}
									</p>
								</div>

								<span
									class={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
										appointment.status
									)}`}
								>
									{statusLabels[appointment.status]}
								</span>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</section>
	</div>

	<section class="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
		<div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h3 class="text-xl font-black text-slate-950">
					Últimos turnos cargados
				</h3>

				<p class="mt-1 text-sm text-slate-500">
					Actividad reciente del sistema.
				</p>
			</div>

			<a
				href="/admin/turnos"
				class="w-full rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-bold text-slate-700 hover:bg-slate-50 sm:w-fit"
			>
				Ver todos
			</a>
		</div>

		{#if recentAppointments.length === 0}
			<div class="rounded-3xl bg-slate-50 p-8 text-center">
				<p class="font-bold text-slate-500">
					Todavía no hay turnos cargados.
				</p>
			</div>
		{:else}
			<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
				{#each recentAppointments as appointment (appointment.id)}
					<a
						href={`/admin/turnos/${appointment.id}`}
						class="rounded-3xl border border-slate-200 p-4 hover:bg-slate-50"
					>
						<p class="font-black text-slate-950">
							{appointment.client.fullName}
						</p>

						<p class="mt-1 text-sm font-semibold text-slate-500">
							{formatDate(appointment.date)} · {appointment.time}
						</p>

						<p class="mt-2 text-sm text-slate-600">
							{equipmentLabels[appointment.equipmentType]}
						</p>

						<span
							class={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
								appointment.status
							)}`}
						>
							{statusLabels[appointment.status]}
						</span>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</section>