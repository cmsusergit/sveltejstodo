import { getSupabase } from '@supabase/auth-helpers-sveltekit';
export const load = async (event) => {
	console.log(event);
	const { session } = await getSupabase(event);
	return { session };
};
