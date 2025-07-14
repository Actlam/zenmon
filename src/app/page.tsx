import ZenChat from '@/components/ZenChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 mb-2">
            禅問 - ZenMon
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm">
            内なる智慧との対話
          </p>
        </div>
        
        <ZenChat />
      </div>
    </main>
  );
}
