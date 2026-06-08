<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	const availableTimes = ['08:30', '10:00', '15:00', '16:30', '18:00'];
</script>

<svelte:head>
	<title>Solicitar turno | Oso Polar Refrigeración</title>
</svelte:head>

<section class="min-h-screen bg-sky-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<a href="/" class="text-sm font-semibold text-sky-700 hover:text-sky-800">
			← Volver al inicio
		</a>

		<div class="mt-6 rounded-3xl bg-white p-6 shadow-xl sm:p-8">
			<div class="mb-8">
				<p class="text-sm font-bold uppercase tracking-wide text-sky-700">
					Oso Polar Refrigeración
				</p>

				<h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
					Solicitar turno
				</h1>

				<p class="mt-4 max-w-2xl text-slate-600">
					Completá tus datos, contanos qué equipo tenés y cuál es el motivo de la visita.
					El turno quedará pendiente hasta que sea confirmado.
				</p>
			</div>

			{#if form?.message}
				<div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
					{form.message}
				</div>
			{/if}

			<form method="POST" use:enhance class="grid gap-6">
				<div class="grid gap-5 md:grid-cols-2">
					<div>
						<label for="fullName" class="mb-2 block text-sm font-bold text-slate-700">
							Nombre y apellido *
						</label>
						<input
							id="fullName"
							name="fullName"
							type="text"
							value={form?.values?.fullName ?? ''}
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
							placeholder="Ej: Juan Pérez"
						/>
					</div>

					<div>
						<label for="phone" class="mb-2 block text-sm font-bold text-slate-700">
							WhatsApp *
						</label>
						<input
							id="phone"
							name="phone"
							type="text"
							value={form?.values?.phone ?? ''}
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
							placeholder="Ej: 3764 123456"
						/>
					</div>

					<div>
						<label for="address" class="mb-2 block text-sm font-bold text-slate-700">
							Dirección *
						</label>
						<input
							id="address"
							name="address"
							type="text"
							value={form?.values?.address ?? ''}
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
							placeholder="Ej: Av. Corrientes 1234"
						/>
					</div>

					<div>
						<label for="neighborhood" class="mb-2 block text-sm font-bold text-slate-700">
							Barrio / zona
						</label>
						<input
							id="neighborhood"
							name="neighborhood"
							type="text"
							value={form?.values?.neighborhood ?? ''}
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
							placeholder="Ej: Centro"
						/>
					</div>

					<div>
						<label for="equipmentType" class="mb-2 block text-sm font-bold text-slate-700">
							Tipo de equipo *
						</label>
						<select
							id="equipmentType"
							name="equipmentType"
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
						>
							<option value="">Seleccionar</option>
							<option value="AIRE_ACONDICIONADO" selected={form?.values?.equipmentType === 'AIRE_ACONDICIONADO'}>
								Aire acondicionado
							</option>
							<option value="HELADERA" selected={form?.values?.equipmentType === 'HELADERA'}>
								Heladera
							</option>
							<option value="FREEZER" selected={form?.values?.equipmentType === 'FREEZER'}>
								Freezer
							</option>
							<option value="OTRO" selected={form?.values?.equipmentType === 'OTRO'}>
								Otro equipo de frío
							</option>
						</select>
					</div>

					<div>
						<label for="visitReason" class="mb-2 block text-sm font-bold text-slate-700">
							Motivo de la visita *
						</label>
						<select
							id="visitReason"
							name="visitReason"
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
						>
							<option value="">Seleccionar</option>
							<option value="LIMPIEZA" selected={form?.values?.visitReason === 'LIMPIEZA'}>
								Limpieza
							</option>
							<option value="MANTENIMIENTO" selected={form?.values?.visitReason === 'MANTENIMIENTO'}>
								Mantenimiento
							</option>
							<option value="REPARACION" selected={form?.values?.visitReason === 'REPARACION'}>
								Reparación
							</option>
							<option value="OTRO" selected={form?.values?.visitReason === 'OTRO'}>
								Otro
							</option>
						</select>
					</div>

					<div>
						<label for="date" class="mb-2 block text-sm font-bold text-slate-700">
							Fecha *
						</label>
						<input
							id="date"
							name="date"
							type="date"
							value={form?.values?.date ?? ''}
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
						/>
					</div>

					<div>
						<label for="time" class="mb-2 block text-sm font-bold text-slate-700">
							Horario *
						</label>
						<select
							id="time"
							name="time"
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
						>
							<option value="">Seleccionar</option>
							{#each availableTimes as time}
								<option value={time} selected={form?.values?.time === time}>
									{time}
								</option>
							{/each}
						</select>
					</div>
				</div>

				<div>
					<label for="problemDescription" class="mb-2 block text-sm font-bold text-slate-700">
						Explicá brevemente qué le pasa al equipo *
					</label>
					<textarea
						id="problemDescription"
						name="problemDescription"
						rows="5"
						class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
						placeholder="Ej: El aire enfría poco, pierde agua o hace ruido..."
					>{form?.values?.problemDescription ?? ''}</textarea>
				</div>

				<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
					<label class="flex gap-3 text-sm text-amber-900">
						<input
							name="acceptedWaitingFee"
							type="checkbox"
							class="mt-1 rounded border-amber-300 text-sky-600 focus:ring-sky-500"
						/>
						<span>
							<strong>Aviso importante:</strong>
							la espera sin confirmación o cancelación previa podrá tener un costo de
							<strong>$30.000</strong>.
						</span>
					</label>
				</div>

				<div class="flex flex-col gap-3 sm:flex-row">
					<button
						type="submit"
						class="rounded-full bg-sky-600 px-6 py-3 font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
					>
						Solicitar turno
					</button>

					<a
						href="/"
						class="rounded-full border border-slate-300 px-6 py-3 text-center font-bold text-slate-700 hover:bg-slate-50"
					>
						Cancelar
					</a>
				</div>
			</form>
		</div>
	</div>
</section>