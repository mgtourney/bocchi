import type { PageLoad } from './$types';

export const load = (({ params }) => {
  return {
    matchId: params.slug
  };
}) satisfies PageLoad;