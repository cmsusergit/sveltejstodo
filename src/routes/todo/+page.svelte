<script>
import { supabase } from '$lib/db'

import { onMount } from 'svelte'
let todos=[]

onMount(async()=>{
  let { data: todos, error } = await supabase
  .from('todos')
  .select('*')
})
</script>


<div>
  <h1>TODO PAGE</h1>
  <p>{JSON.stringify(todos)}</p>
</div>