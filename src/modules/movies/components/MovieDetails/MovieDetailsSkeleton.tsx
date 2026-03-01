export function MovieDetailsSkeleton(): React.JSX.Element {
  return (
    <div className="animate-pulse">
      <div className="h-48 sm:h-64 rounded-lg bg-gray-200 dark:bg-gray-700 mb-6" />
      <div className="flex items-start gap-6">
        <div className="hidden sm:block w-44 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 aspect-[2/3]" />
        <div className="flex flex-1 flex-col gap-3">
          <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-8 w-36 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex gap-3">
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex w-24 shrink-0 flex-col items-center gap-1.5"
            >
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="aspect-video w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
