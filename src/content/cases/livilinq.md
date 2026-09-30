---
title: Livilinq, plataforma para comunidades residenciales
sector: Comunidades residenciales
kind: producto
services: [operacion-integral, quioscos-acceso]
stack: [NestJS, PostgreSQL, React, Python]
summary: Plataforma para administrar fraccionamientos con acceso controlado, con aplicación para residentes, panel de administración y un dispositivo de acceso vehicular.
url: https://livilinq.com/
images:
  - src: ../../assets/cases/livilinq/app-pagos.png
    alt: "Pantalla de estado de cuenta de la aplicación para residentes de Livilinq, con saldo pendiente y lista de cuotas"
  - src: ../../assets/cases/livilinq/app-reservaciones.png
    alt: "Pantalla de reservaciones de amenidades de la aplicación para residentes de Livilinq"
order: 2
featured: true
---


## Reto

Administrar un fraccionamiento implica cobrar cuotas, registrar visitas, coordinar rondines de vigilancia, atender emergencias y controlar quién entra en vehículo. Normalmente esto vive en chats, hojas de cálculo y libretas.

## Solución

Livilinq junta esa operación en una sola plataforma.

- Aplicación web para residentes (PWA) y panel web para la administración.
- Cerca de 45 módulos en el servidor: cuotas y pagos, visitas con código QR, rondines, emergencias, reservaciones de áreas comunes, votaciones e incidencias.
- Dispositivo de acceso vehicular sobre Raspberry Pi, con lector RFID UHF y control de barrera. Funciona sin conexión y se sincroniza con la nube.
- Arquitectura multi-comunidad: cada comunidad tiene su propia base de datos.

## Resultado

Una plataforma que conecta a residentes, administración y caseta de acceso con la misma información.

<!-- TODO(content): ask for a real outcome metric (communities or homes in operation, payments processed) before publishing any number. -->
