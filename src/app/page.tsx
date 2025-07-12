"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

const BlockDropGame = dynamic(
  () => import('@/components/block-drop-game').then(mod => mod.BlockDropGame),
  {
    ssr: false,
    loading: () => <div className="text-center">Loading Game...</div>,
  }
);

export default function Home() {
  const [readyCalled, setReadyCalled] = useState(false);

  useEffect(() => {
    const signalReady = async () => {
      await sdk.actions.ready();
      setReadyCalled(true);
    };
    if (!readyCalled) {
      signalReady();
    }
  }, [readyCalled]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <BlockDropGame />
    </main>
  );
}