import type { PageLoad } from './$types';
import { scenes } from '$lib/constants';
import { error } from '@sveltejs/kit'; 

export const load = (({ params }) => {
  return {
    matchId: params.slug
  };
}) satisfies PageLoad;