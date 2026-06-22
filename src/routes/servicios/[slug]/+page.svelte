<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let currentImageIndex = $state(0);

	const galleryImages = $derived(data.service.galleryImages);
	const hasGalleryImages = $derived(galleryImages.length > 0);
	const currentImage = $derived(
		hasGalleryImages
			? galleryImages[currentImageIndex]
			: {
					id: 'fallback',
					src: '/brand/logo-horizontal.jpeg',
					alt: data.service.title
				}
	);

	function previousImage() {
		if (!hasGalleryImages) return;

		currentImageIndex =
			currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
	}

	function nextImage() {
		if (!hasGalleryImages) return;

		currentImageIndex =
			currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1;
	}

	function selectImage(index: number) {
		currentImageIndex = index;
	}

	function useFallbackImage(event: Event) {
		const image = event.currentTarget as HTMLImageElement;
		image.src = '/brand/logo-horizontal.jpeg';
	}
</script>

<svelte:head>
	<title>{data.service.title} | Oso Polar Refrigeración</title>
	<meta name="description" content={data.service.summary} />
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

			<div class="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
				<div>
					<p class="text-sm font-black uppercase tracking-wide text-sky-600">
						{data.service.kicker}
					</p>

					<h1 class="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
						{data.service.title}
					</h1>

					<p class="mt-5 text-lg leading-8 text-slate-600">
						{data.service.summary}
					</p>

					<div class="mt-6 space-y-4 text-base leading-8 text-slate-700">
						{#each data.service.description as paragraph}
							<p>{paragraph}</p>
						{/each}
					</div>
				</div>

				<div class="rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
					<div class="relative overflow-hidden rounded-3xl bg-slate-950">
						<img
							src={currentImage.src}
							alt={currentImage.alt}
							onerror={useFallbackImage}
							class="h-72 w-full object-cover shadow-lg"
						/>

						{#if galleryImages.length > 1}
							<button
								type="button"
								onclick={previousImage}
								class="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-black text-slate-900 shadow-lg hover:bg-white"
								aria-label="Imagen anterior"
							>
								‹
							</button>

							<button
								type="button"
								onclick={nextImage}
								class="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-black text-slate-900 shadow-lg hover:bg-white"
								aria-label="Imagen siguiente"
							>
								›
							</button>
						{/if}
					</div>

					{#if galleryImages.length > 1}
						<div class="mt-3 flex gap-2 overflow-x-auto pb-1">
							{#each galleryImages as image, index}
								<button
									type="button"
									onclick={() => selectImage(index)}
									class={`h-20 w-24 shrink-0 overflow-hidden rounded-2xl border-2 ${
										currentImageIndex === index ? 'border-sky-500' : 'border-transparent'
									}`}
									aria-label={`Ver imagen ${index + 1}`}
								>
									<img
										src={image.src}
										alt={image.alt}
										onerror={useFallbackImage}
										class="h-full w-full object-cover"
									/>
								</button>
							{/each}
						</div>
					{/if}

					{#if !hasGalleryImages}
						<p class="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-800">
							Este servicio todavía no tiene fotos cargadas desde el admin.
						</p>
					{/if}
				</div>
			</div>

			<div class="mt-10 grid gap-4 lg:grid-cols-3">
				<div class="rounded-3xl bg-slate-950 p-5 text-white">
					<h2 class="text-xl font-black">Qué incluye</h2>

					<ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
						{#each data.service.includes as item}
							<li>✓ {item}</li>
						{/each}
					</ul>
				</div>

				<div class="rounded-3xl bg-sky-50 p-5">
					<h2 class="text-xl font-black text-slate-950">Qué revisa el técnico</h2>

					<ul class="mt-4 space-y-3 text-sm leading-6 text-slate-700">
						{#each data.service.checks as item}
							<li>• {item}</li>
						{/each}
					</ul>
				</div>

				<div class="rounded-3xl border border-amber-200 bg-amber-50 p-5">
					<h2 class="text-xl font-black text-amber-900">Cuándo conviene pedirlo</h2>

					<ul class="mt-4 space-y-3 text-sm leading-6 text-amber-900">
						{#each data.service.recommendedWhen as item}
							<li>• {item}</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5">
				<h2 class="text-2xl font-black text-slate-950">Otros servicios</h2>

				<div class="mt-4 grid gap-3 md:grid-cols-3">
					{#each data.relatedServices as service}
						<a
							href={`/servicios/${service.slug}`}
							class="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
						>
							<p class="text-sm font-black uppercase tracking-wide text-sky-600">
								{service.shortTitle}
							</p>

							<p class="mt-2 font-black text-slate-950">
								{service.title}
							</p>
						</a>
					{/each}
				</div>
			</div>

			<div class="mt-10 rounded-3xl bg-slate-950 p-6 text-white">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<p class="text-sm font-black uppercase tracking-wide text-sky-300">
							¿Necesitás este servicio?
						</p>

						<h2 class="mt-2 text-2xl font-black">
							Solicitá un turno con Oso Polar Refrigeración
						</h2>

						<p class="mt-2 text-sm leading-6 text-slate-300">
							Completá el formulario con tus datos, el equipo a revisar y el problema que presenta.
						</p>
					</div>

					<a
						href="/solicitar-turno"
						class="rounded-full bg-sky-500 px-6 py-3 text-center font-black text-white shadow-lg shadow-sky-950/30 hover:bg-sky-400"
					>
						Solicitar turno
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
