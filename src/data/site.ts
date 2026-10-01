/**
 * Site-wide contact and integration config. One place, reused everywhere.
 */

export const SITE_URL = 'https://www.pyramidev.com.mx';

export const CONTACT = {
  email: 'hola@pyramidev.com.mx',
  phone: { display: '+52 55 4535 1951', tel: '+525545351951' },
  // Public WhatsApp number (digits only, country code first).
  whatsapp: { display: '+52 55 4535 1951', number: '525545351951' },
  location: 'CDMX, México',
} as const;

const WHATSAPP_MESSAGE = 'Hola, vengo del sitio de Pyramidev y me gustaría platicar sobre un proyecto.';
export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsapp.number}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

/**
 * TODO(config): paste the booking link (Cal.com, Calendly, etc.).
 * Empty = every "Agenda una llamada" button goes to /contacto.
 */
export const SCHEDULER_URL = '';

/** Destination and link attributes for every "Agenda una llamada" button. */
export const schedulerLink = SCHEDULER_URL
  ? { href: SCHEDULER_URL, target: '_blank', rel: 'noopener' }
  : { href: '/contacto', target: undefined, rel: undefined };

/**
 * TODO(config): analytics. Empty = nothing is rendered.
 * `cloudflareToken` is the Cloudflare Web Analytics site token (cookieless).
 */
export const ANALYTICS = {
  cloudflareToken: '',
} as const;
