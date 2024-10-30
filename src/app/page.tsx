import { Metadata } from 'next'
import Collect from '@/components/Collect';

const getFrame = (target: string) => ({
  version: '2',
  image: {
    url: 'https://zora.co/api/og-image/post/base:0xd6667637eef1dc3f7088560a84aacf695109eac3/2?v=2&crop=square',
    aspectRatio: '1:1',
  },
  cta: {
    title: 'Collect',
    action: {
      type: 'launch_app_frame',
      target,
    }
  }
});

const BASE_URL = process.env.DEPLOYMENT_URL || process.env.VERCEL_URL;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(): Promise<Metadata> {
  const domain = BASE_URL ? `https://${BASE_URL}` : 'http://localhost:3000';

  return {
    title: `deodad frames v2 mint demo`,
    openGraph: {
      images: "https://zora.co/api/og-image/post/base:0xd6667637eef1dc3f7088560a84aacf695109eac3/2?v=2",
    },
    other: {
      "fc:frame": JSON.stringify(getFrame(domain))
    }
  }
}

export default async function Home() {
  return (
    <Collect />
  );
}
