import type { PageLoad } from './$types';

export const load = (({ params }) => {
  return {
    timestampEndTime: params.slug
  };
}) satisfies PageLoad;