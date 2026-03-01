/**
 * NotFoundView Component
 *
 * Reusable "not found" layout with icon, title, message, and action buttons.
 */

import { FilmIcon } from '@heroicons/react/24/outline';

interface NotFoundViewProps {
  title: string;
  message: string;
  ctaLabel: string;
  onCta: () => void;
  onGoBack?: () => void;
}

export function NotFoundView({ title, message, ctaLabel, onCta, onGoBack }: NotFoundViewProps): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <FilmIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
      <div className="flex gap-3">
        {onGoBack && (
          <button
            type="button"
            onClick={onGoBack}
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        )}
        <button
          type="button"
          onClick={onCta}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
