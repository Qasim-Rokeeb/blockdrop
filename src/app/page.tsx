"use client";

import dynamic from 'next/dynamic';

const BlockDropGame = dynamic(() => import('@/components/block-drop-game').then(mod => mod.BlockDropGame), {
  ssr: false,
  loading: () => <div className="text-center">Loading Game...</div>,
});


export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <BlockDropGame />
    </main>
  );
}
