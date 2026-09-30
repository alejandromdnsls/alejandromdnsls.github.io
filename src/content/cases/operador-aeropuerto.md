---
title: Gestión de reportes para un operador de estacionamiento en aeropuerto de México
sector: Aeropuertos
kind: confidencial
services: [control-reportes, estacionamientos]
stack: [Node.js, Fastify, SQL Server, PostgreSQL, React]
summary: "Gestión de reportes oficiales de un estacionamiento de aeropuerto en México: reconstrucción de 32 reportes de estacionamiento a partir de un sistema heredado sin documentación, con conciliación automática y bitácora de auditoría."
order: 5
featured: false
---

## Reto

El operador dependía de un sistema heredado sin documentación. Los reportes oficiales de estacionamiento se generaban con procesos que nadie podía explicar del todo, y las cifras tenían que cuadrar al centavo.

## Solución

Leímos la base de datos existente para entender cómo se calculaba cada cifra y reconstruimos los reportes en un sistema nuevo.

- 32 reportes oficiales reconstruidos a partir de la base de datos existente (SQL Server, solo lectura).
- Pruebas automatizadas de conciliación para cada reporte, con exactitud al centavo.
- Permisos por rol (RBAC) y firma digital de los reportes.
- Bitácora de auditoría a prueba de alteraciones.
- Operación en tres terminales del aeropuerto.

## Resultado

Reportes que se pueden explicar, repetir y auditar, sobre un sistema nuevo que no depende del conocimiento informal de nadie.

<!-- TODO(content): ask for a real outcome metric (for example, time to close the month before and after) before publishing any number. -->
