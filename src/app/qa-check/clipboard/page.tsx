import { notFound } from 'next/navigation';
import ClipboardFixture from './fixture';
export default function ClipboardTest() {
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_QA !== '1') notFound();
  return <ClipboardFixture />;
}
