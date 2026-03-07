export default function Home() {
  return (
    <main className="min-h-screen bg-[#003f88] flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            MKD-CIRT
          </h1>
          <h2 className="text-xl text-blue-200 mb-6">
            BMIS / NIS2 Self-Assessment Platform
          </h2>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Official tool for entities in North Macedonia to determine their
            status and perform self-assessment for compliance with the Law on
            Security of Network and Information Systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div className="bg-white/10 rounded-xl p-6 text-left border border-white/20">
            <h3 className="text-white font-semibold text-lg mb-2">
              🏛️ Essential & Important Entities
            </h3>
            <p className="text-blue-100 text-sm">
              Full 12-domain compliance assessment based on BMIS/NIS2 law requirements.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 text-left border border-white/20">
            <h3 className="text-white font-semibold text-lg mb-2">
              🏢 SME Assessment
            </h3>
            <p className="text-blue-100 text-sm">
              Simplified 6-domain assessment based on ENISA guidelines for small businesses.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-blue-300 text-sm">
            🚧 Platform under development — coming soon
          </p>
          <p className="text-blue-400 text-xs mt-2">
            Powered by MKD-CIRT · North Macedonia
          </p>
        </div>
      </div>
    </main>
  );
}
