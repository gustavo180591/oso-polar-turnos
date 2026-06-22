<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form?: ActionData } = $props();

	function useFallbackImage(event: Event) {
		const image = event.currentTarget as HTMLImageElement;
		image.src = '/brand/logo-horizontal.jpeg';
	}
</script>

<svelte:head>
	<title>Servicios públicos | Admin Oso Polar</title>
</svelte:head>

<section class="space-y-6">
	<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
		<p class="text-sm font-black uppercase tracking-wide text-sky-600">
			Sitio público
		</p>

		<h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
			Imágenes de servicios públicos
		</h1>

		<p class="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
			Subí varias fotos reales de Oso Polar para cada servicio. En la página pública se van
			a mostrar como carrusel.
		</p>

		{#if form?.error}
			<div class="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
				{form.error}
			</div>
		{/if}
	</div>

	<div class="grid gap-4">
		{#each data.services as service}
			<article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
				<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div>
						<p class="text-sm font-black uppercase tracking-wide text-sky-600">
							{service.shortTitle}
						</p>

						<h2 class="mt-2 text-2xl font-black text-slate-950">
							{service.title}
						</h2>

						<p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
							{service.summary}
						</p>

						<p class="mt-3 text-xs font-bold text-slate-500">
							Imágenes cargadas: {service.images.length}
						</p>
					</div>

					<form
						method="POST"
						action="?/upload"
						enctype="multipart/form-data"
						class="grid w-full gap-3 rounded-2xl bg-slate-50 p-4 lg:max-w-md"
					>
						<input type="hidden" name="slug" value={service.slug} />

						<label class="grid gap-2">
							<span class="text-sm font-black text-slate-700">
								Agregar fotos
							</span>

							<input
								type="file"
								name="images"
								accept="image/jpeg,image/png,image/webp"
								multiple
								required
								class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
							/>
						</label>

						<button
							type="submit"
							class="rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
						>
							Subir imágenes
						</button>
					</form>
				</div>

				{#if service.images.length > 0}
					<div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{#each service.images as image}
							<div class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
								<img
									src={image.imageUrl}
									alt={image.fileName ?? service.title}
									onerror={useFallbackImage}
									class="h-44 w-full bg-slate-950 object-cover"
								/>

								<div class="p-3">
									<p class="truncate text-xs font-bold text-slate-500">
										{image.fileName ?? 'Imagen del servicio'}
									</p>

									<form method="POST" action="?/remove" class="mt-3">
										<input type="hidden" name="id" value={image.id} />

										<button
											type="submit"
											class="w-full rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50"
										>
											Eliminar
										</button>
									</form>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
						Este servicio todavía no tiene fotos cargadas.
					</div>
				{/if}
			</article>
		{/each}
	</div>
</section>
