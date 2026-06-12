<script lang="ts">
	let { children } = $props();

	const navItems = [
		{
			label: 'Dashboard',
			href: '/admin'
		},
		{
			label: 'Turnos',
			href: '/admin/turnos'
		},
		{
			label: 'Calendario',
			href: '/admin/calendario'
		},
		{
			label: 'Clientes',
			href: '/admin/clientes'
		},
		{
			label: 'Servicios',
			href: '/admin/servicios'
		},
		{
			label: 'Reportes',
			href: '/admin/reportes'
		}
	];
</script>

<div class="min-h-screen bg-slate-100 text-slate-900">
	<aside
		class="fixed top-0 left-0 hidden h-screen w-64 border-r border-slate-200 bg-white p-6 lg:block"
	>
		<a href="/" class="flex items-center gap-3">
			<img
				src="/brand/logo-circular.jpeg"
				alt="Oso Polar Refrigeración"
				class="h-14 w-14 rounded-full object-cover ring-2 ring-sky-100"
			/>

			<div>
				<p class="text-lg leading-none font-black text-slate-950">Oso Polar</p>

				<p class="mt-1 text-xs font-bold tracking-wide text-sky-700 uppercase">Refrigeración</p>
			</div>
		</a>

		<nav class="mt-8 grid gap-2">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					class="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</aside>

	<div class="lg:pl-64">
		<header
			class="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8"
		>
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between gap-4">
					<div class="flex min-w-0 items-center gap-3">
						<img
							src="/brand/logo-circular.jpeg"
							alt="Oso Polar Refrigeración"
							class="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-sky-100 lg:hidden"
						/>

						<div class="min-w-0">
							<p class="text-sm font-semibold text-sky-700">Panel técnico</p>

							<h1 class="truncate text-lg font-black text-slate-950 sm:text-xl">
								Oso Polar Refrigeración
							</h1>
						</div>
					</div>

					<a
						href="/admin/turnos/nuevo"
						class="shrink-0 rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700"
					>
						Nuevo turno
					</a>
				</div>

				<nav class="flex gap-2 overflow-x-auto pb-1 lg:hidden">
					{#each navItems as item (item.href)}
						<a
							href={item.href}
							class="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-sky-100 hover:text-sky-700"
						>
							{item.label}
						</a>
					{/each}
				</nav>
			</div>
		</header>

		<main class="p-4 lg:p-8">
			{@render children()}
		</main>
	</div>
</div>
