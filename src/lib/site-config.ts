type Environment = Record<string, string | undefined>;

export function resolveSiteConfig(env: Environment) {
  const deployment =
    env.VERCEL_ENV === 'production'
      ? 'production'
      : env.TURNMATCH_DEPLOYMENT || env.VERCEL_ENV || 'local';
  if (!['local', 'development', 'preview', 'production'].includes(deployment)) {
    throw new Error('TURNMATCH_DEPLOYMENT must be local, preview or production.');
  }
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (deployment === 'production' && !raw) {
    throw new Error('Production requires NEXT_PUBLIC_SITE_URL with your real HTTPS domain.');
  }
  const url = new URL(raw || 'http://localhost:3000');
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== '/'
  ) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path, credentials, query or fragment.',
    );
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (
    deployment === 'production' &&
    (url.protocol !== 'https:' ||
      local ||
      /(?:^|\.)(?:example|invalid|test|localhost)$/.test(url.hostname) ||
      ['example.com', 'example.net', 'example.org'].includes(url.hostname))
  ) {
    throw new Error(
      'Production requires a real public HTTPS origin, not a local or example address.',
    );
  }
  return { origin: url.origin, deployment, indexable: deployment === 'production' };
}
