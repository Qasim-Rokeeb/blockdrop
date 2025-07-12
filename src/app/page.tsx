import { BlockDropGame } from '@/components/block-drop-game';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-primary-foreground bg-clip-text text-transparent bg-gradient-to-b from-white to-purple-400">
          BlockDrop
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The classic block game, on Farcaster.
        </p>
      </div>
      <BlockDropGame />
    </main>
  );
}
