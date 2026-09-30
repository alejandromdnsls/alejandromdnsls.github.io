---
title: Ticketax, autofacturación para estacionamientos
sector: Estacionamientos
kind: producto
services: [pagos, estacionamientos]
stack: [NestJS, PostgreSQL, Redis, React, Astro, Docker]
summary: Producto propio de Pyramidev para que el cliente de un estacionamiento facture su boleto en México con CFDI 4.0, sin pasar por caja.
url: https://ticketax.com/
images:
  - src: ../../assets/cases/ticketax/sitio-inicio.png
    alt: "Página de inicio de ticketax.com con la propuesta «Del ticket a la factura en 60 segundos» y una ilustración de un ticket de estacionamiento convertido en factura CFDI 4.0"
order: 1
featured: true
---

## Reto

En un estacionamiento, pedir la factura de un boleto suele significar una fila en caja o un correo que nadie contesta. El operador, además, tiene que emitir facturas globales y cuidar los certificados de cada sucursal.

## Solución

Ticketax es un producto de Pyramidev. El cliente final entra a un portal público, sube o captura su boleto y recibe su CFDI 4.0. El operador administra todo desde un panel propio.

- API con 40 módulos, portal público de autofacturación y panel de administración para el operador.
- Bot de WhatsApp para solicitar la factura desde el teléfono.
- Reconocimiento de texto (OCR) en el boleto, con una cola de revisión para los casos que el sistema no puede leer con certeza.
- Facturas globales, integración con un proveedor autorizado de certificación (PAC) y certificados por sucursal.
- Arquitectura multi-operador: cada operador tiene sus sucursales, y hay cuatro roles con permisos distintos.

## Resultado

Un sistema en producción que cubre el ciclo completo de la factura de un boleto, desde la solicitud hasta el timbrado.

<!-- TODO(content): ask for a real outcome metric (for example, invoices issued per month or average time to invoice) before publishing any number. -->
