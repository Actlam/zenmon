import ZenChat from '@/components/ZenChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 flex flex-col">
      <div className="container mx-auto px-4 py-4 sm:py-8 flex-1 flex flex-col">
        <div className="text-center mb-4 sm:mb-8 flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl font-light text-stone-800 dark:text-stone-200 mb-2">
            禅問 - ZenMon
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm">
            内なる智慧との対話
          </p>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <ZenChat />
        </div>
      </div>
    </main>
  );
}
