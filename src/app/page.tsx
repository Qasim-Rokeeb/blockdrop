import { BlockDropGame } from '@/components/block-drop-game';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <div className="text-center mb-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-primary font-headline">
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
