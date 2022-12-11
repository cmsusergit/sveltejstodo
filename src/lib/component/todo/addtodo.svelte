<script>
import { supabase } from '$lib/db'

import { page } from '$app/stores'
import {Form,Input,Button,Table} from 'spaper'

let todo={
  user_id:$page.data.session.user.id,task:'',is_complete:false, inserted_at:new Date()
}
const addtodo=async()=>{



  const { data, error } = await supabase
  .from('todos')
  .insert([
    todo,
  ])

  if(error)
    alert(error)
 }
</script>

<div style="width:100%;font-size:100%;">  
   <Form style="margin:0 auto;width:80%;" >
    <Input block bind:value={todo.task} placeholder="Todo Text" class="margin-bottom-small" label="Todo Content"/>
    <div>
      <Button on:click={addtodo} type="submit" class="margin-top-small">
        +Todo
      </Button>
    </div>
  </Form>
</div>



