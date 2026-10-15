import { spawnSync } from 'node:child_process';
import { loadEnvConfig } from '@next/env';
import { resolveSiteConfig } from '../src/lib/site-config';
loadEnvConfig(process.cwd());
const env = { ...process.env, TURNMATCH_DEPLOYMENT: 'production' };
resolveSiteConfig(env);
const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
  stdio: 'inherit',
  env,
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
