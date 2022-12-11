<script>
import {Article} from 'spaper'

import {page} from '$app/stores'
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section>
{JSON.stringify($page.data)}
  {#if !$page.data.session}
  Hello There
  {:else}
  {$page.data.session}
  
  {/if}
</section>


