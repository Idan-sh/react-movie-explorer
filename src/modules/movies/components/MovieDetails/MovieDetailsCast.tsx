/**
 * MovieDetailsCast Component
 *
 * Horizontal scrollable row of top-billed cast members with profile photos.
 * Shows director credit above the cast row.
 * Supports keyboard navigation via navId/isFocused on each member card.
 */

import { UserIcon } from '@heroicons/react/24/solid';
import type { CastMemberDisplay } from '../../types';
import { buildNavId, NAV_ID_PREFIX } from '@/core/navigation';
import { ScrollRow } from '@/shared/components';

export interface MovieDetailsCastProps {
  director: string | null;
  cast: CastMemberDisplay[];
  sectionIndex?: number;
  focusedIndex?: number;
}

function CastMemberCard({
  member,
  navId,
  isFocused = false,
}: {
  member: CastMemberDisplay;
  navId?: string;
  isFocused?: boolean;
}): React.JSX.Element {
  return (
    <div
      tabIndex={-1}
      data-nav-id={navId}
      className={`
        flex w-24 shrink-0 flex-col items-center gap-1.5 text-center
        rounded-lg p-1 outline-none transition-all duration-150
        ${isFocused ? 'ring-2 ring-primary scale-105' : ''}
      `}
    >
      {member.profileUrl ? (
        <img
          src={member.profileUrl}
          alt={member.name}
          className="h-24 w-24 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <UserIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <p className="w-full truncate text-xs font-medium text-gray-900 dark:text-white">
        {member.name}
      </p>
      <p className="w-full truncate text-xs text-gray-500 dark:text-gray-400">
        {member.character}
      </p>
    </div>
  );
}

export function MovieDetailsCast({
  director,
  cast,
  sectionIndex = 0,
  focusedIndex = -1,
}: MovieDetailsCastProps): React.JSX.Element | null {
  if (cast.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Cast
        </h2>
        {director && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Directed by {director}
          </span>
        )}
      </div>

      <ScrollRow>
        {cast.map((member, index) => (
          <CastMemberCard
            key={member.id}
            member={member}
            navId={buildNavId(NAV_ID_PREFIX.ITEM, sectionIndex, index)}
            isFocused={index === focusedIndex}
          />
        ))}
      </ScrollRow>
    </div>
  );
}
