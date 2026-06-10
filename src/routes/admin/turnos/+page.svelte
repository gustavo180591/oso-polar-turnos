<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const appointments = $derived(data.appointments);

	const statusLabels: Record<string, string> = {
		PENDIENTE: 'Pendiente',
		CONFIRMADO: 'Confirmado',
		FINALIZADO: 'Finalizado',
		CANCELADO: 'Cancelado'
	};

	const equipmentLabels: Record<string, string> = {
		AIRE_ACONDICIONADO: 'Aire acondicionado',
		HELADERA: 'Heladera',
		FREEZER: 'Freezer',
		OTRO: 'Otro'
	};

	const reasonLabels: Record<string, string> = {
		LIMPIEZA: 'Limpieza',
		MANTENIMIENTO: 'Mantenimiento',
		REPARACION: 'Reparación',
		OTRO: 'Otro'
	};

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString('es-AR');
	}

	function getStatusClass(status: string) {
		if (status === 'PENDIENTE') return 'bg-amber-100 text-amber-800';
		if (status === 'CONFIRMADO') return 'bg-sky-100 text-sky-800';
		if (status === 'FINALIZADO') return 'bg-green-100 text-green-800';
		if (status === 'CANCELADO') return 'bg-red-100 text-red-800';

		return 'bg-slate-100 text-slate-700';
	}
</script>

<svelte:head>
	<title>Turnos | Panel técnico</title>
</svelte:head>

<section>
	<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<p class="text-sm font-bold uppercase tracking-wide text-sky-700">Panel técnico</p>
			<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">Turnos</h2>
			<p class="mt-2 text-slate-600">
				Listado de solicitudes registradas desde la web y turnos cargados manualmente.
			</p>
		</div>

		<a
			href="/solicitar-turno"
			class="inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700"
		>
			Crear turno
		</a>
	</div>

	{#if form?.message}
		<div
			class={`mb-6 rounded-2xl border p-4 text-sm font-bold ${
				form?.success
					? 'border-green-200 bg-green-50 text-green-800'
					: 'border-red-200 bg-red-50 text-red-800'
			}`}
		>
			{form.message}
		</div>
	{/if}

	{#if appointments.length === 0}
		<div class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
			<h3 class="text-xl font-black text-slate-950">Todavía no hay turnos</h3>
			<p class="mt-2 text-slate-600">
				Cuando un cliente solicite un turno, aparecerá en este listado.
			</p>
			<a
				href="/solicitar-turno"
				class="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700"
			>
				Crear primer turno
			</a>
		</div>
	{:else}
		<div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-slate-200">
					<thead class="bg-slate-50">
						<tr>
							<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
								Cliente
							</th>
							<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
								Equipo
							</th>
							<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
								Motivo
							</th>
							<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
								Fecha
							</th>
							<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
								Estado
							</th>
							<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
								Dirección
							</th>
							<th class="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
								Acciones
							</th>
						</tr>
					</thead>

					<tbody class="divide-y divide-slate-100">
						{#each appointments as appointment (appointment.id)}
							<tr class="hover:bg-slate-50">
								<td class="px-5 py-4">
									<p class="font-bold text-slate-950">{appointment.client.fullName}</p>
									<p class="text-sm text-slate-500">{appointment.client.phone}</p>
								</td>

								<td class="px-5 py-4 text-sm text-slate-700">
									{equipmentLabels[appointment.equipmentType]}
								</td>

								<td class="px-5 py-4 text-sm text-slate-700">
									{reasonLabels[appointment.visitReason]}
								</td>

								<td class="px-5 py-4 text-sm text-slate-700">
									<p class="font-bold">{formatDate(appointment.date)}</p>
									<p class="text-slate-500">{appointment.time}</p>
								</td>

								<td class="px-5 py-4">
									<span class={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(appointment.status)}`}>
										{statusLabels[appointment.status]}
									</span>
								</td>

								<td class="px-5 py-4 text-sm text-slate-700">
									<p>{appointment.address}</p>
									{#if appointment.neighborhood}
										<p class="text-slate-500">{appointment.neighborhood}</p>
									{/if}
								</td>

								<td class="px-5 py-4">
									<div class="flex min-w-56 flex-wrap gap-2">
										<a
											href={`/admin/turnos/${appointment.id}`}
											class="rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
										>
											Ver detalle
										</a>

										{#if appointment.status === 'PENDIENTE'}
											<form method="POST" action="?/confirm" use:enhance>
												<input type="hidden" name="appointmentId" value={appointment.id} />

												<button
													type="submit"
													class="rounded-full bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700"
												>
													Confirmar
												</button>
											</form>
										{/if}

										{#if appointment.status === 'PENDIENTE' || appointment.status === 'CONFIRMADO'}
											<form method="POST" action="?/finalize" use:enhance>
												<input type="hidden" name="appointmentId" value={appointment.id} />

												<button
													type="submit"
													class="rounded-full bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700"
												>
													Finalizar
												</button>
											</form>

											<form
												method="POST"
												action="?/cancel"
												use:enhance
												onsubmit={(event) => {
		if (!confirm('¿Seguro que querés cancelar este turno?')) {
			event.preventDefault();
		}
	}}
											>
												<input type="hidden" name="appointmentId" value={appointment.id} />

												<button
													type="submit"
													class="rounded-full bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
												>
													Cancelar
												</button>
											</form>
										{/if}
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