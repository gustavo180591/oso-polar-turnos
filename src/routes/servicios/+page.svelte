<script lang="ts">
	import { publicServices } from '$lib/services/public-services';
</script>

<svelte:head>
	<title>Servicios | Oso Polar Refrigeración</title>
	<meta
		name="description"
		content="Servicios disponibles de limpieza, mantenimiento, reparación y diagnóstico técnico de Oso Polar Refrigeración."
	/>
</svelte:head>

<section class="min-h-screen bg-linear-to-br from-sky-50 via-white to-slate-100 px-4 py-8 text-slate-900">
	<div class="mx-auto max-w-6xl">
		<div class="rounded-4xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<a href="/" class="text-sm font-black text-sky-700 hover:text-sky-800">
					← Volver al inicio
				</a>

				<a
					href="/solicitar-turno"
					class="rounded-full bg-sky-600 px-5 py-3 text-center text-sm font-black text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
				>
					Solicitar turno
				</a>
			</div>

			<div class="mt-8 max-w-3xl">
				<p class="text-sm font-black uppercase tracking-wide text-sky-600">
					Servicios disponibles
				</p>

				<h1 class="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
					Servicios de Oso Polar Refrigeración
				</h1>

				<p class="mt-4 text-lg leading-8 text-slate-600">
					Conocé en detalle qué incluye cada servicio antes de solicitar un turno.
				</p>
			</div>

			<div class="mt-8 grid gap-4 md:grid-cols-2">
				{#each publicServices as service}
					<a
						href={`/servicios/${service.slug}`}
						class="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:bg-white hover:shadow-lg"
					>
						<p class="text-sm font-black uppercase tracking-wide text-sky-600">
							{service.shortTitle}
						</p>

						<h2 class="mt-2 text-2xl font-black text-slate-950">
							{service.title}
						</h2>

						<p class="mt-3 leading-7 text-slate-600">
							{service.summary}
						</p>

						<p class="mt-4 font-black text-sky-700">
							Ver detalles →
						</p>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
