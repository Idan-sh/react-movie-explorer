import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { ROUTES } from '@/shared/constants';
import { NotFoundView } from '@/shared/components';

export function NotFoundPage(): React.JSX.Element {
  const navigate = useNavigate();

  const handleGoHome = useCallback((): void => {
    navigate(ROUTES.HOME, { viewTransition: true });
  }, [navigate]);

  return (
    <NotFoundView
      title="Page not found"
      message="The page you're looking for doesn't exist."
      ctaLabel="Go to Home"
      onCta={handleGoHome}
    />
  );
}
