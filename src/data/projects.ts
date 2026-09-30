import type { ImageMetadata } from 'astro';
import surveys from '../assets/portfolio/project-surveys.jpg';
import gaspre from '../assets/portfolio/project-gaspre.jpg';
import koomkin from '../assets/portfolio/project-koomkin.jpg';
import dva from '../assets/portfolio/project-dva.jpg';
import hotel from '../assets/portfolio/project-hotel.jpg';

export interface OtherProject {
  title: string;
  description: string;
  stack: string[];
  image: ImageMetadata;
  alt: string;
}

// Projects already public on the previous site. Descriptions rewritten; outcome claims dropped.
export const OTHER_PROJECTS: OtherProject[] = [
  {
    title: 'Plataforma de encuestas masivas',
    description:
      'Aplicación web para aplicar una encuesta a 10,000 usuarios durante 21 días, con escala Likert y un panel para consultar y exportar resultados. Desplegada en AWS.',
    stack: ['AWS', 'MongoDB', 'Node.js', 'Angular'],
    image: surveys,
    alt: 'Captura de la plataforma de encuestas y su panel de resultados',
  },
  {
    title: 'GASPRE, monitoreo de precios para gasolineras',
    description:
      'Servicio en línea que reúne los precios de las estaciones de servicio, muestra su evolución en un panel, envía alertas y automatiza la facturación mensual.',
    stack: ['Angular', 'Node.js', 'RDS'],
    image: gaspre,
    alt: 'Captura del panel de GASPRE con precios de estaciones de servicio',
  },
  {
    title: 'Koomkin, PWA y app de ventas',
    description:
      'Migración de una aplicación web a PWA y una app móvil para el equipo de ventas, con llamadas de seguimiento mediante Twilio.',
    stack: ['Angular', 'Node.js', 'Ionic'],
    image: koomkin,
    alt: 'Captura de la aplicación de ventas de Koomkin',
  },
  {
    title: 'DVA Bienes Raíces, portal inmobiliario',
    description:
      'Sitio en WordPress para consultar propiedades con filtros por estado, municipio, precio y recámaras, y agendar visitas.',
    stack: ['WordPress', 'PHP', 'MySQL'],
    image: dva,
    alt: 'Captura del portal inmobiliario de DVA Bienes Raíces',
  },
  {
    title: 'Hotel Playa Azul Catemaco, reservaciones en línea',
    description:
      'Sitio en WordPress administrable por el propio hotel, con motor de reservaciones, calendario, cupones y pago con tarjeta mediante Stripe.',
    stack: ['WordPress', 'Stripe'],
    image: hotel,
    alt: 'Captura del sitio de reservaciones del Hotel Playa Azul Catemaco',
  },
];
