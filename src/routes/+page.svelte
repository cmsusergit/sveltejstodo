<script>
import { supabase } from '$lib/db'

import {page} from '$app/stores'
import {Badge} from 'spaper'
import { onMount } from 'svelte'
import EmployeeComponent from '$lib/component/employee/list.svelte'
let employeeCount=0,leaveFormCount=0
const fetchEmployeeCount=async ()=>{
	let { data, error } = await supabase
			.rpc('countemployee',{searchby:'emp_name',searchtext:'',dd:'',deptname:''})
		if (error) {

			console.error(error)
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
<div style="display: flex;">
<div class='recordtitle border' style="padding:0px;text-align:center">
	<a href="/employee">
		<h4>Total Employee Records: <Badge>{employeeCount}</Badge></h4>
	</a>
</div>
<div class="recordtitle border" style="padding:0px;text-align:center">	
	<h4>Total Leave Form Records: <Badge>{leaveFormCount}</Badge></h4>
</div>
</div>
<div class="border padding-large">
	<EmployeeComponent/>
</div>
</section>
<style>
.recordtitle{
	background:rgb(244,244,255,1);color:indigo;

	padding:0.2em;
	margin:.5em;width:50%;
}
h4{
	color:indigo;
	padding:0em .5em 0em .5em;
}
</style>