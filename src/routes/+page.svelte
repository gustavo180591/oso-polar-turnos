<script lang="ts">
  import { goto } from '$app/navigation';
  
  const projectName = 'Oso Polar Refrigeración';
  
  function navigateToTurno() {
    goto('/solicitar-turno');
  }
  
  function navigateToAdmin() {
    goto('/admin');
  }
</script>

<section class="min-h-screen bg-sky-50 px-6 py-10 text-slate-900">
  <div class="mx-auto max-w-5xl">
    <div class="rounded-3xl bg-white p-8 shadow-xl">
      <span class="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
        Sistema de turnos
      </span>

      <h1 class="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
        {projectName}
      </h1>

      <p class="mt-4 max-w-2xl text-lg text-slate-600">
        Plataforma simple para solicitar turnos de limpieza, mantenimiento y reparación
        de equipos de frío a domicilio.
      </p>

      <div class="mt-8 flex flex-wrap gap-3">
        <button
          onclick={navigateToTurno}
          class="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
        >
          Solicitar turno
        </button>

        <button
          onclick={navigateToAdmin}
          class="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Panel técnico
        </button>
      </div>
    </div>
  </div>
</section>