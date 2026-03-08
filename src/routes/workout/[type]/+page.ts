import type { PageLoad } from './$types';
import type { WorkoutType } from '$lib/workout';

export const prerender = true;
export const ssr = false;

export function entries() {
  return (['push', 'pull', 'legs'] as WorkoutType[]).map((type) => ({ type }));
}

export const load: PageLoad = ({ params }) => {
  return { type: params.type as WorkoutType };
};
