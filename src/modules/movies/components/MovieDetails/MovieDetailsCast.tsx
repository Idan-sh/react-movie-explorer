/**
 * MovieDetailsCast Component
 *
 * Horizontal scrollable row of top-billed cast members with profile photos.
 * Shows director credit above the cast row.
 * Receives pre-formatted director and cast with profile URLs — no data transformation.
 */

import { UserIcon } from '@heroicons/react/24/solid';
import type { CastMemberDisplay } from '../../types';
import { ScrollRow } from '@/shared/components';

export interface MovieDetailsCastProps {
  director: string | null;
  cast: CastMemberDisplay[];
}

function CastMemberCard({
  member,
}: {
  member: CastMemberDisplay;
}): React.JSX.Element {
  return (
    <div className="flex w-24 shrink-0 flex-col items-center gap-1.5 text-center">
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
        {cast.map((member) => (
          <CastMemberCard key={member.id} member={member} />
        ))}
      </ScrollRow>
    </div>
  );
}
