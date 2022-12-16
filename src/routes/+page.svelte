<script>
import { supabase } from '$lib/db'

import {page} from '$app/stores'
import {Badge} from 'spaper'
import { onMount } from 'svelte'
let employeeCount=0,leaveFormCount=0
const fetchEmployeeCount=async ()=>{
	let { data, error } = await supabase
			.rpc('countemployee')
		if (error) {
			console.error(error)
			alert(JSON.stringify(error))
		
		}
		else {
			employeeCount=data
		}
}
onMount(()=>{
  fetchEmployeeCount()
})
</script>
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section>
<div class="border">
	<h4>Hello {$page.data.session.user.email}</h4>
</div>
<div style="display: flex;justify-content: space-around;">
<div class='recordtitle'>
	<a href="/employee"><h4>Total Employee Records: <Badge>{employeeCount}</Badge></h4></a>
</div>
<div class="recordtitle">	
	<h4>Total Leave Form Records: <Badge>{leaveFormCount}</Badge></h4>
</div>
</div>
</section>
<style>
.recordtitle{
	background:floralwhite;color:indigo;
	padding:.2em;
	margin:1em;width:50%;
}
h4{
	color:indigo;
	padding:0em .5em 0em .5em;
}
</style>