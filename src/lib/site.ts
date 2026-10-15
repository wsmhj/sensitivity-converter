import type { Metadata } from 'next';
import { resolveSiteConfig } from './site-config';
export const site = {
  name: 'Sensitivity Converter',
  title: 'Sensitivity Converter — Free Mouse & DPI Calculator',
  description:
    'Free mouse sensitivity converter for CS2, VALORANT, Fortnite, Apex Legends and more. Match cm/360, convert DPI, check eDPI and save your PC game settings.',
  ...resolveSiteConfig(process.env),
};

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      type: 'website',
      siteName: site.name,
    },
    twitter: { card: 'summary', title: `${title} | ${site.name}`, description },
  };
}
