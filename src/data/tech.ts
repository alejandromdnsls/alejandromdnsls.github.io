import {
  siTypescript, siNodedotjs, siNestjs, siReact, siNextdotjs, siAstro, siDotnet,
  siPostgresql, siRedis, siDocker, siCloudflare, siPython, siRaspberrypi, siN8n, siKubernetes,
} from 'simple-icons';
import aws from '../assets/tech/aws.svg?raw';
import azure from '../assets/tech/azure.svg?raw';

export interface Tech {
  name: string;
  /** simple-icons 24x24 path data */
  path?: string;
  /** Pre-built monochrome inline SVG (icons missing from simple-icons, taken from the legacy site) */
  svg?: string;
  /** The icon already spells the name; keep the text for screen readers only. */
  iconOnly?: boolean;
}

const si = (name: string, icon: { path: string }): Tech => ({ name, path: icon.path });

/** Technologies we work with. Monochrome by design; colors come from the theme, not brand logos. */
export const TECH: Tech[] = [
  si('TypeScript', siTypescript),
  si('Node.js', siNodedotjs),
  si('NestJS', siNestjs),
  si('React', siReact),
  si('Next.js', siNextdotjs),
  si('Astro', siAstro),
  { ...si('.NET', siDotnet), iconOnly: true },
  si('PostgreSQL', siPostgresql),
  si('Redis', siRedis),
  si('Docker', siDocker),
  si('Kubernetes', siKubernetes),
  { name: 'AWS', svg: aws },
  { name: 'Microsoft Azure', svg: azure },
  si('Cloudflare', siCloudflare),
  si('Python', siPython),
  si('Raspberry Pi', siRaspberrypi),
  si('n8n', siN8n),
];
