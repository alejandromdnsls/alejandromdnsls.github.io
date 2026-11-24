---
title: Ticketax, autofacturación para estacionamientos
sector: Estacionamientos
kind: producto
services: [pagos, estacionamientos, control-reportes]
stack: [NestJS, PostgreSQL, Redis, React, Astro, Docker]
summary: Producto propio de Pyramidev para que el cliente de un estacionamiento facture su boleto con CFDI 4.0, desde un portal o por WhatsApp, sin pasar por caja.
url: https://ticketax.com/
images:
  - src: ../../assets/cases/ticketax/sitio-inicio.png
    alt: "Página de inicio de ticketax.com con el mensaje «Del ticket a la factura en 60 segundos» y una demostración con datos ficticios de un ticket convertido en factura CFDI 4.0"
order: 1
featured: true
---

## Reto

En un estacionamiento, pedir la factura de un boleto suele significar una fila en caja o un correo que nadie contesta. El operador, además, tiene que emitir la factura global de lo que nadie facturó, cuadrar el efectivo de cada sucursal y cuidar los certificados de cada RFC.

## Solución

Ticketax es un producto de Pyramidev con tres canales que comparten la misma información: un portal de autofacturación con el subdominio, el logo y el nombre de cada operador; un bot de WhatsApp, donde el cliente envía la foto de su boleto y recibe el PDF y el XML; y un panel de administración para el operador.

- Reconocimiento de texto (OCR) que lee folio, fecha e importes del boleto, con una cola de revisión para los casos que el sistema no puede leer con certeza.
- Timbrado CFDI 4.0 con un proveedor autorizado de certificación (PAC) y factura global mensual de los boletos que no se facturaron.
- Corte de caja por sucursal y por día: compara el efectivo reportado contra las transacciones del estacionamiento y contra la facturación global.
- Pensiones: el pensionado sube su comprobante de pago desde el celular, el operador lo aprueba o lo rechaza indicando el motivo, y al aprobarlo se emite la factura.
- Importación masiva de boletos desde CSV o Excel, con validación de columnas y detección de duplicados.
- Multi-operador: cada operador factura con su propio RFC, que comparten todas sus sucursales; cuatro roles con permisos distintos y verificación en dos pasos.

## Resultado

Un producto disponible en ticketax.com que cubre el ciclo completo de la factura de un boleto, desde la solicitud hasta el timbrado, y la operación diaria del estacionamiento alrededor de ella.

<!-- TODO(content): ask for a real outcome metric (for example, invoices issued per month or average time to invoice) before publishing any number. -->
