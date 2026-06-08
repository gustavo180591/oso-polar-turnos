<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen bg-slate-100 text-slate-900">
	<aside class="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white p-6 lg:block">
		<a href="/" class="text-xl font-black text-sky-700">
			Oso Polar
		</a>

		<nav class="mt-8 grid gap-2">
			<a href="/admin" class="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700">
				Dashboard
			</a>

			<a href="/admin/turnos" class="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700">
				Turnos
			</a>

			<a href="/admin/clientes" class="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700">
				Clientes
			</a>

			<a href="/admin/servicios" class="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700">
				Servicios
			</a>

			<a href="/admin/reportes" class="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700">
				Reportes
			</a>
		</nav>
	</aside>

	<div class="lg:pl-64">
		<header class="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-semibold text-sky-700">Panel técnico</p>
					<h1 class="text-xl font-black text-slate-950">Oso Polar Refrigeración</h1>
				</div>

				<a
					href="/solicitar-turno"
					class="rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700"
				>
					Nuevo turno
				</a>
			</div>
		</header>

		<main class="p-4 lg:p-8">
			{@render children()}
		</main>
	</div>
</div>