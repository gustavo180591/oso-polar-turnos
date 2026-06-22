export type PublicServiceImage = {
	src: string;
	alt: string;
};

export type PublicService = {
	slug: string;
	shortTitle: string;
	title: string;
	kicker: string;
	summary: string;
	description: string[];
	includes: string[];
	checks: string[];
	recommendedWhen: string[];
	images: PublicServiceImage[];
};

export const publicServices: PublicService[] = [
	{
		slug: 'limpieza-aire-acondicionado',
		shortTitle: 'Limpieza',
		title: 'Limpieza de aire acondicionado',
		kicker: 'Más rendimiento, menos olor y mejor calidad de aire',
		summary:
			'Servicio recomendado para mejorar el funcionamiento del aire acondicionado, prevenir pérdidas de agua y eliminar suciedad acumulada.',
		description: [
			'La limpieza de aire acondicionado ayuda a que el equipo trabaje con mejor rendimiento, consuma menos energía y entregue aire más limpio dentro del ambiente.',
			'Con el uso diario, el equipo acumula polvo, humedad y suciedad en filtros, turbina, evaporador y desagüe. Esto puede generar malos olores, baja potencia, ruidos o pérdidas de agua.',
			'Oso Polar realiza una revisión general del equipo y una limpieza cuidadosa de las zonas principales para dejarlo funcionando de manera más eficiente.'
		],
		includes: [
			'Limpieza de filtros.',
			'Limpieza exterior del equipo.',
			'Revisión y limpieza del evaporador.',
			'Limpieza de turbina según el estado del equipo.',
			'Revisión del drenaje de agua.',
			'Control de funcionamiento frío/calor según corresponda.',
			'Prueba final del equipo.'
		],
		checks: [
			'Se revisa si el equipo enfría correctamente.',
			'Se controla si hay pérdidas de agua.',
			'Se observa el estado general de filtros y turbina.',
			'Se verifica que el desagüe no esté obstruido.',
			'Se revisan ruidos o vibraciones anormales.'
		],
		recommendedWhen: [
			'El aire tira poco frío.',
			'El equipo tiene mal olor.',
			'Pierde agua hacia adentro.',
			'Hace ruido al funcionar.',
			'Hace mucho tiempo no se realiza mantenimiento.',
			'Se usa todos los días o en ambientes con polvo.'
		],
		images: [
			{
				src: '/services/limpieza-aire-1.jpeg',
				alt: 'Limpieza de aire acondicionado por Oso Polar'
			},
			{
				src: '/services/limpieza-aire-2.jpeg',
				alt: 'Trabajo de limpieza y mantenimiento de aire acondicionado'
			},
			{
				src: '/services/limpieza-aire-3.jpeg',
				alt: 'Servicio técnico de limpieza de aire acondicionado'
			}
		]
	},
	{
		slug: 'mantenimiento-preventivo',
		shortTitle: 'Mantenimiento',
		title: 'Mantenimiento preventivo',
		kicker: 'Prevención para evitar fallas y extender la vida útil del equipo',
		summary:
			'Servicio pensado para revisar el estado general del equipo antes de que aparezcan fallas importantes.',
		description: [
			'El mantenimiento preventivo permite detectar señales de desgaste, suciedad, bajo rendimiento o posibles problemas antes de que el equipo deje de funcionar.',
			'Es ideal para equipos que se usan con frecuencia, hogares con uso intensivo, comercios o clientes que quieren evitar urgencias en temporada alta.',
			'Oso Polar realiza una revisión general, controla el comportamiento del equipo y recomienda acciones necesarias para conservarlo en buen estado.'
		],
		includes: [
			'Revisión general del equipo.',
			'Control de funcionamiento.',
			'Revisión visual de componentes principales.',
			'Limpieza básica según necesidad.',
			'Control de ruidos, vibraciones y rendimiento.',
			'Recomendaciones de uso y cuidado.',
			'Informe del estado del equipo.'
		],
		checks: [
			'Se controla si el equipo responde correctamente.',
			'Se observa el estado de limpieza.',
			'Se revisan posibles pérdidas.',
			'Se detectan ruidos o señales de desgaste.',
			'Se evalúa si requiere reparación o limpieza profunda.'
		],
		recommendedWhen: [
			'Antes de empezar la temporada de calor.',
			'Cuando el equipo se usa todos los días.',
			'Cuando hace mucho no se revisa.',
			'Cuando se quiere evitar una reparación mayor.',
			'Cuando el equipo funciona, pero no como antes.'
		],
		images: [
			{
				src: '/services/mantenimiento-1.jpeg',
				alt: 'Mantenimiento preventivo de equipo de frío'
			},
			{
				src: '/services/mantenimiento-2.jpeg',
				alt: 'Revisión técnica preventiva por Oso Polar'
			},
			{
				src: '/services/mantenimiento-3.jpeg',
				alt: 'Control general de equipo de refrigeración'
			}
		]
	},
	{
		slug: 'reparacion-equipos-frio',
		shortTitle: 'Reparación',
		title: 'Reparación de heladeras, freezers y aires acondicionados',
		kicker: 'Diagnóstico y solución de fallas en equipos de frío',
		summary:
			'Servicio orientado a resolver fallas de funcionamiento en heladeras, freezers, aires acondicionados y otros equipos de refrigeración.',
		description: [
			'Cuando un equipo deja de enfriar, hace ruidos extraños, pierde agua, no enciende o presenta fallas constantes, es importante revisarlo a tiempo.',
			'Oso Polar analiza el problema, identifica la posible causa y comunica al cliente qué trabajo necesita el equipo antes de avanzar con la reparación.',
			'El objetivo es brindar una solución clara, responsable y adecuada al estado real del equipo.'
		],
		includes: [
			'Revisión del problema informado por el cliente.',
			'Diagnóstico técnico inicial.',
			'Control de funcionamiento general.',
			'Revisión de componentes principales.',
			'Explicación de la falla detectada.',
			'Presupuesto o recomendación de reparación.',
			'Prueba del equipo luego del trabajo realizado.'
		],
		checks: [
			'Se verifica si el equipo enciende.',
			'Se controla si enfría correctamente.',
			'Se revisan pérdidas, ruidos o bloqueos.',
			'Se observa el estado general del sistema.',
			'Se evalúa si conviene reparar o realizar otro tipo de intervención.'
		],
		recommendedWhen: [
			'La heladera no enfría.',
			'El freezer no congela.',
			'El aire acondicionado no tira frío.',
			'El equipo pierde agua.',
			'El equipo hace ruido.',
			'El equipo prende y corta rápidamente.',
			'Hay funcionamiento irregular.'
		],
		images: [
			{
				src: '/services/reparacion-1.jpeg',
				alt: 'Reparación de equipo de frío por Oso Polar'
			},
			{
				src: '/services/reparacion-2.jpeg',
				alt: 'Servicio técnico de heladera o freezer'
			},
			{
				src: '/services/reparacion-3.jpeg',
				alt: 'Reparación de aire acondicionado'
			}
		]
	},
	{
		slug: 'diagnostico-tecnico',
		shortTitle: 'Diagnóstico',
		title: 'Diagnóstico técnico',
		kicker: 'Evaluación clara antes de decidir una reparación',
		summary:
			'Servicio para revisar el equipo, detectar la posible falla y orientar al cliente sobre la mejor solución.',
		description: [
			'El diagnóstico técnico es el primer paso cuando no se sabe con exactitud qué problema tiene el equipo.',
			'Oso Polar revisa el funcionamiento, escucha el problema informado por el cliente y analiza los síntomas para determinar qué puede estar fallando.',
			'Luego se informa al cliente qué se encontró, qué opciones existen y cuál sería el próximo paso recomendado.'
		],
		includes: [
			'Revisión inicial del equipo.',
			'Consulta sobre síntomas y antecedentes.',
			'Control de encendido y funcionamiento.',
			'Observación de ruidos, pérdidas o fallas visibles.',
			'Orientación sobre posible reparación.',
			'Recomendación técnica según el estado del equipo.'
		],
		checks: [
			'Se revisa el comportamiento general.',
			'Se identifican síntomas visibles.',
			'Se evalúa si el problema requiere reparación.',
			'Se informa al cliente antes de avanzar con trabajos mayores.'
		],
		recommendedWhen: [
			'No se sabe cuál es la falla.',
			'El equipo funciona de manera irregular.',
			'Se necesita presupuesto antes de reparar.',
			'El equipo presenta más de un síntoma.',
			'Se quiere saber si conviene reparar.'
		],
		images: [
			{
				src: '/services/diagnostico-1.jpeg',
				alt: 'Diagnóstico técnico de equipo de refrigeración'
			},
			{
				src: '/services/diagnostico-2.jpeg',
				alt: 'Evaluación técnica por Oso Polar'
			},
			{
				src: '/services/diagnostico-3.jpeg',
				alt: 'Revisión de equipo de frío'
			}
		]
	}
];
