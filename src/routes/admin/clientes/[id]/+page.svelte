<script lang="ts">
	let { data } = $props();

	const client = $derived(data.client);
	const stats = $derived(data.stats);

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

	const paymentLabels: Record<string, string> = {
		EFECTIVO: 'Efectivo',
		TRANSFERENCIA: 'Transferencia',
		MERCADO_PAGO: 'Mercado Pago',
		TARJETA: 'Tarjeta',
		OTRO: 'Otro'
	};

	function formatDate(date: string | Date | null) {
		if (!date) return 'No informado';

		return new Date(date).toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	function formatDateTime(date: string | Date | null) {
		if (!date) return 'No informado';

		return new Date(date).toLocaleString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatMoney(value: number | null | undefined) {
		if (value === null || value === undefined) return 'No informado';

		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			maximumFractionDigits: 0
		}).format(value);
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

	function getWhatsAppUrl(phone: string) {
		return `https://wa.me/${phone.replace(/\D/g, '')}`;
	}
</script>

<svelte:head>
	<title>{client.fullName} | Clientes | Oso Polar Refrigeración</title>
</svelte:head>

<section>
	<div class="mb-8">
		<a
			href="/admin/clientes"
			class="inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-800"
		>
			<span>←</span>
			<span>Volver a clientes</span>
		</a>

		<div class="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<p class="text-sm font-black uppercase tracking-wide text-sky-700">
					Historial del cliente
				</p>

				<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
					{client.fullName}
				</h2>

				<p class="mt-2 text-slate-600">
					Cliente registrado el {formatDateTime(client.createdAt)}
				</p>
			</div>

			<div class="flex flex-col gap-3 sm:flex-row">
				<a
					href={getWhatsAppUrl(client.phone)}
					target="_blank"
					rel="noreferrer"
					class="rounded-full bg-green-600 px-5 py-3 text-center text-sm font-bold text-white hover:bg-green-700"
				>
					WhatsApp
				</a>

				<a
					href="/admin/turnos/nuevo"
					class="rounded-full bg-sky-600 px-5 py-3 text-center text-sm font-bold text-white hover:bg-sky-700"
				>
					Nuevo turno
				</a>
			</div>
		</div>
	</div>

	<div class="grid gap-6 xl:grid-cols-3">
		<article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Cliente
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Datos personales
			</h3>

			<dl class="mt-6 grid gap-5">
				<div>
					<dt class="text-sm font-bold text-slate-500">
						Nombre
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{client.fullName}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						WhatsApp
					</dt>

					<dd class="mt-1">
						<a
							href={getWhatsAppUrl(client.phone)}
							target="_blank"
							rel="noreferrer"
							class="font-bold text-green-700 hover:text-green-800"
						>
							{client.phone}
						</a>
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Dirección
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{client.address}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Barrio / zona
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{client.neighborhood ?? 'No informado'}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Ciudad
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{client.city}
					</dd>
				</div>

				{#if client.notes}
					<div>
						<dt class="text-sm font-bold text-slate-500">
							Notas
						</dt>

						<dd class="mt-1 whitespace-pre-line font-semibold text-slate-950">
							{client.notes}
						</dd>
					</div>
				{/if}
			</dl>
		</article>

		<article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Resumen
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Actividad del cliente
			</h3>

			<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<div class="rounded-2xl bg-slate-50 p-5">
					<p class="text-sm font-bold text-slate-500">
						Total turnos
					</p>

					<p class="mt-2 text-3xl font-black text-slate-950">
						{stats.totalAppointments}
					</p>
				</div>

				<div class="rounded-2xl bg-green-50 p-5">
					<p class="text-sm font-bold text-green-700">
						Finalizados
					</p>

					<p class="mt-2 text-3xl font-black text-green-800">
						{stats.completedAppointments}
					</p>
				</div>

				<div class="rounded-2xl bg-sky-50 p-5">
					<p class="text-sm font-bold text-sky-700">
						Confirmados
					</p>

					<p class="mt-2 text-3xl font-black text-sky-800">
						{stats.confirmedAppointments}
					</p>
				</div>

				<div class="rounded-2xl bg-amber-50 p-5">
					<p class="text-sm font-bold text-amber-700">
						Pendientes
					</p>

					<p class="mt-2 text-3xl font-black text-amber-800">
						{stats.pendingAppointments}
					</p>
				</div>

				<div class="rounded-2xl bg-red-50 p-5">
					<p class="text-sm font-bold text-red-700">
						Cancelados
					</p>

					<p class="mt-2 text-3xl font-black text-red-800">
						{stats.cancelledAppointments}
					</p>
				</div>

				<div class="rounded-2xl bg-emerald-50 p-5">
					<p class="text-sm font-bold text-emerald-700">
						Total pagado
					</p>

					<p class="mt-2 text-xl font-black text-emerald-800">
						{formatMoney(stats.totalPaid)}
					</p>
				</div>

				<div class="rounded-2xl bg-orange-50 p-5">
					<p class="text-sm font-bold text-orange-700">
						Pendiente de pago
					</p>

					<p class="mt-2 text-xl font-black text-orange-800">
						{formatMoney(stats.totalDebt)}
					</p>
				</div>

				<div class="rounded-2xl bg-slate-50 p-5">
					<p class="text-sm font-bold text-slate-500">
						Equipos
					</p>

					<p class="mt-2 text-3xl font-black text-slate-950">
						{client.equipments.length}
					</p>
				</div>
			</div>
		</article>
	</div>

	{#if client.equipments.length > 0}
		<article class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Equipos
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Equipos registrados
			</h3>

			<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each client.equipments as equipment (equipment.id)}
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
						<p class="font-black text-slate-950">
							{equipmentLabels[equipment.type] ?? equipment.type}
						</p>

						<p class="mt-2 text-sm text-slate-600">
							Marca: <strong>{equipment.brand ?? 'No informada'}</strong>
						</p>

						<p class="mt-1 text-sm text-slate-600">
							Modelo: <strong>{equipment.model ?? 'No informado'}</strong>
						</p>

						{#if equipment.notes}
							<p class="mt-3 whitespace-pre-line text-sm text-slate-700">
								{equipment.notes}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		</article>
	{/if}

	<article class="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
		<div class="border-b border-slate-200 p-6">
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Historial
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Turnos del cliente
			</h3>
		</div>

		{#if client.appointments.length === 0}
			<div class="p-8 text-center">
				<p class="text-lg font-black text-slate-950">
					Este cliente todavía no tiene turnos
				</p>

				<p class="mt-2 text-slate-500">
					Podés crear uno desde el botón Nuevo turno.
				</p>
			</div>
		{:else}
			<div class="divide-y divide-slate-100">
				{#each client.appointments as appointment (appointment.id)}
					<div class="p-6">
						<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
							<div>
								<div class="flex flex-wrap items-center gap-3">
									<h4 class="text-lg font-black text-slate-950">
										{formatDate(appointment.date)} · {appointment.time}
									</h4>

									<span
										class={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
											appointment.status
										)}`}
									>
										{statusLabels[appointment.status] ?? appointment.status}
									</span>

									<span
										class={`rounded-full px-3 py-1 text-xs font-black ${
											appointment.paid
												? 'bg-green-100 text-green-800'
												: 'bg-amber-100 text-amber-800'
										}`}
									>
										{appointment.paid ? 'Pagado' : 'Pago pendiente'}
									</span>
								</div>

								<p class="mt-3 font-semibold text-slate-900">
									{equipmentLabels[appointment.equipmentType] ?? appointment.equipmentType}
									·
									{reasonLabels[appointment.visitReason] ?? appointment.visitReason}
								</p>

								<p class="mt-2 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
									{appointment.problemDescription}
								</p>
							</div>

							<a
								href={`/admin/turnos/${appointment.id}`}
								class="w-fit rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700"
							>
								Ver turno
							</a>
						</div>

						<div class="mt-5 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
							<div>
								<p class="font-bold text-slate-500">
									Precio final
								</p>

								<p class="mt-1 font-semibold text-slate-950">
									{formatMoney(appointment.finalPrice)}
								</p>
							</div>

							<div>
								<p class="font-bold text-slate-500">
									Medio de pago
								</p>

								<p class="mt-1 font-semibold text-slate-950">
									{appointment.paymentMethod
										? paymentLabels[appointment.paymentMethod]
										: 'No informado'}
								</p>
							</div>

							<div>
								<p class="font-bold text-slate-500">
									Dirección usada
								</p>

								<p class="mt-1 font-semibold text-slate-950">
									{appointment.address}
								</p>
							</div>

							<div>
								<p class="font-bold text-slate-500">
									Adjuntos
								</p>

								<p class="mt-1 font-semibold text-slate-950">
									{appointment.attachments.length}
								</p>
							</div>
						</div>

						{#if appointment.technicianNotes}
							<div class="mt-5 rounded-2xl bg-sky-50 p-4">
								<p class="text-sm font-bold text-sky-700">
									Observaciones del técnico
								</p>

								<p class="mt-2 whitespace-pre-line text-sm text-slate-700">
									{appointment.technicianNotes}
								</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</article>
</section>