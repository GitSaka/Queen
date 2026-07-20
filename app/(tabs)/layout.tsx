import TabBar from '@/components/TabBar';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
   <main className="h-[100dvh] overflow-hidden bg-ink flex justify-center">
      <div className="w-full max-w-sm h-full flex flex-col min-h-0 pb-[68px]">
        {children}
      </div>
      <TabBar />
    </main>
  );
}