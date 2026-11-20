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
 * `cloudflareToken` is the Cloudflare Web Analytics site token (cookieless). When set, the beacon
 * is written inert and loads only after the visitor accepts analytics in the consent banner
 * (components/legal/ConsentBanner.astro); the cookie policy and the privacy notice then list it.
 * Bump COOKIE_POLICY and PRIVACY_NOTICE in data/legal.ts when this changes.
 */
export const ANALYTICS = {
  cloudflareToken: '',
} as const;

/** True when a non-essential tool is configured: the consent banner and «Configurar cookies» render only then. */
export const HAS_NON_ESSENTIAL: boolean = Boolean(ANALYTICS.cloudflareToken);
