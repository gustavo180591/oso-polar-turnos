<script lang="ts">
	import { enhance } from '$app/forms';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import type { ActionData } from './$types';

	type Schedule = {
		dayOfWeek: number;
		dayName: string;
		isEnabled: boolean;
		morningStart: string | null;
		morningEnd: string | null;
		afternoonStart: string | null;
		afternoonEnd: string | null;
		maxAppointments: number;
	};

	type PageDataWithSchedules = {
		schedules: Schedule[];
	};

	type FlatpickrDayElement = HTMLElement & {
		dateObj: Date;
	};

	let {
		data,
		form
	}: {
		data: PageDataWithSchedules;
		form?: ActionData;
	} = $props();

	const SLOT_DURATION_MINUTES = 90;

	let dateError = $state('');
	let dateValue = $state('');
	let timeValue = $state('');
	let availableTimes = $state<string[]>([]);
	let lastSyncedFormSignature = $state('');

	function getDayOfWeekFromDateInput(dateInput: string) {
		const [year, month, day] = dateInput.split('-').map(Number);
		const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

		return date.getUTCDay();
	}

	function timeToMinutes(time: string) {
		const [hours, minutes] = time.split(':').map(Number);

		return hours * 60 + minutes;
	}

	function minutesToTime(totalMinutes: number) {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
	}

	function getTimesFromRange(start: string | null, end: string | null) {
		if (!start || !end) {
			return [];
		}

		const startMinutes = timeToMinutes(start);
		const endMinutes = timeToMinutes(end);
		const times: string[] = [];

		for (
			let current = startMinutes;
			current + SLOT_DURATION_MINUTES <= endMinutes;
			current += SLOT_DURATION_MINUTES
		) {
			times.push(minutesToTime(current));
		}

		return times;
	}

	function updateAvailableTimesForDate(dateInput: string, preserveSelectedTime = false) {
		const previousTime = timeValue;

		availableTimes = [];

		if (!preserveSelectedTime) {
			timeValue = '';
		}

		if (!dateInput) {
			dateError = '';
			return;
		}

		const dayOfWeek = getDayOfWeekFromDateInput(dateInput);
		const schedule = data.schedules.find((item: Schedule) => item.dayOfWeek === dayOfWeek);

		if (!schedule || !schedule.isEnabled) {
			dateError = schedule
				? `No se pueden cargar turnos los ${schedule.dayName}. Ese día está deshabilitado en Configuración.`
				: 'El día seleccionado no está habilitado para tomar turnos.';

			dateValue = '';
			timeValue = '';
			availableTimes = [];
			return;
		}

		dateError = '';

		availableTimes = [
			...getTimesFromRange(schedule.morningStart, schedule.morningEnd),
			...getTimesFromRange(schedule.afternoonStart, schedule.afternoonEnd)
		];

		if (preserveSelectedTime && previousTime && availableTimes.includes(previousTime)) {
			timeValue = previousTime;
		}
	}

	function datePicker(node: HTMLInputElement) {
		const picker = flatpickr(node, {
			dateFormat: 'Y-m-d',
			altInput: true,
			altFormat: 'd/m/Y',
			minDate: 'today',
			disable: [
				(date: Date) => {
					const dayOfWeek = date.getDay();
					const schedule = data.schedules.find(
						(item: Schedule) => item.dayOfWeek === dayOfWeek
					);

					return !schedule || !schedule.isEnabled;
				}
			],
			onChange: (_selectedDates: Date[], dateStr: string) => {
				dateValue = dateStr;
				updateAvailableTimesForDate(dateStr);
			},
			onDayCreate: (_dObj: Date[], _dStr: string, _fp: unknown, dayElem: HTMLElement) => {
				const dayElement = dayElem as FlatpickrDayElement;
				const dayOfWeek = dayElement.dateObj.getDay();
				const schedule = data.schedules.find((item: Schedule) => item.dayOfWeek === dayOfWeek);

				if (!schedule || !schedule.isEnabled) {
					dayElement.title = 'Día deshabilitado en Configuración';
				}
			}
		});

		return {
			destroy() {
				picker.destroy();
			}
		};
	}

	$effect(() => {
		const nextDate = String(form?.values?.date ?? '');
		const nextTime = String(form?.values?.time ?? '');
		const nextSignature = `${nextDate}|${nextTime}`;

		if (nextSignature !== lastSyncedFormSignature) {
			lastSyncedFormSignature = nextSignature;
			dateValue = nextDate;
			timeValue = nextTime;

			if (nextDate) {
				updateAvailableTimesForDate(nextDate, true);
			}
		}
	});
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
					type="text"
					value={dateValue}
					use:datePicker
					placeholder="Seleccionar fecha"
					class={`w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none transition focus:ring-4 ${
						dateError
							? 'border-red-300 focus:border-red-500 focus:ring-red-100'
							: 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
					}`}
				/>

				{#if dateError}
					<p class="mt-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
						{dateError}
					</p>
				{/if}
			</div>

			<div>
				<label for="time" class="mb-2 block text-sm font-bold text-slate-700">
					Horario *
				</label>

				<select
					id="time"
					name="time"
					bind:value={timeValue}
					disabled={!dateValue || availableTimes.length === 0}
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				>
					<option value="">
						{dateValue ? 'Seleccionar' : 'Primero elegí una fecha'}
					</option>

					{#each availableTimes as time (time)}
						<option value={time}>
							{time}
						</option>
					{/each}
				</select>

				{#if dateValue && availableTimes.length === 0 && !dateError}
					<p class="mt-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
						No hay horarios configurados para ese día.
					</p>
				{/if}
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
					<option
						value="PENDIENTE"
						selected={(form?.values?.status ?? 'PENDIENTE') === 'PENDIENTE'}
					>
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
