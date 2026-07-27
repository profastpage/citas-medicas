// Skeleton instantáneo para /dashboard/[menuId] (editor)
export default function MenuEditorLoading() {
  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      <header className="border-b border-white/10 bg-[#0a0a14] sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-5 h-5 skeleton flex-shrink-0" />
          <div className="min-w-0">
            <div className="w-32 h-4 skeleton mb-1" />
            <div className="w-24 h-3 skeleton" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-8 skeleton" />
          <div className="w-24 h-8 skeleton" />
        </div>
      </header>
      <main className="px-4 sm:px-6 py-6 max-w-[1600px] mx-auto">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="w-48 h-6 skeleton mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-lg" />
            ))}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="w-40 h-6 skeleton mb-5" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 skeleton rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
