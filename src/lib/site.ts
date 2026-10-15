import { resolveSiteConfig } from './site-config';
export const site = {
  name: 'Turnmatch',
  title: 'Sensitivity Converter — CS2, Valorant, DPI & cm/360 | Turnmatch',
  description:
    'Convert mouse sensitivity between supported FPS games, change DPI, and match cm/360. Check the formula and try your setup in a free practice range.',
  ...resolveSiteConfig(process.env),
};
