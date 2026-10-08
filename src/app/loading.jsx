export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">

        <div className="animate-pulse">

          {/* Heading */}
          <div className="h-8 w-56 rounded-lg bg-gray-200" />

          <div className="mt-3 h-4 w-80 rounded bg-gray-200" />

          {/* Cards */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="h-32 bg-gray-200" />

                  <div className="space-y-3 p-4">
                    <div className="h-5 rounded bg-gray-200" />

                    <div className="h-4 w-2/3 rounded bg-gray-200" />

                    <div className="h-7 w-1/2 rounded bg-gray-200" />
                  </div>
                </div>
              )
            )}
          </div>

        </div>

      </div>
    </main>
  );
}