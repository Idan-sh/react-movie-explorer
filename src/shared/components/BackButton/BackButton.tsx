import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface BackButtonProps {
  onClick: () => void;
  navId?: string;
  isFocused?: boolean;
}

export function BackButton({
  onClick,
  navId,
  isFocused = false,
}: BackButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      tabIndex={-1}
      data-nav-id={navId}
      onClick={onClick}
      className={`
        flex items-center gap-1.5 text-sm font-medium outline-none
        text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
        transition-colors rounded-sm
        ${isFocused ? 'ring-2 ring-primary' : ''}
      `}
    >
      <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
      Back
    </button>
  );
}
