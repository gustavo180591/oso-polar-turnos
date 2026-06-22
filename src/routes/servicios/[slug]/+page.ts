import { error } from '@sveltejs/kit';
import { publicServices } from '$lib/services/public-services';

export function load({ params }) {
	const service = publicServices.find((item) => item.slug === params.slug);

	if (!service) {
		throw error(404, 'Servicio no encontrado');
	}

	return {
		service,
		relatedServices: publicServices.filter((item) => item.slug !== service.slug).slice(0, 3)
	};
}
