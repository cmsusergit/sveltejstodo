<script>
import {page} from '$app/stores'
</script>
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section>
<div class="border">
	<h4>Hello {$page.data.session.user.email}</h4>
</div>
</section>

<style>
div{}
h4{
	color:indigo;
	padding:0em .5em 0em .5em;
}
</style>