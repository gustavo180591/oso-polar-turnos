# Oso Polar Refrigeración ❄️

**Plataforma web para solicitar y administrar turnos de servicio técnico de equipos de refrigeración.**

![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

> Sistema desarrollado por [Gustavo Faccendini](https://github.com/gustavo180591) para organizar solicitudes de clientes y trabajo administrativo.

## 🎯 ¿Qué problema resuelve?

Permite que clientes soliciten turnos online para limpieza, mantenimiento y reparación de aires acondicionados, heladeras, freezers y otros equipos. El negocio dispone de un panel interno para consultar, organizar y administrar esas solicitudes.

## ✨ Funcionalidades del código

### Para clientes

- Página pública con información del comercio y acceso a servicios.
- Catálogo de servicios con páginas de detalle.
- Formulario de solicitud de turno con equipo, motivo, fecha, franja horaria y descripción.
- Adjuntos de imágenes o videos para describir el problema.
- Página de confirmación posterior a la solicitud.

### Para administración

- Panel de gestión de turnos y calendario.
- Registro de clientes, equipos y servicios.
- Configuración de horarios y días no laborables.
- Secciones de reportes y administración de servicios públicos.
- Estados de turno modelados en la base de datos.

### Validaciones relevantes

El servidor contempla disponibilidad según horarios y feriados, un límite de solicitudes pendientes por teléfono y validación de archivos adjuntos. En la ruta de solicitud están definidos **hasta 3 archivos**, con límites de **5 MB por imagen** y **20 MB por video**, sujetos a las reglas actuales del servidor.

## 🧱 Stack y arquitectura

- **Web:** SvelteKit 2, Svelte 5, TypeScript y Tailwind CSS 4.
- **Datos:** PostgreSQL y Prisma ORM 7 (adaptador PostgreSQL).
- **Backend:** acciones del servidor de SvelteKit para validar y registrar solicitudes.
- **Organización:** rutas públicas y área `/admin` separadas; modelos para turnos, clientes, equipos, servicios, usuarios, adjuntos y horarios.
- **Infraestructura:** Docker y Docker Compose.

```text
src/routes/solicitar-turno/  Solicitud y validaciones del lado servidor
src/routes/servicios/       Servicios públicos
src/routes/admin/           Administración, calendario y reportes
src/lib/                    Lógica y componentes compartidos
prisma/                     Esquema y migraciones
```

## 🚀 Cómo ejecutar el proyecto en desarrollo

**Requisitos:** Node.js compatible con el proyecto, npm y PostgreSQL.

```bash
git clone https://github.com/gustavo180591/oso-polar-turnos.git
cd oso-polar-turnos
npm ci
```

Definí localmente un archivo `.env` con `DATABASE_URL` hacia una base PostgreSQL de **desarrollo** y las demás variables que requiera tu configuración. No utilices credenciales productivas en entornos compartidos.

```bash
npm run db:generate
npm run db:migrate
npm run dev
```

Para inspeccionar datos locales:

```bash
npm run db:studio
```

**Importante:** una migración o seed puede alterar datos. Revisá su alcance y mantené respaldos antes de ejecutarlo sobre información existente.

## ✅ Validaciones disponibles

```bash
npm run check
npm run lint
npm run build
```

Los scripts anteriores están disponibles en el repositorio; no se afirma que se hayan ejecutado como parte de esta actualización documental.

## 🖼️ Capturas de pantalla

Para completar la presentación del proyecto faltan capturas autorizadas del **formulario de turnos**, el **calendario administrativo** y el **catálogo de servicios**. Deben utilizar datos ficticios y no mostrar teléfonos, domicilios ni material aportado por clientes.

## 🔒 Privacidad y operación

El sistema procesa datos personales y archivos adjuntos. Antes de publicarlo o clonarlo para otro negocio, es necesario revisar autenticación, almacenamiento, configuración de archivos, respaldo y políticas de privacidad. Los archivos subidos por usuarios y los respaldos operativos no deben publicarse en repositorios de código.

---

**Desarrollo:** [Gustavo Faccendini](https://github.com/gustavo180591) · [LinkedIn](https://www.linkedin.com/in/gustavo-faccendini-9a209816b/)
