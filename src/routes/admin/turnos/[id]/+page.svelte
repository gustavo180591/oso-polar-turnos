<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const appointment = $derived(data.appointment);

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

	function formatMoney(value: number | null) {
		if (value === null) return 'No informado';

		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			maximumFractionDigits: 0
		}).format(value);
	}

	function getStatusClass(status: string) {
		if (status === 'PENDIENTE') {
			return 'border-amber-200 bg-amber-100 text-amber-800';
		}

		if (status === 'CONFIRMADO') {
			return 'border-sky-200 bg-sky-100 text-sky-800';
		}

		if (status === 'FINALIZADO') {
			return 'border-green-200 bg-green-100 text-green-800';
		}

		if (status === 'CANCELADO') {
			return 'border-red-200 bg-red-100 text-red-800';
		}

		return 'border-slate-200 bg-slate-100 text-slate-700';
	}

	function getWhatsAppUrl(phone: string) {
		const normalizedPhone = phone.replace(/\D/g, '');

		const message = encodeURIComponent(
			`Hola ${appointment.client.fullName}, te escribimos de Oso Polar Refrigeración por tu turno del ${formatDate(
				appointment.date
			)} a las ${appointment.time}.`
		);

		return `https://wa.me/${normalizedPhone}?text=${message}`;
	}
</script>

<svelte:head>
	<title>Detalle del turno | Oso Polar Refrigeración</title>
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

		<div class="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<p class="text-sm font-black uppercase tracking-wide text-sky-700">
					Detalle del turno
				</p>

				<h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
					{appointment.client.fullName}
				</h2>

				<p class="mt-2 text-slate-600">
					Turno registrado el {formatDateTime(appointment.createdAt)}
				</p>
			</div>

			<span
				class={`w-fit rounded-full border px-4 py-2 text-sm font-black ${getStatusClass(
					appointment.status
				)}`}
			>
				{statusLabels[appointment.status] ?? appointment.status}
			</span>
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

	<div class="grid gap-6 xl:grid-cols-2">
		<article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between gap-4">
				<div>
					<p class="text-sm font-black uppercase tracking-wide text-sky-700">
						Cliente
					</p>

					<h3 class="mt-2 text-xl font-black text-slate-950">
						Datos de contacto
					</h3>
				</div>

				<a
					href={getWhatsAppUrl(appointment.client.phone)}
					target="_blank"
					rel="noreferrer"
					class="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
				>
					WhatsApp
				</a>
			</div>

			<dl class="mt-6 grid gap-5">
				<div>
					<dt class="text-sm font-bold text-slate-500">
						Nombre y apellido
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{appointment.client.fullName}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Teléfono
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{appointment.client.phone}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Dirección
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{appointment.address}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Barrio / zona
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{appointment.neighborhood ?? 'No informado'}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Ciudad
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{appointment.city}
					</dd>
				</div>
			</dl>
		</article>

		<article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Servicio
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Información del turno
			</h3>

			<dl class="mt-6 grid gap-5">
				<div>
					<dt class="text-sm font-bold text-slate-500">
						Equipo
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{equipmentLabels[appointment.equipmentType] ?? appointment.equipmentType}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Motivo de la visita
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{reasonLabels[appointment.visitReason] ?? appointment.visitReason}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Fecha y horario
					</dt>

					<dd class="mt-1 font-semibold text-slate-950">
						{formatDate(appointment.date)} a las {appointment.time}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-bold text-slate-500">
						Descripción del problema
					</dt>

					<dd class="mt-2 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-slate-800">
						{appointment.problemDescription}
					</dd>
				</div>
			</dl>
		</article>
	</div>

	{#if appointment.equipment}
		<article class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Equipo registrado
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Datos técnicos
			</h3>

			<div class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
				<div>
					<p class="text-sm font-bold text-slate-500">
						Tipo
					</p>

					<p class="mt-1 font-semibold text-slate-950">
						{equipmentLabels[appointment.equipment.type] ?? appointment.equipment.type}
					</p>
				</div>

				<div>
					<p class="text-sm font-bold text-slate-500">
						Marca
					</p>

					<p class="mt-1 font-semibold text-slate-950">
						{appointment.equipment.brand ?? 'No informada'}
					</p>
				</div>

				<div>
					<p class="text-sm font-bold text-slate-500">
						Modelo
					</p>

					<p class="mt-1 font-semibold text-slate-950">
						{appointment.equipment.model ?? 'No informado'}
					</p>
				</div>

				<div>
					<p class="text-sm font-bold text-slate-500">
						Observaciones
					</p>

					<p class="mt-1 font-semibold text-slate-950">
						{appointment.equipment.notes ?? 'Sin observaciones'}
					</p>
				</div>
			</div>
		</article>
	{/if}

	{#if appointment.attachments.length > 0}
		<article class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Archivos adjuntos
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Fotos y videos enviados
			</h3>

			<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each appointment.attachments as attachment (attachment.id)}
					<a
						href={attachment.url}
						target="_blank"
						rel="noreferrer"
						class="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-sky-300 hover:bg-sky-50"
					>
						<p class="font-bold text-slate-950">
							{attachment.fileName ?? 'Archivo adjunto'}
						</p>

						<p class="mt-1 text-sm text-slate-500">
							{attachment.type === 'FOTO' ? 'Foto' : 'Video'}
						</p>
					</a>
				{/each}
			</div>
		</article>
	{/if}

	<form
		method="POST"
		action="?/updateDetails"
		use:enhance
		class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
	>
		<div>
			<p class="text-sm font-black uppercase tracking-wide text-sky-700">
				Trabajo realizado
			</p>

			<h3 class="mt-2 text-xl font-black text-slate-950">
				Información técnica y pago
			</h3>

			<p class="mt-2 text-sm text-slate-600">
				Completá estos datos al finalizar o actualizar el servicio.
			</p>
		</div>

		<div class="mt-6 grid gap-6 md:grid-cols-2">
			<div class="md:col-span-2">
				<label
					for="technicianNotes"
					class="mb-2 block text-sm font-bold text-slate-700"
				>
					Observaciones del técnico
				</label>

				<textarea
					id="technicianNotes"
					name="technicianNotes"
					rows="6"
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
					placeholder="Trabajo realizado, diagnóstico, repuestos utilizados y recomendaciones..."
				>{appointment.technicianNotes ?? ''}</textarea>
			</div>

			<div>
				<label
					for="finalPrice"
					class="mb-2 block text-sm font-bold text-slate-700"
				>
					Precio final
				</label>

				<input
					id="finalPrice"
					name="finalPrice"
					type="number"
					min="0"
					step="1"
					value={appointment.finalPrice ?? ''}
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
					placeholder="Ej: 30000"
				/>

				{#if appointment.finalPrice !== null}
					<p class="mt-2 text-sm font-semibold text-slate-500">
						Valor actual: {formatMoney(appointment.finalPrice)}
					</p>
				{/if}
			</div>

			<div>
				<label
					for="paymentMethod"
					class="mb-2 block text-sm font-bold text-slate-700"
				>
					Medio de pago
				</label>

				<select
					id="paymentMethod"
					name="paymentMethod"
					class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				>
					<option value="">
						Sin informar
					</option>

					<option
						value="EFECTIVO"
						selected={appointment.paymentMethod === 'EFECTIVO'}
					>
						Efectivo
					</option>

					<option
						value="TRANSFERENCIA"
						selected={appointment.paymentMethod === 'TRANSFERENCIA'}
					>
						Transferencia
					</option>

					<option
						value="MERCADO_PAGO"
						selected={appointment.paymentMethod === 'MERCADO_PAGO'}
					>
						Mercado Pago
					</option>

					<option
						value="TARJETA"
						selected={appointment.paymentMethod === 'TARJETA'}
					>
						Tarjeta
					</option>

					<option
						value="OTRO"
						selected={appointment.paymentMethod === 'OTRO'}
					>
						Otro
					</option>
				</select>

				{#if appointment.paymentMethod}
					<p class="mt-2 text-sm font-semibold text-slate-500">
						Medio actual: {paymentLabels[appointment.paymentMethod]}
					</p>
				{/if}
			</div>

			<div class="md:col-span-2">
				<label
					class="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
				>
					<input
						name="paid"
						type="checkbox"
						checked={appointment.paid}
						class="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
					/>

					<span>
						<span class="block font-bold text-slate-900">
							Trabajo pagado
						</span>

						<span class="mt-1 block text-sm text-slate-500">
							Marcá esta opción cuando el pago haya sido recibido.
						</span>
					</span>
				</label>
			</div>
		</div>

		<div class="mt-6 flex flex-col gap-3 sm:flex-row">
			<button
				type="submit"
				class="rounded-full bg-sky-600 px-6 py-3 font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
			>
				Guardar información
			</button>

			<a
				href="/admin/turnos"
				class="rounded-full border border-slate-300 px-6 py-3 text-center font-bold text-slate-700 hover:bg-slate-50"
			>
				Volver al listado
			</a>
		</div>
	</form>

	<article class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
		<h3 class="text-xl font-black text-slate-950">
			Resumen administrativo
		</h3>

		<div class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
			<div>
				<p class="text-sm font-bold text-slate-500">
					Estado
				</p>

				<p class="mt-1 font-semibold text-slate-950">
					{statusLabels[appointment.status] ?? appointment.status}
				</p>
			</div>

			<div>
				<p class="text-sm font-bold text-slate-500">
					Precio final
				</p>

				<p class="mt-1 font-semibold text-slate-950">
					{formatMoney(appointment.finalPrice)}
				</p>
			</div>

			<div>
				<p class="text-sm font-bold text-slate-500">
					Medio de pago
				</p>

				<p class="mt-1 font-semibold text-slate-950">
					{appointment.paymentMethod
						? paymentLabels[appointment.paymentMethod]
						: 'No informado'}
				</p>
			</div>

			<div>
				<p class="text-sm font-bold text-slate-500">
					Estado del pago
				</p>

				<p
					class={`mt-1 font-bold ${
						appointment.paid ? 'text-green-700' : 'text-amber-700'
					}`}
				>
					{appointment.paid ? 'Pagado' : 'Pendiente'}
				</p>
			</div>

			<div>
				<p class="text-sm font-bold text-slate-500">
					Finalizado
				</p>

				<p class="mt-1 font-semibold text-slate-950">
					{formatDateTime(appointment.finalizedAt)}
				</p>
			</div>

			<div>
				<p class="text-sm font-bold text-slate-500">
					Cancelado
				</p>

				<p class="mt-1 font-semibold text-slate-950">
					{formatDateTime(appointment.cancelledAt)}
				</p>
			</div>

			<div>
				<p class="text-sm font-bold text-slate-500">
					Creado por
				</p>

				<p class="mt-1 font-semibold text-slate-950">
					{appointment.createdBy?.name ?? 'Cliente desde la web'}
				</p>
			</div>

			<div>
				<p class="text-sm font-bold text-slate-500">
					Última actualización
				</p>

				<p class="mt-1 font-semibold text-slate-950">
					{formatDateTime(appointment.updatedAt)}
				</p>
			</div>
		</div>
	</article>
</section>