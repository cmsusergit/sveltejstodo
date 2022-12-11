// import { getSupabase } from '@supabase/auth-helpers-sveltekit';
// import { redirect } from '@sveltejs/kit';

// export const load = async (event) => {
// 	const { session, supabaseClient } = await getSupabase(event);

// 	console.log('****', session);
// 	if (!session) {
// 		throw redirect(303, '/');
// 	}
// 	const { data: tableData } = await supabaseClient.from('todos').select('*');
// 	console.log(tableData);
// 	return {
// 		user: session.user,
// 		tableData
// 	};
// };
