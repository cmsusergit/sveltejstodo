<script> 
import { supabase } from '$lib/db'

import { onMount } from 'svelte'
import { page } from '$app/stores'
import {Form,Modal,Button,Table} from 'spaper'
import AddTodo from '$lib/component/employee/addrecord.svelte'
let loading = false,isTodoDlg=false
let todos=[]
onMount(()=>{
  fetchTodos()
})

const columnList=[
  {field:'id',label:'ID'},
  {field:'user_id',label:'User'},
  {field:'task',label:'Content'},
  {field:'is_complete',content:(dt)=>dt?'<p style="color:green;margin-top:0px;">Completed</p>':'<p style="color:orange;margin-top:0px;">!Completed</p>',label:'Is Completed?',html:true},
  {field:'inserted_at',content:(dt)=>{return new Date(dt).toLocaleDateString()},
  label:'InsertedAt'}
]
const fetchTodos = async () => {
    let { data, error } = await supabase
      .from("todos")
      .select(`*`)
      .order("id", { ascending: true });
    if (error) {
      alert(error)
      console.error("error", error);
    } else {
      todos = data;
    }
  };
</script>

<div>
  <div class="row flex-edges">
    <h1 class="sm-4 col">Todo</h1>
    <Button on:click={()=>isTodoDlg=true} class="sm-4 col">+New Todo</Button>
</div>
<Modal bind:active={isTodoDlg}
       title="+New Todo" component={AddTodo}>
</Modal>
  <Table columns={columnList} data={todos}/>
</div>
