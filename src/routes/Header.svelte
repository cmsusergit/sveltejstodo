<script>
import {page} from '$app/stores'

import {supabase} from '$lib/db'
import { goto } from '$app/navigation'
	import {Navbar,Button} from 'spaper'

  const onlogin=(event)=>{
    goto('/')
  }
  const onlogout=async (event)=>{
     try{
        const { error } = await supabase.auth.signOut()
        if (error) throw error
            console.log("****")

      goto('/')
      }catch(error){
        if (error instanceof Error) {
            alert(error.message)
        }
      }
  }
</script>
<header style="margin:1em auto;width:87%;">
<Navbar border={false}>
  <h2 slot="brand">
    <a href="/">Leave Management</a>
  </h2>
  <ul class="inline">
    <li><a href="/employee">Employee</a></li>
    <li><a href="/leavebalance">Leavebalance</a></li>
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



