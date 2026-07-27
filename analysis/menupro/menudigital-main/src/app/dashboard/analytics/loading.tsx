// Skeleton instantáneo para /dashboard/analytics
export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      <div className="hidden lg:flex flex-col w-60 border-r border-white/10 bg-[#0a0a14] p-4 flex-shrink-0 fixed inset-y-0 left-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-lg skeleton" />
          <div className="w-20 h-4 skeleton" />
        </div>
        <div className="space-y-2 flex-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 rounded-xl skeleton" />
          ))}
        </div>
      </div>
      <div className="lg:pl-60">
        <header className="lg:hidden border-b border-white/10 bg-[#0a0a14] sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
          <div className="w-9 h-9 rounded-lg skeleton" />
          <div className="w-20 h-4 skeleton" />
          <div className="w-12 h-6 rounded-full skeleton" />
        </header>
        <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
          <div className="w-40 h-7 skeleton mb-3" />
          <div className="w-72 h-4 skeleton mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 h-28 skeleton" />
            ))}
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl h-80 skeleton" />
        </main>
      </div>
    </div>
  );
}
