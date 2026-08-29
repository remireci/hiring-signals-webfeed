export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl px-8 py-10 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Reciproque
          </h1>

          <p className="mt-2 text-sm text-zinc-500">Hiring Signals Webfeed</p>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-zinc-900">
              This is not your personal feed
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Your personal Hiring Signals feed is available through the link
              you received by email.
            </p>

            <p className="mt-4 text-sm leading-6 text-zinc-600">
              Please use that link to access your feed.
            </p>
          </div>

          <div className="mt-8 border-t border-zinc-100 pt-6">
            <p className="text-xs text-zinc-500">Can&apos;t find your email?</p>

            <a
              href="mailto:info@reciproque.eu"
              className="mt-1 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
            >
              info@reciproque.eu
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-zinc-400">© Reciproque</p>
      </div>
    </main>
  );
}
