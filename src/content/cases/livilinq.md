---
title: Livilinq, plataforma para comunidades residenciales
sector: Comunidades residenciales
kind: producto
services: [operacion-integral, quioscos-acceso]
stack: [NestJS, PostgreSQL, React, Python]
summary: Plataforma para administrar condominios y fraccionamientos, con un panel para la administración, una app para cada residente y un equipo de caseta para el acceso vehicular.
seoTitle: "Livilinq, plataforma para fraccionamientos | Pyramidev"
seoDescription: "Plataforma para condominios y fraccionamientos: panel para la administración, app para residentes y equipo de caseta para el acceso vehicular."
url: https://livilinq.com/
images:
  - src: ../../assets/cases/livilinq/web-inicio.png
    alt: "Página de inicio de livilinq.com con el mensaje «La administración de tu residencial, en un solo lugar» y un panel de ejemplo con datos ficticios de cobranza y actividad reciente"
  - src: ../../assets/cases/livilinq/app-pagos.png
    alt: "Pantalla de pagos de la app para residentes de Livilinq con datos ficticios: saldo por pagar, cuotas de mantenimiento y fondo de reserva, y botón para subir comprobante"
  - src: ../../assets/cases/livilinq/app-reservaciones.png
    alt: "Pantalla «Mis reservaciones» de la app para residentes de Livilinq con datos ficticios: próximas reservaciones del salón de usos múltiples y del área de asadores"
order: 2
featured: true
---

## Reto

Administrar un condominio o un fraccionamiento implica cobrar cuotas, registrar visitas, coordinar rondines de vigilancia, atender emergencias y controlar quién entra en vehículo. Normalmente esto vive en chats, hojas de cálculo y libretas.

## Solución

Livilinq junta esa operación en una sola plataforma, con dos experiencias: un panel para quien administra y una app para quien vive ahí.

- Panel web para la mesa directiva y la administración: cuotas, estados de cuenta, morosos y convenios de pago, caseta, rondines y comités que validan lo que la administración reporta.
- App para residentes: pases QR para visitas, reservaciones de amenidades, comunicados y reportes de incidentes o emergencias.
- Treinta módulos en cuatro grupos: activos, seguridad y acceso, planificación, y comunicación y gobernanza.
- Equipo de caseta sobre Raspberry Pi para el acceso vehicular: guarda una copia local del padrón, decide sin conexión y se sincroniza con la plataforma.
- Una base de datos por comunidad, y una exportación completa de sus datos en Excel cuando la comunidad la necesita.

## Resultado

Una plataforma disponible en livilinq.com que conecta a residentes, administración y caseta con la misma información.

<!-- TODO(content): ask for a real outcome metric (communities or homes in operation, payments processed) before publishing any number. -->
