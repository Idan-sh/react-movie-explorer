/**
 * ToggleSwitch Component
 *
 * Labeled toggle switch with accessible role="switch".
 */

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}

export function ToggleSwitch({ enabled, onToggle, label }: ToggleSwitchProps): React.JSX.Element {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`
          relative inline-flex h-5 w-9 shrink-0 items-center rounded-full
          transition-colors duration-150
          ${enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}
        `}
      >
        <span
          className={`
            inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm
            transition-transform duration-150
            ${enabled ? "translate-x-[20px]" : "translate-x-[2px]"}
          `}
        />
      </button>
    </label>
  );
}
