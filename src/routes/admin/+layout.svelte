<script lang="ts">
	let { children } = $props();

	let menuOpen = $state(false);

	const navItems = [
		{ label: 'Dashboard', href: '/admin' },
		{ label: 'Turnos', href: '/admin/turnos' },
		{ label: 'Calendario', href: '/admin/calendario' },
		{ label: 'Clientes', href: '/admin/clientes' },
		{ label: 'Servicios', href: '/admin/servicios' },
		{ label: 'Reportes', href: '/admin/reportes' }
	];

	function closeMenu() {
		menuOpen = false;
	}
</script>

<div class="min-h-screen bg-slate-100 text-slate-900">
	<aside class="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
		<a href="/" class="flex items-center gap-3">
			<img
				src="/brand/logo-circular.jpeg"
				alt="Oso Polar Refrigeración"
				class="h-16 w-16 rounded-full object-cover ring-2 ring-sky-100"
			/>

			<div>
				<p class="text-xl font-black leading-none text-slate-950">
					Oso Polar
				</p>

				<p class="mt-1 text-xs font-bold uppercase tracking-wide text-sky-700">
					Refrigeración
				</p>
			</div>
		</a>

		<nav class="mt-10 grid gap-2">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					class="rounded-2xl px-4 py-3 font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700"
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="absolute bottom-6 left-6 right-6 rounded-3xl bg-sky-50 p-4">
			<p class="text-sm font-black text-slate-950">
				Panel técnico
			</p>

			<p class="mt-1 text-xs font-semibold text-slate-600">
				Gestión de turnos, clientes y servicios.
			</p>
		</div>
	</aside>

	<div class="lg:pl-72">
		<header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:px-8">
			<div class="flex items-center justify-between gap-3">
				<a href="/admin" class="flex min-w-0 items-center gap-3 lg:hidden">
					<img
						src="/brand/logo-circular.jpeg"
						alt="Oso Polar Refrigeración"
						class="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-sky-100"
					/>

					<div class="min-w-0">
						<p class="truncate text-base font-black leading-tight text-slate-950">
							Oso Polar
						</p>

						<p class="truncate text-xs font-bold uppercase tracking-wide text-sky-700">
							Panel técnico
						</p>
					</div>
				</a>

				<div class="hidden lg:block">
					<p class="text-sm font-bold text-sky-700">
						Panel técnico
					</p>

					<h1 class="text-xl font-black text-slate-950">
						Oso Polar Refrigeración
					</h1>
				</div>

				<div class="flex items-center gap-2">
					<a
						href="/admin/turnos/nuevo"
						class="hidden rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 sm:inline-flex"
					>
						Nuevo turno
					</a>

					<button
						type="button"
						class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-800 hover:bg-slate-200 lg:hidden"
						aria-label="Abrir menú"
						aria-expanded={menuOpen}
						onclick={() => {
							menuOpen = !menuOpen;
						}}
					>
						{#if menuOpen}
							×
						{:else}
							☰
						{/if}
					</button>
				</div>
			</div>

			{#if menuOpen}
				<div class="mt-4 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl lg:hidden">
					<nav class="grid gap-2">
						{#each navItems as item (item.href)}
							<a
								href={item.href}
								onclick={closeMenu}
								class="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 hover:bg-sky-50 hover:text-sky-700"
							>
								{item.label}
							</a>
						{/each}

						<a
							href="/admin/turnos/nuevo"
							onclick={closeMenu}
							class="rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-black text-white hover:bg-sky-700 sm:hidden"
						>
							Nuevo turno
						</a>
					</nav>
				</div>
			{/if}
		</header>

		<main class="p-4 sm:p-6 lg:p-8">
			{@render children()}
		</main>
	</div>
</div>