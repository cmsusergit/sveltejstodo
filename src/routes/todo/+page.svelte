<script>
import { supabase } from '$lib/db'

import { onMount } from 'svelte'
import { page } from '$app/stores'

let loading = false
let todos=[]
onMount(()=>{
  fetchTodos()
})
const fetchTodos = async () => {
    let { data, error } = await supabase
      .from("todos")
      .select(`*`)
      .order("id", { ascending: true });
    if (error) {
      console.log("error", error);
    } else {
      todos = data;
    }
  };
</script>


<div>
  <h1>TODO PAGE</h1>
  {#if !$page.data.session}hello{/if}
  <p>{JSON.stringify(todos)}</p>
</div>