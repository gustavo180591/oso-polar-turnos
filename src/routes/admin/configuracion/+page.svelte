<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form?: ActionData } = $props();
</script>

<svelte:head>
	<title>Configuración | Admin Oso Polar</title>
</svelte:head>

<section class="space-y-6">
	<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
		<p class="text-sm font-black uppercase tracking-wide text-sky-600">
			Configuración general
		</p>

		<h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
			Días y horarios de trabajo
		</h1>

		<p class="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
			Configurá qué días trabaja Oso Polar, los horarios disponibles y el máximo de turnos
			que se pueden tomar por día.
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

	<form method="POST" action="?/save" class="space-y-4">
		<div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
			<div class="hidden grid-cols-[1fr_120px_120px_120px_120px_120px] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 lg:grid">
				<p>Día</p>
				<p>Mañana inicio</p>
				<p>Mañana fin</p>
				<p>Tarde inicio</p>
				<p>Tarde fin</p>
				<p>Máx. turnos</p>
			</div>

			<div class="divide-y divide-slate-100">
				{#each data.schedules as schedule}
					<div class="grid gap-4 p-5 lg:grid-cols-[1fr_120px_120px_120px_120px_120px] lg:items-center">
						<div>
							<label class="flex items-center gap-3">
								<input
									type="checkbox"
									name={`enabled-${schedule.dayOfWeek}`}
									checked={schedule.isEnabled}
									class="h-5 w-5 rounded border-slate-300 text-sky-600"
								/>

								<span class="font-black text-slate-950">
									{schedule.dayName}
								</span>
							</label>

							<p class="mt-1 text-xs font-semibold text-slate-500">
								Activar o desactivar este día.
							</p>
						</div>

						<label class="grid gap-1">
							<span class="text-xs font-black uppercase tracking-wide text-slate-500 lg:hidden">
								Mañana inicio
							</span>
							<input
								type="time"
								name={`morningStart-${schedule.dayOfWeek}`}
								value={schedule.morningStart ?? ''}
								class="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"
							/>
						</label>

						<label class="grid gap-1">
							<span class="text-xs font-black uppercase tracking-wide text-slate-500 lg:hidden">
								Mañana fin
							</span>
							<input
								type="time"
								name={`morningEnd-${schedule.dayOfWeek}`}
								value={schedule.morningEnd ?? ''}
								class="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"
							/>
						</label>

						<label class="grid gap-1">
							<span class="text-xs font-black uppercase tracking-wide text-slate-500 lg:hidden">
								Tarde inicio
							</span>
							<input
								type="time"
								name={`afternoonStart-${schedule.dayOfWeek}`}
								value={schedule.afternoonStart ?? ''}
								class="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"
							/>
						</label>

						<label class="grid gap-1">
							<span class="text-xs font-black uppercase tracking-wide text-slate-500 lg:hidden">
								Tarde fin
							</span>
							<input
								type="time"
								name={`afternoonEnd-${schedule.dayOfWeek}`}
								value={schedule.afternoonEnd ?? ''}
								class="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"
							/>
						</label>

						<label class="grid gap-1">
							<span class="text-xs font-black uppercase tracking-wide text-slate-500 lg:hidden">
								Máx. turnos
							</span>
							<input
								type="number"
								min="0"
								name={`maxAppointments-${schedule.dayOfWeek}`}
								value={schedule.maxAppointments}
								class="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"
							/>
						</label>
					</div>
				{/each}
			</div>
		</div>

		<div class="flex justify-end">
			<button
				type="submit"
				class="rounded-full bg-sky-600 px-6 py-3 font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
			>
				Guardar configuración
			</button>
		</div>
	</form>
</section>
