---
title: SMAC, sistema para gestoría de trámites vehiculares
sector: Servicios
kind: cliente
services: [operacion-integral]
stack: [NestJS, PostgreSQL, Redis, React, Astro]
summary: Sistema que reemplazó las hojas de cálculo de una gestoría de trámites vehiculares, con portal de rastreo para el cliente final y sitio público para cotizar.
seoTitle: "SMAC, sistema para gestoría vehicular | Pyramidev"
seoDescription: "Sistema para una gestoría de trámites vehiculares: panel de operación, portal de rastreo para el cliente final y sitio público para cotizar."
url: https://gestoriasmac.com/
images:
  - src: ../../assets/cases/smac/sitio-inicio.png
    alt: "Página de inicio de gestoriasmac.com con el mensaje «Tu trámite vehicular resuelto, sin complicaciones» y un ejemplo ilustrativo, con datos ficticios, del seguimiento de un trámite paso a paso"
order: 3
featured: true
---

## Reto

La gestoría llevaba sus trámites en hojas de cálculo. Cotizar, dar seguimiento a los plazos y contestar "¿cómo va mi trámite?" consumía tiempo del equipo todos los días.

## Solución

SMAC concentra toda la operación en un solo sistema: un panel para el equipo, un portal de rastreo para el cliente final y el sitio público de la gestoría.

- Más de 30 tipos de trámite configurados, con precios, cotizaciones, órdenes de compra y plazos de servicio (SLA).
- Carga de documentos, incidencias por trámite y agenda de citas.
- Importación masiva de clientes y contactos desde Excel, con una revisión previa que valida cada fila antes de crear nada.
- Avisos por correo electrónico con plantillas; WhatsApp en piloto.
- Portal público de rastreo: el cliente consulta el avance de su trámite con su folio y los últimos 4 dígitos de la placa, sin crear una cuenta.
- Sitio público con la cobertura por estado y cotización por WhatsApp.
- Cuatro roles, verificación en dos pasos y bitácora de auditoría de cambios.
- Más de 1,000 pruebas de extremo a extremo.

## Resultado

El equipo trabaja sobre un solo sistema y el cliente final consulta el estado de su trámite por su cuenta.

<!-- TODO(content): ask for a real outcome metric (for example, fewer status calls per week) before publishing any number. -->
