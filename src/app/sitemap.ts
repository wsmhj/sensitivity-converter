import {site} from '@/lib/site';
export default function sitemap(){return ['','/about','/contact','/privacy','/terms'].map(path=>({url:site.origin+path,changeFrequency:'monthly' as const,priority:path?0.4:1}));}
