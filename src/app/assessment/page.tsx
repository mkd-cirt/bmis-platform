import Link from "next/link";

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-xs text-blue-300 mb-8">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          Во развој — наскоро достапно
        </div>
        <h1 className="font-display text-5xl font-800 text-white mb-4">
          Самооценување
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          Алатката за самооценување е во развој. Наскоро ќе биде достапна.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-all"
        >
          ← Назад на почетна
        </Link>
      </div>
    </div>
  );
}
