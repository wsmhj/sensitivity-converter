import { site } from '@/lib/site';
export default function robots() {
  return site.indexable
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: `${site.origin}/sitemap.xml` }
    : { rules: { userAgent: '*', disallow: '/' } };
}
