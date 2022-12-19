<script>
import {Form,Select,Input,Button,Toast} from 'spaper'

import {page} from '$app/stores'
import { onMount } from 'svelte'
import {supabase} from '$lib/db' 
import Spinner from '$lib/component/spinner.svelte'
import {goto} from '$app/navigation'
let employeeRecord,isUpdate
let leaveTypeList=[]
let leaveFormRecord,loading=false


onMount(()=>{
  const empId=$page.url.searchParams.get('id')
  fetchEmployeeById(empId)
  fetchLeaveType()
})

const fetchLeaveType=async()=>{
  loading=true
  let { data, error } = await supabase
    .from('Leavetype')
    .select('*')
		if (error) {
      alert(JSON.stringify(error))
			console.error(error)
		}
    else{
      leaveTypeList=data
    }
    loading=false
}
const fetchEmployeeById=async(id)=>{
  loading=true
  let { data, error } = await supabase
    .from('Employee')
    .select('id,emp_name').eq('id',id)
		if (error) {
      alert(JSON.stringify(error))
			console.error(error)
		}
    else{
      employeeRecord=data[0]
    }
    loading=false
}
const onsubmit=()=>{
}
</script>
<div>{JSON.stringify(leaveTypeList)}
{#if employeeRecord}
  <h4>LeaveForm Detail For Employee: {employeeRecord.emp_name} ({employeeRecord.id})</h4>
{/if}
   <Form style="margin:0 auto;display:flex;flex-direction:column">
    <form on:submit|preventDefault={onsubmit}>   
      <div class="border">
        <div class="padding-large">
          <Select style="width:100%;" label="Leave Type" class="margin-bottom-small" required>
              <option value=""></option>
              {#each leaveTypeList as leaveType}                
                <option value={leaveType.id}>{leaveType.leave_type} ({leaveType.leave_alias})</option>
              {/each}
          </Select> 
          <div style="display:flex;justify-content:space-between">

              <Input block type="date" class="margin-bottom-small" label="From Date" required/>
              <div class=" margin-left-small"></div>
              <Input block type="date" class="margin-bottom-small" label="To Date" required/>
          </div>
          <div style="display:flex;justify-content:space-between">




            <Input  placeholder="Total" style="width:100%;" class="margin-bottom-small" label="Total Days" required/>
            <div class=" margin-left-small"></div>
             <Select style="width:100px;" label="Full/Half" class="margin-bottom-small" required>              
                <option value="true">Full</option>
                <option value="false">Half</option>
            </Select> 
            <div class=" margin-left-small"></div>
            <Select block placeholder="Full/Half" class="margin-bottom-small" type="text" label="First/Second" required>
              <option value="1st">First Half - 1st</option>
              <option value="2nd">Second Half - 2nd</option>
            </Select>
          </div>
        </div>
        </div>
        <div class="margin-top-small border" style="padding:.4em;display:flex;flex-direction:row;justify-content:flex-end">
          <Button nativeType="submit" type="secondary" class="margin-top-small margin-right-small">{isUpdate?'Update Record':'Add Record'}</Button>
          <Button on:click={()=>{goto("/")}} type="danger" nativeType="button" class="margin-top-small margin-left-small">CLOSE</Button>
        </div>
      </form>
  </Form>












{#if loading}<div><Spinner/></div>{/if}
</div>





