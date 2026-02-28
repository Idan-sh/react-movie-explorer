/**
 * MovieDetailsCast Component
 *
 * Horizontal scrollable row of top-billed cast members with profile photos.
 * Shows director credit above the cast row.
 */

import { useRef, useState, useCallback } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import type { TmdbCastMember, TmdbCrewMember } from "../../types";
import { getProfileUrl, getDirector } from "../../utils";
import { CAST } from "../../constants";

interface MovieDetailsCastProps {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

function CastMemberCard({ member }: { member: TmdbCastMember }): React.JSX.Element {
  const profileUrl = getProfileUrl(member.profile_path);

  return (
    <div className="flex w-24 shrink-0 flex-col items-center gap-1.5 text-center">
      {profileUrl ? (
        <img
          src={profileUrl}
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
      <p className="w-full truncate text-xs text-gray-500 dark:text-gray-400">{member.character}</p>
    </div>
  );
}

export function MovieDetailsCast({ cast, crew }: MovieDetailsCastProps): React.JSX.Element | null {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);

  const handleScroll = useCallback((): void => {
    if (!scrollRef.current) return;
    setIsAtStart(scrollRef.current.scrollLeft <= 0);
  }, []);

  if (cast.length === 0) return null;

  const director = getDirector(crew);
  const displayCast = cast.slice(0, CAST.MAX_DISPLAY);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cast</h2>
        {director && (
          <span className="text-sm text-gray-500 dark:text-gray-400">Directed by {director}</span>
        )}
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin"
        >
          {displayCast.map((member) => (
            <CastMemberCard key={member.id} member={member} />
          ))}
        </div>

        <div
          className={`
            pointer-events-none absolute right-0 top-0 h-full w-16
            bg-gradient-to-l from-white dark:from-gray-900
            transition-opacity duration-400 ease-in-out
            ${isAtStart ? "opacity-100" : "opacity-0"}
          `}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
