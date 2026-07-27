// Skeleton de carga instantánea mientras se renderiza el dashboard
// Aparece en navegación entre subpáginas para feedback inmediato
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#07070b] text-white flex">
      {/* Skeleton sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-white/10 bg-[#0a0a14] p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-lg skeleton" />
          <div className="w-20 h-4 skeleton" />
        </div>
        <div className="space-y-2 flex-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 rounded-xl skeleton" />
          ))}
        </div>
      </aside>

      {/* Skeleton main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Skeleton header mobile */}
        <header className="lg:hidden border-b border-white/10 bg-[#0a0a14] sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg skeleton" />
            <div className="w-20 h-4 skeleton" />
          </div>
          <div className="w-12 h-6 rounded-full skeleton" />
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl w-full mx-auto">
          <div className="flex items-center justify-between mb-6 gap-3">
            <div>
              <div className="w-32 h-7 skeleton mb-2" />
              <div className="w-48 h-4 skeleton" />
            </div>
            <div className="w-24 h-9 rounded-md skeleton" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                <div className="h-32 skeleton" />
                <div className="p-4 space-y-3">
                  <div className="w-3/4 h-4 skeleton" />
                  <div className="w-1/2 h-3 skeleton" />
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 rounded-md skeleton" />
                    <div className="w-8 h-8 rounded-md skeleton" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
