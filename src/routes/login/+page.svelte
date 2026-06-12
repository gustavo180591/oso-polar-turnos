<script lang="ts">
	let { data, form } = $props();

	let showPassword = $state(false);

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Ingresar | Oso Polar Refrigeración</title>
</svelte:head>

<section class="min-h-screen bg-linear-to-br from-sky-50 via-white to-slate-100 px-4 py-8 text-slate-900 sm:px-6">
	<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
		<div class="w-full rounded-4xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
			<div class="mb-8 text-center">
				<img
					src="/brand/logo-circular.jpeg"
					alt="Oso Polar Refrigeración"
					class="mx-auto h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-sky-100"
				/>

				<h1 class="mt-5 text-3xl font-black text-slate-950">
					Panel técnico
				</h1>

				<p class="mt-2 text-sm font-semibold text-slate-500">
					Ingresá para administrar turnos, clientes y servicios.
				</p>
			</div>

			{#if form?.message}
				<div class="mb-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
					{form.message}
				</div>
			{/if}

			<form method="POST" class="grid gap-4">
				<input type="hidden" name="redirectTo" value={data.redirectTo} />

				<div>
					<label for="email" class="text-sm font-bold text-slate-700">
						Email
					</label>

					<input
						id="email"
						name="email"
						type="email"
						required
						autocomplete="email"
						value={form?.email ?? ''}
						placeholder="admin@osopolar.com"
						class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
					/>
				</div>

				<div>
					<label for="password" class="text-sm font-bold text-slate-700">
						Contraseña
					</label>

					<div class="relative">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							required
							autocomplete="current-password"
							placeholder="Tu contraseña"
							class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
						/>

						<button
							type="button"
							onclick={togglePassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
							aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						>
							{#if showPassword}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
								</svg>
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<button
					type="submit"
					class="mt-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
				>
					Ingresar
				</button>
			</form>

			<div class="mt-6 rounded-3xl bg-slate-50 p-4 text-center">
				<a href="/" class="text-sm font-bold text-slate-600 hover:text-sky-700">
					Volver al inicio
				</a>
			</div>
		</div>
	</div>
</section>