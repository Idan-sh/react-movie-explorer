/**
 * AppHeader Component
 *
 * Main application header with branding.
 * Will contain navigation tabs and search in the future.
 */

export function AppHeader(): React.JSX.Element {
  return (
    <header className="shrink-0 bg-white dark:bg-gray-800 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎬 Movie Explorer
        </h1>
      </div>
    </header>
  );
}
