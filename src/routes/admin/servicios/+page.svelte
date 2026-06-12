<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const services = $derived(data.services);

	const reasonLabels: Record<string, string> = {
		LIMPIEZA: 'Limpieza',
		MANTENIMIENTO: 'Mantenimiento',
		REPARACION: 'Reparación',
		OTRO: 'Otro'
	};

	const reasonOptions = [
		{
			value: 'LIMPIEZA',
			label: 'Limpieza'
		},
		{
			value: 'MANTENIMIENTO',
			label: 'Mantenimiento'
		},
		{
			value: 'REPARACION',
			label: 'Reparación'
		},
		{
			value: 'OTRO',
			label: 'Otro'
		}
	];

	function formatMoney(value: number | null | undefined) {
		if (value === null || value === undefined) {
			return 'Sin precio base';
		}

		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			maximumFractionDigits: 0
		}).format(value);
	}

	function formatDuration(value: number | null | undefined) {
		if (value === null || value === undefined) {
			return 'Sin duración';
		}

		if (value === 1) {
			return '1 minuto';
		}

		return `${value} minutos`;
	}
</script>

<svelte:head>
	<title>Servicios | Oso Polar Refrigeración</title>
</svelte:head>

<section>
	<div class="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
		<div>
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Panel administrador
			</p>

			<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
				Servicios
			</h2>

			<p class="mt-2 max-w-2xl text-slate-600">
				Gestioná los servicios que ofrece Oso Polar Refrigeración, sus precios base,
				duración estimada y disponibilidad.
			</p>
		</div>

		<a
			href="/admin/turnos/nuevo"
			class="w-full rounded-full bg-sky-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 sm:w-fit"
		>
			Nuevo turno
		</a>
	</div>

	{#if form?.message}
		<div
			class={`mb-6 rounded-3xl border p-4 text-sm font-bold ${
				form.success
					? 'border-green-200 bg-green-50 text-green-800'
					: 'border-red-200 bg-red-50 text-red-800'
			}`}
		>
			{form.message}
		</div>
	{/if}

	<div class="grid gap-6 xl:grid-cols-3">
		<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24 xl:self-start">
			<h3 class="text-xl font-black text-slate-950">
				Crear servicio
			</h3>

			<p class="mt-1 text-sm text-slate-500">
				Agregá un nuevo servicio al sistema.
			</p>

			<form method="POST" action="?/create" use:enhance class="mt-5 grid gap-4">
				<div>
					<label for="name" class="text-sm font-bold text-slate-700">
						Nombre del servicio
					</label>

					<input
						id="name"
						name="name"
						type="text"
						required
						placeholder="Ej: Limpieza de aire acondicionado"
						class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
					/>
				</div>

				<div>
					<label for="visitReason" class="text-sm font-bold text-slate-700">
						Tipo
					</label>

					<select
						id="visitReason"
						name="visitReason"
						required
						class="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
					>
						{#each reasonOptions as option (option.value)}
							<option value={option.value}>
								{option.label}
							</option>
						{/each}
					</select>
				</div>

				<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
					<div>
						<label for="basePrice" class="text-sm font-bold text-slate-700">
							Precio base
						</label>

						<input
							id="basePrice"
							name="basePrice"
							type="number"
							min="0"
							step="1"
							placeholder="Ej: 30000"
							class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
						/>
					</div>

					<div>
						<label for="estimatedDurationMinutes" class="text-sm font-bold text-slate-700">
							Duración
						</label>

						<input
							id="estimatedDurationMinutes"
							name="estimatedDurationMinutes"
							type="number"
							min="0"
							step="1"
							placeholder="Ej: 90"
							class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
						/>
					</div>
				</div>

				<div>
					<label for="description" class="text-sm font-bold text-slate-700">
						Descripción
					</label>

					<textarea
						id="description"
						name="description"
						rows="4"
						placeholder="Detalle breve del servicio..."
						class="mt-2 w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
					></textarea>
				</div>

				<button
					type="submit"
					class="rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
				>
					Guardar servicio
				</button>
			</form>
		</section>

		<section class="xl:col-span-2">
			<div class="mb-4 grid gap-4 sm:grid-cols-3">
				<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
					<p class="text-sm font-bold text-slate-500">
						Total
					</p>

					<p class="mt-2 text-3xl font-black text-slate-950">
						{services.length}
					</p>
				</article>

				<article class="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
					<p class="text-sm font-bold text-green-700">
						Activos
					</p>

					<p class="mt-2 text-3xl font-black text-green-950">
						{services.filter((service) => service.isActive).length}
					</p>
				</article>

				<article class="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
					<p class="text-sm font-bold text-red-700">
						Inactivos
					</p>

					<p class="mt-2 text-3xl font-black text-red-950">
						{services.filter((service) => !service.isActive).length}
					</p>
				</article>
			</div>

			{#if services.length === 0}
				<div class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
					<p class="text-lg font-black text-slate-950">
						Todavía no hay servicios cargados
					</p>

					<p class="mt-2 text-slate-500">
						Creá el primer servicio desde el formulario.
					</p>
				</div>
			{:else}
				<div class="grid gap-4">
					{#each services as service (service.id)}
						<article
							class={`rounded-3xl border bg-white p-5 shadow-sm ${
								service.isActive ? 'border-slate-200' : 'border-red-200 opacity-75'
							}`}
						>
							<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
								<div class="min-w-0">
									<div class="flex flex-wrap items-center gap-2">
										<h3 class="wrap-break-word text-xl font-black text-slate-950">
											{service.name}
										</h3>

										<span
											class={`rounded-full px-3 py-1 text-xs font-black ${
												service.isActive
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
											}`}
										>
											{service.isActive ? 'Activo' : 'Inactivo'}
										</span>

										<span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">
											{reasonLabels[service.visitReason] ?? service.visitReason}
										</span>
									</div>

									{#if service.description}
										<p class="mt-3 wrap-break-word text-sm text-slate-600">
											{service.description}
										</p>
									{:else}
										<p class="mt-3 text-sm text-slate-400">
											Sin descripción.
										</p>
									{/if}

									<div class="mt-4 grid gap-3 sm:grid-cols-2">
										<div class="rounded-2xl bg-slate-50 p-4">
											<p class="text-xs font-black uppercase tracking-wide text-slate-500">
												Precio base
											</p>

											<p class="mt-1 text-lg font-black text-slate-950">
												{formatMoney(service.basePrice)}
											</p>
										</div>

										<div class="rounded-2xl bg-slate-50 p-4">
											<p class="text-xs font-black uppercase tracking-wide text-slate-500">
												Duración estimada
											</p>

											<p class="mt-1 text-lg font-black text-slate-950">
												{formatDuration(service.estimatedDurationMinutes)}
											</p>
										</div>
									</div>
								</div>

								<form method="POST" action="?/toggleActive" use:enhance class="lg:shrink-0">
									<input type="hidden" name="serviceId" value={service.id} />

									<button
										type="submit"
										class={`w-full rounded-full px-5 py-3 text-sm font-black lg:w-auto ${
											service.isActive
												? 'bg-red-600 text-white hover:bg-red-700'
												: 'bg-green-600 text-white hover:bg-green-700'
										}`}
									>
										{service.isActive ? 'Desactivar' : 'Activar'}
									</button>
								</form>
							</div>

							<details class="mt-5 rounded-3xl bg-slate-50 p-4">
								<summary class="cursor-pointer text-sm font-black text-slate-700">
									Editar servicio
								</summary>

								<form method="POST" action="?/update" use:enhance class="mt-5 grid gap-4">
									<input type="hidden" name="serviceId" value={service.id} />

									<div>
										<label
											for={`name-${service.id}`}
											class="text-sm font-bold text-slate-700"
										>
											Nombre del servicio
										</label>

										<input
											id={`name-${service.id}`}
											name="name"
											type="text"
											required
											value={service.name}
											class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
										/>
									</div>

									<div>
										<label
											for={`visitReason-${service.id}`}
											class="text-sm font-bold text-slate-700"
										>
											Tipo
										</label>

										<select
											id={`visitReason-${service.id}`}
											name="visitReason"
											required
											class="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
										>
											{#each reasonOptions as option (option.value)}
												<option value={option.value} selected={service.visitReason === option.value}>
													{option.label}
												</option>
											{/each}
										</select>
									</div>

									<div class="grid gap-4 sm:grid-cols-2">
										<div>
											<label
												for={`basePrice-${service.id}`}
												class="text-sm font-bold text-slate-700"
											>
												Precio base
											</label>

											<input
												id={`basePrice-${service.id}`}
												name="basePrice"
												type="number"
												min="0"
												step="1"
												value={service.basePrice ?? ''}
												class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
											/>
										</div>

										<div>
											<label
												for={`estimatedDurationMinutes-${service.id}`}
												class="text-sm font-bold text-slate-700"
											>
												Duración
											</label>

											<input
												id={`estimatedDurationMinutes-${service.id}`}
												name="estimatedDurationMinutes"
												type="number"
												min="0"
												step="1"
												value={service.estimatedDurationMinutes ?? ''}
												class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
											/>
										</div>
									</div>

									<div>
										<label
											for={`description-${service.id}`}
											class="text-sm font-bold text-slate-700"
										>
											Descripción
										</label>

										<textarea
											id={`description-${service.id}`}
											name="description"
											rows="4"
											class="mt-2 w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
										>{service.description ?? ''}</textarea>
									</div>

									<button
										type="submit"
										class="rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white hover:bg-sky-700"
									>
										Guardar cambios
									</button>
								</form>
							</details>
						</article>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</section>