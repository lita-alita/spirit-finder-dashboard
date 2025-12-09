'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { PropsWithChildren } from 'react';
import { useMemo, useState } from 'react';
import { createQueryClient } from '@/shared/providers/query-client';

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => createQueryClient());
  const devtoolsInitialIsOpen = useMemo(
    () => process.env.NODE_ENV === 'development',
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={devtoolsInitialIsOpen} position="bottom" />
    </QueryClientProvider>
  );
};
