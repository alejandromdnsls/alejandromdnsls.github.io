/**
 * Pyramidev's development process, in four steps. Source for the "Cómo trabajamos"
 * section of the home page.
 */
export interface ProcessStep {
  title: string;
  text: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  { title: 'Entender', text: 'Platicamos con quienes operan el proceso hoy. Vemos cómo se hace, dónde se pierde tiempo y qué no puede fallar.' },
  { title: 'Proponer', text: 'Te entregamos un alcance por etapas, con tiempos y costo para cada una. Empezamos por lo que más valor da.' },
  { title: 'Construir', text: 'Entregamos por etapas, para que puedas probar cada avance con tu equipo y corregir a tiempo.' },
  { title: 'Acompañar', text: 'Ponemos el sistema en operación, capacitamos a tu equipo y seguimos disponibles para soporte y mejoras.' },
];
