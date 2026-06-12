<script lang="ts">
	let { data } = $props();

	const filters = $derived(data.filters);
	const stats = $derived(data.stats);
	const statusReport = $derived(data.statusReport);
	const reasonReport = $derived(data.reasonReport);
	const equipmentReport = $derived(data.equipmentReport);
	const topClients = $derived(data.topClients);
	const recentFinalizedAppointments = $derived(data.recentFinalizedAppointments);
	const pendingPaymentAppointments = $derived(data.pendingPaymentAppointments);

	const statusLabels: Record<string, string> = {
		PENDIENTE: 'Pendiente',
		CONFIRMADO: 'Confirmado',
		FINALIZADO: 'Finalizado',
		CANCELADO: 'Cancelado'
	};

	const reasonLabels: Record<string, string> = {
		LIMPIEZA: 'Limpieza',
		MANTENIMIENTO: 'Mantenimiento',
		REPARACION: 'Reparación',
		OTRO: 'Otro'
	};

	const equipmentLabels: Record<string, string> = {
		AIRE_ACONDICIONADO: 'Aire acondicionado',
		HELADERA: 'Heladera',
		FREEZER: 'Freezer',
		OTRO: 'Otro equipo'
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

	function getPercentage(value: number, total: number) {
		if (total <= 0) {
			return 0;
		}

		return Math.round((value / total) * 100);
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
	<title>Reportes | Oso Polar Refrigeración</title>
</svelte:head>

<section>
	<div class="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
		<div>
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Panel administrador
			</p>

			<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
				Reportes
			</h2>

			<p class="mt-2 max-w-2xl text-slate-600">
				Analizá turnos, ingresos, pagos pendientes, servicios más solicitados y clientes
				con más actividad.
			</p>
		</div>

		<a
			href="/admin/calendario"
			class="w-full rounded-full bg-sky-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 sm:w-fit"
		>
			Ver calendario
		</a>
	</div>

	<form
		method="GET"
		class="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
	>
		<div class="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
			<div>
				<label for="from" class="text-sm font-bold text-slate-700">
					Desde
				</label>

				<input
					id="from"
					name="from"
					type="date"
					value={filters.from}
					class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
			</div>

			<div>
				<label for="to" class="text-sm font-bold text-slate-700">
					Hasta
				</label>

				<input
					id="to"
					name="to"
					type="date"
					value={filters.to}
					class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
			</div>

			<button
				type="submit"
				class="rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
			>
				Aplicar filtros
			</button>
		</div>
	</form>

	<div class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<article class="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
			<p class="text-sm font-bold text-green-700">
				Ingresos cobrados
			</p>

			<p class="mt-3 text-3xl font-black text-green-950">
				{formatMoney(stats.paidIncome)}
			</p>

			<p class="mt-2 text-sm font-semibold text-green-700">
				Trabajos pagados en el período
			</p>
		</article>

		<article class="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
			<p class="text-sm font-bold text-red-700">
				Pendiente de cobro
			</p>

			<p class="mt-3 text-3xl font-black text-red-950">
				{formatMoney(stats.pendingDebt)}
			</p>

			<p class="mt-2 text-sm font-semibold text-red-700">
				Trabajos con precio final sin pagar
			</p>
		</article>

		<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<p class="text-sm font-bold text-slate-500">
				Ticket promedio
			</p>

			<p class="mt-3 text-3xl font-black text-slate-950">
				{formatMoney(stats.averageTicket)}
			</p>

			<p class="mt-2 text-sm font-semibold text-slate-500">
				Promedio de trabajos finalizados
			</p>
		</article>

		<article class="rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
			<p class="text-sm font-bold text-sky-700">
				Total turnos
			</p>

			<p class="mt-3 text-3xl font-black text-sky-950">
				{stats.totalAppointments}
			</p>

			<p class="mt-2 text-sm font-semibold text-sky-700">
				Turnos dentro del período
			</p>
		</article>
	</div>

	<div class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<article class="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
			<p class="text-sm font-bold text-amber-700">
				Pendientes
			</p>

			<p class="mt-3 text-3xl font-black text-amber-950">
				{stats.pendingAppointments}
			</p>
		</article>

		<article class="rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
			<p class="text-sm font-bold text-sky-700">
				Confirmados
			</p>

			<p class="mt-3 text-3xl font-black text-sky-950">
				{stats.confirmedAppointments}
			</p>
		</article>

		<article class="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
			<p class="text-sm font-bold text-green-700">
				Finalizados
			</p>

			<p class="mt-3 text-3xl font-black text-green-950">
				{stats.finalizedAppointments}
			</p>
		</article>

		<article class="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
			<p class="text-sm font-bold text-red-700">
				Cancelados
			</p>

			<p class="mt-3 text-3xl font-black text-red-950">
				{stats.cancelledAppointments}
			</p>
		</article>
	</div>

	<div class="grid gap-6 xl:grid-cols-3">
		<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 class="text-xl font-black text-slate-950">
				Turnos por estado
			</h3>

			<div class="mt-5 grid gap-4">
				{#if statusReport.length === 0}
					<p class="rounded-2xl bg-slate-50 p-4 text-center font-bold text-slate-500">
						Sin datos.
					</p>
				{:else}
					{#each statusReport as item (item.status)}
						<div>
							<div class="mb-2 flex items-center justify-between gap-3">
								<span class={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(item.status)}`}>
									{statusLabels[item.status] ?? item.status}
								</span>

								<span class="text-sm font-black text-slate-950">
									{item._count._all}
								</span>
							</div>

							<div class="h-3 overflow-hidden rounded-full bg-slate-100">
								<div
									class="h-full rounded-full bg-sky-500"
									style={`width: ${getPercentage(item._count._all, stats.totalAppointments)}%`}
								></div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</section>

		<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 class="text-xl font-black text-slate-950">
				Servicios más solicitados
			</h3>

			<div class="mt-5 grid gap-4">
				{#if reasonReport.length === 0}
					<p class="rounded-2xl bg-slate-50 p-4 text-center font-bold text-slate-500">
						Sin datos.
					</p>
				{:else}
					{#each reasonReport as item (item.visitReason)}
						<div>
							<div class="mb-2 flex items-center justify-between gap-3">
								<p class="font-bold text-slate-700">
									{reasonLabels[item.visitReason] ?? item.visitReason}
								</p>

								<span class="text-sm font-black text-slate-950">
									{item._count._all}
								</span>
							</div>

							<div class="h-3 overflow-hidden rounded-full bg-slate-100">
								<div
									class="h-full rounded-full bg-green-500"
									style={`width: ${getPercentage(item._count._all, stats.totalAppointments)}%`}
								></div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</section>

		<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 class="text-xl font-black text-slate-950">
				Equipos atendidos
			</h3>

			<div class="mt-5 grid gap-4">
				{#if equipmentReport.length === 0}
					<p class="rounded-2xl bg-slate-50 p-4 text-center font-bold text-slate-500">
						Sin datos.
					</p>
				{:else}
					{#each equipmentReport as item (item.equipmentType)}
						<div>
							<div class="mb-2 flex items-center justify-between gap-3">
								<p class="font-bold text-slate-700">
									{equipmentLabels[item.equipmentType] ?? item.equipmentType}
								</p>

								<span class="text-sm font-black text-slate-950">
									{item._count._all}
								</span>
							</div>

							<div class="h-3 overflow-hidden rounded-full bg-slate-100">
								<div
									class="h-full rounded-full bg-amber-500"
									style={`width: ${getPercentage(item._count._all, stats.totalAppointments)}%`}
								></div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</section>
	</div>

	<div class="mt-6 grid gap-6 xl:grid-cols-3">
		<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 class="text-xl font-black text-slate-950">
				Clientes con más turnos
			</h3>

			<div class="mt-5 grid gap-3">
				{#if topClients.length === 0}
					<p class="rounded-2xl bg-slate-50 p-4 text-center font-bold text-slate-500">
						Sin datos.
					</p>
				{:else}
					{#each topClients as client (client.clientId)}
						<a
							href={`/admin/clientes/${client.clientId}`}
							class="rounded-2xl bg-slate-50 p-4 hover:bg-slate-100"
						>
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<p class="wrap-break-word font-black text-slate-950">
										{client.fullName}
									</p>

									{#if client.phone}
										<p class="mt-1 text-sm text-slate-500">
											{client.phone}
										</p>
									{/if}
								</div>

								<span class="shrink-0 rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">
									{client.totalAppointments}
								</span>
							</div>
						</a>
					{/each}
				{/if}
			</div>
		</section>

		<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 class="text-xl font-black text-slate-950">
				Últimos finalizados
			</h3>

			<div class="mt-5 grid gap-3">
				{#if recentFinalizedAppointments.length === 0}
					<p class="rounded-2xl bg-slate-50 p-4 text-center font-bold text-slate-500">
						Sin trabajos finalizados.
					</p>
				{:else}
					{#each recentFinalizedAppointments as appointment (appointment.id)}
						<a
							href={`/admin/turnos/${appointment.id}`}
							class="rounded-2xl bg-slate-50 p-4 hover:bg-slate-100"
						>
							<p class="wrap-break-word font-black text-slate-950">
								{appointment.client.fullName}
							</p>

							<p class="mt-1 text-sm font-semibold text-slate-500">
								{formatDate(appointment.date)} · {appointment.time}
							</p>

							<p class="mt-2 font-black text-green-700">
								{formatMoney(appointment.finalPrice)}
							</p>
						</a>
					{/each}
				{/if}
			</div>
		</section>

		<section class="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
			<h3 class="text-xl font-black text-red-950">
				Pendientes de cobro
			</h3>

			<div class="mt-5 grid gap-3">
				{#if pendingPaymentAppointments.length === 0}
					<p class="rounded-2xl bg-white/70 p-4 text-center font-bold text-red-700">
						No hay deudas registradas.
					</p>
				{:else}
					{#each pendingPaymentAppointments as appointment (appointment.id)}
						<a
							href={`/admin/turnos/${appointment.id}`}
							class="rounded-2xl bg-white p-4 hover:bg-red-100"
						>
							<p class="wrap-break-word font-black text-slate-950">
								{appointment.client.fullName}
							</p>

							<p class="mt-1 text-sm font-semibold text-slate-500">
								{formatDate(appointment.date)} · {appointment.time}
							</p>

							<p class="mt-2 font-black text-red-700">
								{formatMoney(appointment.finalPrice)}
							</p>
						</a>
					{/each}
				{/if}
			</div>
		</section>
	</div>
</section>