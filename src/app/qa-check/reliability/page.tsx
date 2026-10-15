import { notFound } from 'next/navigation';
import ReliabilityFixture from './fixture';

export default function ReliabilityTest() {
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_QA !== '1') notFound();
  return <ReliabilityFixture />;
}
