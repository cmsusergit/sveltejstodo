<script>
import {page} from '$app/stores'

import {supabase} from '$lib/db'
import { goto } from '$app/navigation'
	import {Navbar,Button} from 'spaper'

  const onlogin=(event)=>{
    goto('/auth')
  }
  const onlogout=async (event)=>{
     try{
        const { error } = await supabase.auth.signOut()
        if (error) throw error
            console.log("****")
            goto('/auth')
      }catch(error){
        if (error instanceof Error) {
            alert(error.message)
        }
      }
  }
</script>

<header style="margin:1em auto;width:87%;">
<Navbar>
  <h4 slot="brand">
    <a href="/">Brand</a>
  </h4>
  <ul class="inline">
    <li><a href="/todo">Todo</a></li>
		<li><a href="/about">About</a></li>
    <li>
      {#if !$page?.data?.session}
      <Button on:click={onlogin}> Login</Button>
      {:else}
      <Button on:click={onlogout}>Logout</Button>
      {/if}
    </li>
  </ul>
</Navbar>
</header>

