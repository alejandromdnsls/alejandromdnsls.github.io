/**
 * Legal facts of the site, from the workspace site legal kit (templates/legal/sitios/).
 * One place for the versions printed on each legal page and sent by the contact form.
 *
 * Bump a version (and its date) on every change of wording. The contact form sends
 * PRIVACY_NOTICE.version as `aviso_version`, so each submission records the notice the
 * person accepted (registro-consentimientos.md). COOKIE_POLICY.version is the banner's
 * data-policy-version: bumping it asks every visitor again. Changing ANALYTICS in site.ts
 * changes the cookie policy and the privacy notice, so bump both versions with it.
 */

export const PRIVACY_NOTICE = { version: '0.1.0', updated: '5 de noviembre de 2026' } as const;
export const COOKIE_POLICY = { version: '0.1.0', updated: '5 de noviembre de 2026' } as const;
export const TERMS = { version: '0.1.0', updated: '5 de noviembre de 2026' } as const;

/** Law and authority as the kit names them (legal-mx references, verified 2026-11-03). Never the INAI nor the 2010 law. */
export const LAW_NAME =
  'Ley Federal de Protección de Datos Personales en Posesión de los Particulares publicada en el Diario Oficial de la Federación el 20 de marzo de 2025';
export const PRIVACY_AUTHORITY = 'Secretaría Anticorrupción y Buen Gobierno';

/** Form id sent as the hidden `formulario` field. */
export const CONTACT_FORM_ID = 'contacto';

/**
 * Company data shown in the footer and the legal pages (source: templates/data/terms.json `issuer`).
 * The public site shows the domicile without the interior number (workspace CLAUDE.md).
 */
export const COMPANY = {
  legalName: 'Pyramidev Technologies, S.A. de C.V.',
  rfc: 'PTE260206DH3',
  address: 'Juan Cousin 136, Col. Sacramento, Alcaldía Álvaro Obregón, C.P. 01420, Ciudad de México',
} as const;
