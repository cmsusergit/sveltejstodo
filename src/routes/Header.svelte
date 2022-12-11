<script>
import { goto } from '$app/navigation'
	import {Navbar,Button} from 'spaper'

  const onlogin=(event)=>{
    goto('/auth')
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
    
      <Button on:click={onlogin}> Login </Button>
    </li>
  </ul>
</Navbar>
</header>
