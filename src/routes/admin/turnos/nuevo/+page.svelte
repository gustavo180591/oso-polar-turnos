<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	const availableTimes = ['08:30', '10:00', '15:00', '16:30', '18:00'];
</script>

<svelte:head>
	<title>Nuevo turno | Oso Polar Refrigeración</title>
</svelte:head>

<section>
	<div class="mb-8">
		<a
			href="/admin/turnos"
			class="inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-800"
		>
			<span>←</span>
			<span>Volver a turnos</span>
		</a>

		<div class="mt-5">
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Panel administrador
			</p>

			<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
				Crear nuevo turno
			</h2>

			<p class="mt-2 max-w-2xl text-slate-600">
				Usá este formulario para cargar turnos manualmente cuando el cliente se comunica por
				WhatsApp, llamada o de forma presencial.
			</p>
		</div>
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

	<form
		method="POST"
		use:enhance
		class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
	>
		<div>
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Datos del cliente
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Información principal
			</h3>
		</div>

		<div class="mt-6 grid gap-5 md:grid-cols-2">
			<div>
				<label for="fullName" class="mb-2 block text-sm font-bold text-slate-700">
					Nombre y apellido *
				</label>

				<input
					id="fullName"
					name="fullName"
					type="text"
					value={form?.values?.fullName ?? ''}
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
					placeholder="Ej: Centro"
				/>
			</div>
		</div>

		<div class="mt-10">
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Datos del servicio
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Turno y problema
			</h3>
		</div>

		<div class="mt-6 grid gap-5 md:grid-cols-2">
			<div>
				<label for="equipmentType" class="mb-2 block text-sm font-bold text-slate-700">
					Tipo de equipo *
				</label>

				<select
					id="equipmentType"
					name="equipmentType"
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				>
					<option value="">Seleccionar</option>

					<option
						value="AIRE_ACONDICIONADO"
						selected={form?.values?.equipmentType === 'AIRE_ACONDICIONADO'}
					>
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
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				>
					<option value="">Seleccionar</option>

					<option value="LIMPIEZA" selected={form?.values?.visitReason === 'LIMPIEZA'}>
						Limpieza
					</option>

					<option
						value="MANTENIMIENTO"
						selected={form?.values?.visitReason === 'MANTENIMIENTO'}
					>
						Mantenimiento
					</option>

					<option
						value="REPARACION"
						selected={form?.values?.visitReason === 'REPARACION'}
					>
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
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
			</div>

			<div>
				<label for="time" class="mb-2 block text-sm font-bold text-slate-700">
					Horario *
				</label>

				<select
					id="time"
					name="time"
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				>
					<option value="">Seleccionar</option>

					{#each availableTimes as time (time)}
						<option value={time} selected={form?.values?.time === time}>
							{time}
						</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="status" class="mb-2 block text-sm font-bold text-slate-700">
					Estado inicial *
				</label>

				<select
					id="status"
					name="status"
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				>
					<option value="PENDIENTE" selected={(form?.values?.status ?? 'PENDIENTE') === 'PENDIENTE'}>
						Pendiente
					</option>

					<option value="CONFIRMADO" selected={form?.values?.status === 'CONFIRMADO'}>
						Confirmado
					</option>
				</select>
			</div>

			<div class="md:col-span-2">
				<label
					for="problemDescription"
					class="mb-2 block text-sm font-bold text-slate-700"
				>
					Descripción del problema *
				</label>

				<textarea
					id="problemDescription"
					name="problemDescription"
					rows="5"
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
					placeholder="Ej: El aire enfría poco, pierde agua o hace ruido..."
				>{form?.values?.problemDescription ?? ''}</textarea>
			</div>
		</div>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row">
			<button
				type="submit"
				class="rounded-full bg-sky-600 px-6 py-3 font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
			>
				Crear turno
			</button>

			<a
				href="/admin/turnos"
				class="rounded-full border border-slate-300 px-6 py-3 text-center font-bold text-slate-700 hover:bg-slate-50"
			>
				Cancelar
			</a>
		</div>
	</form>
</section>