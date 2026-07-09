<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form?: ActionData } = $props();

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString('es-AR', {
			timeZone: 'UTC',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Feriados | Admin Oso Polar</title>
</svelte:head>

<section class="space-y-6">
	<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
		<a
			href="/admin/configuracion"
			class="inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-800"
		>
			<span>←</span>
			<span>Volver a configuración</span>
		</a>

		<p class="mt-5 text-sm font-black uppercase tracking-wide text-sky-600">
			Configuración
		</p>

		<h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
			Feriados y días bloqueados
		</h1>

		<p class="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
			Cargá los días en los que no se podrán tomar turnos. También podés usar esta sección
			para bloquear días completos por viaje, mantenimiento interno o agenda cerrada.
		</p>

		{#if form?.message}
			<div
				class={`mt-4 rounded-2xl border p-4 text-sm font-bold ${
					form?.success
						? 'border-green-200 bg-green-50 text-green-700'
						: 'border-red-200 bg-red-50 text-red-700'
				}`}
			>
				{form.message}
			</div>
		{/if}
	</div>

	<form
		method="POST"
		action="?/createHoliday"
		use:enhance
		class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
	>
		<h2 class="text-xl font-black text-slate-950">
			Agregar feriado o día bloqueado
		</h2>

		<div class="mt-5 grid gap-4 md:grid-cols-[180px_1fr_1fr]">
			<div>
				<label for="date" class="mb-2 block text-sm font-bold text-slate-700">
					Fecha *
				</label>

				<input
					id="date"
					name="date"
					type="date"
					required
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
			</div>

			<div>
				<label for="name" class="mb-2 block text-sm font-bold text-slate-700">
					Nombre *
				</label>

				<input
					id="name"
					name="name"
					type="text"
					required
					placeholder="Ej: Navidad"
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
			</div>

			<div>
				<label for="description" class="mb-2 block text-sm font-bold text-slate-700">
					Descripción
				</label>

				<input
					id="description"
					name="description"
					type="text"
					placeholder="Ej: No se trabaja este día"
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
			</div>
		</div>

		<div class="mt-5 flex justify-end">
			<button
				type="submit"
				class="rounded-full bg-sky-600 px-6 py-3 font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
			>
				Guardar feriado
			</button>
		</div>
	</form>

	<div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
		<div class="border-b border-slate-200 bg-slate-50 px-5 py-4">
			<h2 class="text-xl font-black text-slate-950">
				Feriados cargados
			</h2>
		</div>

		{#if data.holidays.length === 0}
			<div class="p-5 text-sm font-semibold text-slate-500">
				Todavía no hay feriados cargados.
			</div>
		{:else}
			<div class="divide-y divide-slate-100">
				{#each data.holidays as holiday}
					<article class="grid gap-4 p-5 md:grid-cols-[160px_1fr_auto] md:items-center">
						<div>
							<p class="text-sm font-black text-slate-950">
								{formatDate(holiday.date)}
							</p>

							<p
								class={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-black ${
									holiday.isEnabled
										? 'bg-red-50 text-red-700'
										: 'bg-slate-100 text-slate-500'
								}`}
							>
								{holiday.isEnabled ? 'Bloqueado' : 'Desactivado'}
							</p>
						</div>

						<div>
							<h3 class="font-black text-slate-950">
								{holiday.name}
							</h3>

							{#if holiday.description}
								<p class="mt-1 text-sm font-semibold text-slate-500">
									{holiday.description}
								</p>
							{/if}
						</div>

						<div class="flex flex-wrap gap-2">
							<form method="POST" action="?/toggleHoliday" use:enhance>
								<input type="hidden" name="holidayId" value={holiday.id} />

								<button
									type="submit"
									class="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
								>
									{holiday.isEnabled ? 'Desactivar' : 'Activar'}
								</button>
							</form>

							<form
								method="POST"
								action="?/deleteHoliday"
								use:enhance
								onsubmit={(event) => {
									if (!confirm('¿Seguro que querés eliminar este feriado?')) {
										event.preventDefault();
									}
								}}
							>
								<input type="hidden" name="holidayId" value={holiday.id} />

								<button
									type="submit"
									class="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
								>
									Eliminar
								</button>
							</form>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
