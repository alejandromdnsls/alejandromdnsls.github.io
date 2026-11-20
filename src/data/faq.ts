/**
 * Home FAQ and the risk-reducer line next to the main CTA.
 *
 * Copy is plain es-MX in the site's «tú» register. Alignment rule: each answer declares the
 * facts it uses (figures, named options, legal entity, key commitments), each one tied to a
 * key of `templates/data/terms.json` (the source of truth for Pyramidev services, in the
 * private workspace) or to a repository file. `src/data/faq.test.mjs` checks that every fact
 * equals its source, that it appears in the answer, and that every number in an answer is a
 * declared fact. To change an answer, change the source of truth first.
 *
 * TODO(content): terms.json does not say explicitly that development is quoted at a fixed
 * price per stage, so no answer says «precio fijo». Add an explicit term before claiming it.
 * TODO(content): contracts may also be issued by the owner's persona física (issuer
 * decision 2026-10-01); the signer answer names only the legal representative.
 */

export const TERMS_FILE = 'templates/data/terms.json';

export interface FaqFact {
  /** Repository-relative file the fact comes from. */
  source: string;
  /** Dotted key inside terms.json (array indexes and `length` allowed); only for terms.json. */
  key?: string;
  /** Numbers must equal the source value; text must be contained in it. */
  value: string | number;
  /** How the fact reads in the answer when it differs from `value` (e.g. a conjugated verb). */
  shown?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  facts: FaqFact[];
}

const HOME = 'web/src/pages/index.astro';
const CONTACT_PAGE = 'web/src/pages/contacto.astro';
const CTA_BAND = 'web/src/components/CtaBand.astro';
const QUOTE = 'templates/software/cotizacion.html';

const term = (key: string, value: string | number, shown?: string): FaqFact => ({ source: TERMS_FILE, key, value, shown });
const file = (source: string, value: string, shown?: string): FaqFact => ({ source, value, shown });

export const FAQ: FaqItem[] = [
  {
    question: '¿Cobran por proyecto o por hora?',
    answer:
      'Cotizamos por etapas: cada una con su alcance, tiempo y costo. Si algo cambia, te lo cotizamos por escrito con su impacto en costo y en tiempo, y no se hace nada sin tu aprobación por escrito. Después de la entrega, cada cambio se cotiza a la tarifa por hora vigente.',
    facts: [
      file(HOME, 'alcance por etapas, con tiempos y costo para cada una', 'por etapas'),
      term('change_control.rule', 'impacto en costo y en tiempo'),
      term('change_control.rule', 'aprobación por escrito'),
      term('change_options.options.0.description', 'tarifa por hora vigente'),
    ],
  },
  {
    question: '¿De quién es el código al terminar?',
    answer:
      'Tuyo: en desarrollos a la medida, el código fuente y los derechos sobre lo que entregamos pasan a ti al liquidar el pago total. Los componentes y librerías que ya teníamos siguen siendo nuestros y te los licenciamos para usarlos con tu sistema.',
    facts: [
      term('ip.custom', 'En desarrollos a la medida'),
      term('ip.custom', 'el código fuente y los derechos'),
      term('ip.custom', 'liquidado el pago total', 'liquidar el pago total'),
      term('ip.custom', 'componentes y librerías preexistentes', 'componentes y librerías que ya teníamos'),
    ],
  },
  {
    question: '¿Cómo se paga?',
    answer:
      'En dos pagos: 50 % de anticipo al firmar y 50 % cuando aceptas por escrito la entrega final. Cada factura se paga dentro de 15 días naturales desde su emisión, en pesos mexicanos.',
    facts: [
      term('payment.milestones.length', 2, 'dos pagos'),
      term('payment.milestones.0.percent', 50, '50 % de anticipo'),
      term('payment.milestones.0.label', 'Anticipo'),
      term('payment.milestones.0.trigger', 'a la firma', 'al firmar'),
      term('payment.milestones.1.percent', 50, '50 % cuando aceptas'),
      term('payment.milestones.1.trigger', 'aceptación final por escrito', 'aceptas por escrito la entrega final'),
      term('payment.due_days', 15, '15 días naturales'),
      term('currency.name', 'pesos mexicanos'),
    ],
  },
  {
    question: '¿Cómo se manejan los tiempos y las entregas?',
    answer:
      'Entregamos por etapas para que pruebes cada avance con tu equipo, y tienes 5 días hábiles para revisar cada hito. Cada pago depende de tu aceptación por escrito, no de una fecha del calendario. Si la información, los accesos o las aprobaciones de tu lado se retrasan, las fechas se recorren día por día sin cambio en el precio.',
    facts: [
      file(HOME, 'Entregamos por etapas'),
      term('acceptance.review_days', 5, '5 días hábiles'),
      term('acceptance.rule', 'fecha del calendario'),
      term('delays.client_caused', 'día por día sin cambio en el precio'),
    ],
  },
  {
    question: '¿Qué garantía y soporte hay después de la entrega?',
    answer:
      'Tienes 90 días naturales de garantía desde la aceptación final para corregir defectos frente al alcance aceptado; no incluye funciones nuevas ni cambios de alcance. Después eliges cómo seguir: cotización por cambio, bolsa de horas prepagada o plan de soporte mensual.',
    facts: [
      term('warranty.days', 90, '90 días naturales'),
      file(QUOTE, 'posteriores a la aceptación final', 'desde la aceptación final'),
      term('warranty.coverage', 'frente al alcance aceptado'),
      term('warranty.exclusions', 'cambios de alcance'),
      term('change_options.options.0.name', 'Cotización por cambio'),
      term('change_options.options.1.name', 'Bolsa de horas prepagada'),
      term('change_options.options.2.name', 'Plan de soporte'),
      term('support_plan_rules.billing', 'mensuales', 'mensual'),
    ],
  },
  {
    question: '¿Firman un acuerdo de confidencialidad (NDA)?',
    answer:
      'Sí. Tratamos la información de tu proyecto como confidencial y, si necesitas un acuerdo de confidencialidad (NDA) antes de platicar, pídelo en tu mensaje. Por lo mismo, no publicamos el nombre de todos nuestros clientes.',
    facts: [
      file(CONTACT_PAGE, 'Tratamos la información de tu proyecto como confidencial'),
      file(CONTACT_PAGE, 'acuerdo de confidencialidad antes de platicar, pídelo en tu mensaje', 'pídelo en tu mensaje'),
      term('confidentiality.reference', 'acuerdo de confidencialidad (NDA)'),
      file(HOME, 'no publicamos el nombre de todos nuestros clientes'),
    ],
  },
  {
    question: '¿Cómo empieza un proyecto?',
    answer:
      'Con una llamada: platicamos con quienes operan el proceso hoy y te proponemos un plan de trabajo con alcance y tiempos. La cotización tiene vigencia de 15 días naturales y el proyecto arranca con el anticipo, al firmar.',
    facts: [
      file(HOME, 'Platicamos con quienes operan el proceso hoy'),
      file(CTA_BAND, 'te proponemos un plan de trabajo con alcance y tiempos'),
      term('quote.validity_days', 15, '15 días naturales'),
      term('payment.milestones.0.label', 'Anticipo'),
      term('payment.milestones.0.trigger', 'a la firma', 'al firmar'),
    ],
  },
  {
    question: '¿Quién firma por Pyramidev?',
    answer: 'Las cotizaciones y los contratos los firma Daniel Alberto del Valle Armas, Representante Legal.',
    facts: [term('issuer.legal_representative.full', 'Daniel Alberto del Valle Armas, Representante Legal')],
  },
];

/** Risk reducer shown next to the main CTA of the home page. */
export const RISK_REDUCER: { text: string; facts: FaqFact[] } = {
  text: 'Cotizamos por etapas, cada pago depende de tu aceptación por escrito y el código es tuyo al liquidar el pago total.',
  facts: [
    file(HOME, 'alcance por etapas', 'por etapas'),
    term('acceptance.rule', 'Cada hito de pago queda ligado a una aceptación', 'cada pago depende de tu aceptación'),
    term('acceptance.rule', 'por escrito'),
    term('ip.custom', 'liquidado el pago total', 'liquidar el pago total'),
  ],
};

export const faqPageJsonLd = (items: FaqItem[] = FAQ): Record<string, unknown> => ({
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});
