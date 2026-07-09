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

	type Holiday = {
		id: string;
		name: string;
		date: string;
	};

	type PageDataWithSchedule = {
		schedules: Schedule[];
		holidays: Holiday[];
	};

	type FlatpickrDayElement = HTMLElement & {
		dateObj: Date;
	};

	let {
		data,
		form
	}: {
		data: PageDataWithSchedule;
		form?: ActionData;
	} = $props();

	const SLOT_DURATION_MINUTES = 90;

	let dateError = $state('');
	let dateValue = $state('');
	let timeValue = $state('');
	let availableTimes = $state<string[]>([]);
	let lastSyncedFormSignature = $state('');

	function getDateKeyFromDate(date: Date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

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

	function getHolidayByDateKey(dateKey: string) {
		return data.holidays.find((holiday: Holiday) => holiday.date === dateKey);
	}

	function isDateBlocked(date: Date) {
		const dayOfWeek = date.getDay();
		const dateKey = getDateKeyFromDate(date);
		const schedule = data.schedules.find((item: Schedule) => item.dayOfWeek === dayOfWeek);
		const holiday = getHolidayByDateKey(dateKey);

		return !schedule || !schedule.isEnabled || Boolean(holiday);
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
		const holiday = getHolidayByDateKey(dateInput);

		if (holiday) {
			dateError = `No se pueden solicitar turnos en esta fecha porque está marcada como feriado o día bloqueado: ${holiday.name}.`;
			dateValue = '';
			timeValue = '';
			availableTimes = [];
			return;
		}

		if (!schedule || !schedule.isEnabled) {
			dateError = schedule
				? `No se pueden solicitar turnos los ${schedule.dayName}. Ese día está deshabilitado.`
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
			allowInput: false,
			disable: [
				(date: Date) => {
					return isDateBlocked(date);
				}
			],
			onChange: (_selectedDates: Date[], dateStr: string) => {
				dateValue = dateStr;
				updateAvailableTimesForDate(dateStr);
			},
			onDayCreate: (_dObj: Date[], _dStr: string, _fp: unknown, dayElem: HTMLElement) => {
				const dayElement = dayElem as FlatpickrDayElement;
				const dateKey = getDateKeyFromDate(dayElement.dateObj);
				const dayOfWeek = dayElement.dateObj.getDay();
				const schedule = data.schedules.find((item: Schedule) => item.dayOfWeek === dayOfWeek);
				const holiday = getHolidayByDateKey(dateKey);

				if (holiday) {
					dayElement.title = `Día bloqueado: ${holiday.name}`;
				} else if (!schedule || !schedule.isEnabled) {
					dayElement.title = 'Día no habilitado para turnos';
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
	<title>Solicitar turno | Oso Polar Refrigeración</title>
</svelte:head>

<section class="min-h-screen bg-sky-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<a href="/" class="text-sm font-semibold text-sky-700 hover:text-sky-800">
			← Volver al inicio
		</a>

		<div class="mt-6 rounded-3xl bg-white p-6 shadow-xl sm:p-8">
			<div class="mb-6 flex justify-center">
				<img
					src="/brand/logo-horizontal.jpeg"
					alt="Oso Polar Refrigeraciones"
					class="w-full max-w-sm rounded-3xl bg-black object-contain p-4 shadow-xl"
				/>
			</div>

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

			<form method="POST" enctype="multipart/form-data" use:enhance class="grid gap-6">
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
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
							class={`w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none focus:ring-4 ${
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
							class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-60 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
								No hay horarios disponibles para ese día.
							</p>
						{/if}
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

				<div>
					<label for="attachments" class="mb-2 block text-sm font-bold text-slate-700">
						Foto o video del equipo
					</label>

					<input
						id="attachments"
						name="attachments"
						type="file"
						accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
						multiple
						class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3
							file:mr-4 file:rounded-full file:border-0 file:bg-sky-100 file:px-4 file:py-2
							file:font-bold file:text-sky-700 hover:file:bg-sky-200"
					/>

					<p class="mt-2 text-sm text-slate-500">
						Podés adjuntar fotos JPG, PNG o WEBP, y videos MP4 o WEBM.
					</p>
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
