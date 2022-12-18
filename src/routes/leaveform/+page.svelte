<script>
import {Form,Select,Input,Button,Toast} from 'spaper'

import {supabase} from '$lib/db' 
import Spinner from '$lib/component/spinner.svelte'

let employeeRecord,isUpdate
let leaveFormRecord,loading=false
</script>
<div>
  <h4>LeaveForm Detail</h4>


   <Form style="margin:0 auto;display:flex;flex-direction:column">
    <form on:submit|preventDefault={onsubmit}>   
      <div class="border">
        <div class="padding-large">
          <Input block placeholder="Employee Name" class="margin-bottom-small" label="Name" required/>
          <div style="display:flex;justify-content:space-between">
            <Input block placeholder="Employee Code" class="margin-bottom-small margin-right-small" label="Employee Code" required/>
            <Select label="Employee Type" class="margin-bottom-small margin-left-small" required>
                <option value="0">Vacational</option>
                <option value="1">NnVacational</option>
                <option value="2">AdHoc</option>
            </Select> 
        </div>
          <div style="display:flex;justify-content:space-between">
            <Input block placeholder="Employee Contact" class="margin-bottom-small margin-right-small" label="Contact" required/>
            <Input block placeholder="Employee Email" class="margin-bottom-small margin-left-small" type="email" label="Email" required/>
          </div>
        </div>
        </div>
        <div class="margin-top-small border" style="padding:.4em;display:flex;flex-direction:row;justify-content:flex-end">
          <Button nativeType="submit" type="secondary" class="margin-top-small margin-right-small">{isUpdate?'Update Record':'Add Record'}</Button>
          <Button on:click={()=>{dispatch('closeDlg')}} type="danger" class="margin-top-small margin-left-small">CLOSE</Button>
        </div>
      </form>
  </Form>

{#if loading}<div><Spinner/></div>{/if}
</div>



