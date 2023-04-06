import type { PageLoad } from './$types';
import { scenes, settings, subScenes } from '$lib/constants';
import { error } from '@sveltejs/kit'; 

export const load = (({ params }) => {
  let data;
  scenes.forEach((e) => {
    if (e.id === params.slug) {
      data = e;
    }
  })

  settings.forEach((e) => {
    if (e.id === params.slug) {
      data = e;
    }
  })

  subScenes.forEach(e => {
    if (e.id === params.slug) {
      data = e;
    }
  });

  if (!data) {
    return error(404, 'Not found');
  }

  return {
    path: data.id
  };
  
}) satisfies PageLoad;