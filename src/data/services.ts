export interface Service {
  slug: string;
  title: string;
  short: string;
  description: string;
  components: string[];
  /** Case study slugs (src/content/cases) */
  cases: string[];
  /** Headline service: shown first and prominent on home. */
  headline?: boolean;
}

export const SERVICES: Service[] = [
  {
    slug: 'desarrollo-a-medida',
    title: 'Desarrollo de software a la medida',
    short: 'Sistemas web, móviles y de escritorio diseñados para tu proceso, no para el de otra empresa.',
    description:
      'Construimos el software que tu operación necesita cuando lo que hay en el mercado no alcanza. Partimos de tu proceso real, entregamos por etapas y dejamos el sistema documentado y listo para que crezca contigo.',
    components: [
      'Aplicaciones web y móviles para cada rol de tu operación',
      'Sistemas internos que reemplazan hojas de cálculo y procesos manuales',
      'Integración con los sistemas que ya usas: ERP, pagos, facturación, correo',
      'Automatización de tareas repetitivas y flujos de aprobación',
      'Entrega por etapas, con código documentado y soporte posterior',
    ],
    cases: ['smac', 'cobaempak', 'ticketax', 'livilinq'],
    headline: true,
  },
  {
    slug: 'estacionamientos',
    title: 'Sistemas para estacionamientos',
    short: 'Software para operar estacionamientos: boletos, tarifas, cobro, cortes de caja y reportes.',
    description:
      'Sistemas para operadores de estacionamientos públicos y privados. Cubren desde la entrada y salida de vehículos hasta el corte de caja y los reportes que exige la operación y la administración.',
    components: [
      'Control de entradas, salidas y tarifas',
      'Cobro en caja, en quiosco o en línea',
      'Cortes de caja y conciliación',
      'Reportes por turno, sucursal y terminal',
      'Reservación y prepago en línea',
    ],
    cases: ['operador-aeropuerto', 'grupo-aeroportuario', 'ticketax'],
  },
  {
    slug: 'pagos',
    title: 'Integración de pagos y facturación',
    short: 'Cobros con tarjeta (Getnet, BBVA) y en línea, conciliación y facturación electrónica CFDI 4.0.',
    description:
      'Conectamos tu sistema con procesadores de pago, incluidos cobros con tarjeta (Getnet, BBVA), y con el SAT a través de un proveedor autorizado (PAC), para que cada cobro quede registrado, conciliado y, cuando aplica, facturado.',
    components: [
      'Cobro con tarjeta en terminal y en línea con Getnet, BBVA y otros adquirentes',
      'Integración con pasarelas y procesadores de pago',
      'Conciliación automática de cobros',
      'Facturación electrónica CFDI 4.0 y facturas globales',
      'Autofacturación para el cliente final',
      'Manejo de certificados por sucursal',
    ],
    cases: ['ticketax', 'grupo-aeroportuario'],
  },
  {
    slug: 'quioscos-acceso',
    title: 'Quioscos y control de acceso',
    short: 'Software para quioscos de autoservicio y dispositivos de acceso con RFID y barreras.',
    description:
      'Software que conecta la operación con dispositivos físicos: quioscos de autoservicio, lectores, barreras y controladores pequeños. Cuando la operación lo requiere, el dispositivo trabaja sin conexión y se sincroniza con la nube al recuperarla.',
    components: [
      'Quioscos de autoservicio para pago y consulta',
      'Lectores RFID y control de barreras',
      'Dispositivos basados en Raspberry Pi',
      'Operación sin conexión con sincronización a la nube',
      'Administración remota de dispositivos',
    ],
    cases: ['livilinq'],
  },
  {
    slug: 'control-reportes',
    title: 'Gestión de reportes y control',
    short: 'Gestión de reportes oficiales que cuadran al centavo, con permisos por rol y bitácoras que no se pueden alterar.',
    description:
      'La gestión de reportes es el corazón de una operación auditada: cada cifra debe poder explicarse. Construimos reportes que cuadran al centavo contra la base de datos, con permisos por rol, firma digital y registro de cada cambio.',
    components: [
      'Reportes oficiales y conciliaciones con pruebas automatizadas',
      'Permisos por rol (RBAC)',
      'Firma digital de reportes',
      'Bitácora de auditoría a prueba de alteraciones',
      'Reconstrucción de sistemas heredados sin documentación',
    ],
    cases: ['operador-aeropuerto'],
  },
  {
    slug: 'operacion-integral',
    title: 'Sistemas de operación de punta a punta',
    short: 'Sistemas a la medida que reemplazan hojas de cálculo y dan seguimiento al cliente final.',
    description:
      'Sistemas que cubren un proceso completo, desde que entra la solicitud hasta que se cobra, y que permiten al cliente final consultar el avance sin tener que llamar. Incluye ERP a la medida para empresas con procesos propios.',
    components: [
      'Flujos de trabajo, plazos y citas',
      'Notificaciones por WhatsApp y correo',
      'Página de seguimiento para el cliente final',
      'ERP a la medida: cotizaciones, inventario, compras, cobranza',
      'Aplicaciones web y móviles para cada rol',
    ],
    cases: ['smac', 'cobaempak', 'livilinq'],
  },
];

export const PROJECT_TYPES = [...SERVICES.map((s) => s.title), 'Otro'];
