<script lang="ts">
	let { data } = $props();

	const clients = $derived(data.clients);
	const search = $derived(data.search);

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

	function formatDate(date: string | Date | null) {
		if (!date) return 'Sin turnos';

		return new Date(date).toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
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
</script>

<svelte:head>
	<title>Clientes | Oso Polar Refrigeración</title>
</svelte:head>

<section>
	<div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
		<div>
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Panel administrador
			</p>

			<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
				Clientes
			</h2>

			<p class="mt-2 max-w-2xl text-slate-600">
				Consultá los clientes registrados y accedé a su historial completo de turnos.
			</p>
		</div>

		<a
			href="/admin/turnos/nuevo"
			class="w-fit rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
		>
			Nuevo turno
		</a>
	</div>

	<form method="GET" class="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
		<label for="search" class="mb-2 block text-sm font-bold text-slate-700">
			Buscar cliente
		</label>

		<div class="flex flex-col gap-3 md:flex-row">
			<input
				id="search"
				name="search"
				type="search"
				value={search}
				class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				placeholder="Buscar por nombre, teléfono, dirección o barrio..."
			/>

			<button
				type="submit"
				class="rounded-full bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800"
			>
				Buscar
			</button>

			{#if search}
				<a
					href="/admin/clientes"
					class="rounded-full border border-slate-300 px-6 py-3 text-center font-bold text-slate-700 hover:bg-slate-50"
				>
					Limpiar
				</a>
			{/if}
		</div>
	</form>

	<div class="rounded-3xl border border-slate-200 bg-white shadow-sm">
		<div class="border-b border-slate-200 p-5">
			<h3 class="text-xl font-black text-slate-950">
				Listado de clientes
			</h3>

			<p class="mt-1 text-sm text-slate-500">
				Total encontrado: {clients.length}
			</p>
		</div>

		{#if clients.length === 0}
			<div class="p-8 text-center">
				<p class="text-lg font-black text-slate-950">
					No se encontraron clientes
				</p>

				<p class="mt-2 text-slate-500">
					Probá con otro nombre, teléfono o barrio.
				</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full min-w-[950px] text-left text-sm">
					<thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
						<tr>
							<th class="px-5 py-4">Cliente</th>
							<th class="px-5 py-4">Contacto</th>
							<th class="px-5 py-4">Dirección</th>
							<th class="px-5 py-4">Turnos</th>
							<th class="px-5 py-4">Último turno</th>
							<th class="px-5 py-4 text-right">Acciones</th>
						</tr>
					</thead>

					<tbody class="divide-y divide-slate-100">
						{#each clients as client (client.id)}
							<tr class="hover:bg-slate-50">
								<td class="px-5 py-4">
									<p class="font-black text-slate-950">
										{client.fullName}
									</p>

									<p class="mt-1 text-xs text-slate-500">
										Cliente desde {formatDate(client.createdAt)}
									</p>
								</td>

								<td class="px-5 py-4">
									<a
										href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
										target="_blank"
										rel="noreferrer"
										class="font-bold text-green-700 hover:text-green-800"
									>
										{client.phone}
									</a>
								</td>

								<td class="px-5 py-4">
									<p class="font-semibold text-slate-900">
										{client.address}
									</p>

									<p class="mt-1 text-xs text-slate-500">
										{client.neighborhood ?? 'Sin barrio'} · {client.city}
									</p>
								</td>

								<td class="px-5 py-4">
									<p class="font-black text-slate-950">
										{client._count.appointments}
									</p>

									<p class="mt-1 text-xs text-slate-500">
										Equipos: {client._count.equipments}
									</p>
								</td>

								<td class="px-5 py-4">
									{#if client.appointments[0]}
										<p class="font-bold text-slate-950">
											{formatDate(client.appointments[0].date)} · {client.appointments[0].time}
										</p>

										<p class="mt-1 text-xs text-slate-500">
											{equipmentLabels[client.appointments[0].equipmentType]} ·
											{reasonLabels[client.appointments[0].visitReason]}
										</p>

										<span
											class={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
												client.appointments[0].status
											)}`}
										>
											{statusLabels[client.appointments[0].status]}
										</span>
									{:else}
										<p class="text-slate-500">
											Sin turnos
										</p>
									{/if}
								</td>

								<td class="px-5 py-4 text-right">
									<a
										href={`/admin/clientes/${client.id}`}
										class="rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700"
									>
										Ver historial
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</section>