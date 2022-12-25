<script> 
 import {Form,Select,Input,Button,Toast} from 'spaper'

import LeavebalanceComponent from '$lib/component/leaveform/leavebalance.svelte'
import {page} from '$app/stores'
import { onMount } from 'svelte'
import {supabase} from '$lib/db' 
import {displayToast} from '$lib/../config'
import Spinner from '$lib/component/spinner.svelte'
import {goto} from '$app/navigation'
let employeeRecord
let leaveTypeList=[],isUpdate=false

let leaveFormRecord,loading=false
$:{
    if(leaveFormRecord && leaveFormRecord.from_dt)calculateTotalDay()
    if(leaveFormRecord && leaveFormRecord.to_dt)calculateTotalDay()
}
onMount(()=>{
  const empId=$page.url.searchParams.get('id')
  const update_id=$page.url.searchParams.get('update_id')
  if(!update_id)
  {    
      leaveFormRecord={
        employee_id:employeeRecord?.id,
        leave_type:0,
        from_dt:'',
        to_dt:'',
        total:0,
        reason:'',
        is_full:true,done_by:$page.data.session.user?$page.data.session.user.id:0,
        half_leave_type:'1st'
    }
  }
  else{
    fetchLeaveformById(update_id)
    isUpdate=true
  }
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
      if(leaveFormRecord)
        leaveFormRecord.employee_id=employeeRecord.id
    }
    loading=false
}
const fetchLeaveformById=async(id)=>{
  loading=true
  let { data, error } = await supabase.from('Leaveform').select('*').eq('id',id)
		if (error) {
      alert(JSON.stringify(error))
			console.error(error)
    }
    else{
      leaveFormRecord=data[0]
    }
    loading=false
}



const addRecord=async()=>{
  loading=true
  if(!leaveFormRecord)return;
  const { data, error } = await supabase
  .from('Leaveform')
  .insert([leaveFormRecord])
  if(error){
    alert(JSON.stringify(error))
  }
  else{
    const {lbDt,lbError}=await supabase.from('Leavebalance')
    displayToast('Added/Updated Record','success')
    if(!isUpdate)goto('/')
  }
  loading=false
}
const updateRecord=async()=>{
  if(!leaveFormRecord)return;
  const { data, error } = await supabase.from('Leaveform').update([leaveFormRecord]).eq("id",leaveFormRecord.id)
  if(error){
    alert(JSON.stringify(error))
  }
  else{
    displayToast('Added/Updated Record','success')
    if(!isUpdate)goto('/')
    else goto('/leaveform')

  }
}
const onsubmit=()=>{
  if(!isUpdate){
    addRecord()
  }
  else{

    updateRecord()
  }
}
const calculateTotalDay=()=>{
  if(!leaveFormRecord || !leaveFormRecord.from_dt || !leaveFormRecord.to_dt)return
  const from_Dt=new Date(leaveFormRecord.from_dt)
  const to_Dt=new Date(leaveFormRecord.to_dt)
  const diff=to_Dt.getTime()-from_Dt.getTime()
  const total=(diff/(1000*60*60*24))+1  
  leaveFormRecord.total=(leaveFormRecord.is_full==true)?total:(total-0.5)
}
</script>
<div>
{#if employeeRecord}
  <h4>LeaveForm Detail For Employee: {employeeRecord.emp_name} ({employeeRecord.id})</h4>
{/if}

{#if employeeRecord && leaveFormRecord}   
<LeavebalanceComponent employee_id={employeeRecord.id}></LeavebalanceComponent>
<Form style="margin:.8em auto;display:flex;flex-direction:column">
  <form on:submit|preventDefault={onsubmit}>   
    <div class="border">
      <div class="padding-large">
        <Select bind:value={leaveFormRecord.leave_type} style="width:100%;" label="Leave Type" class="margin-bottom-small" required>
            {#each leaveTypeList as leaveType}                
              <option value={leaveType.id}>{leaveType.leave_type} ({leaveType.leave_alias})</option>
            {/each}
        </Select> 
        <div style="display:flex;justify-content:space-between">
            <Input bind:value={leaveFormRecord.from_dt} block type="date" class="margin-bottom-small" label="From Date" required/>
            <div class=" margin-left-small"></div>
            <Input bind:value={leaveFormRecord.to_dt} block type="date" class="margin-bottom-small" label="To Date" required/>
        </div>
        <div style="display:flex;justify-content:space-between">
          <Input bind:value={leaveFormRecord.total} placeholder="Total" style="width:100%;" class="margin-bottom-small" label="Total Days" disabled required/>
          <div class=" margin-left-small"></div>            
          <Select bind:value={leaveFormRecord.is_full} style="width:100px;" label="Full/Half" class="margin-bottom-small" required>              
              <option value={true}>Full</option>
              <option value={false}>Half</option>
          </Select> 
          {#if leaveFormRecord.is_full==false}
            <div class=" margin-left-small"></div>
            <Select bind:value={leaveFormRecord.half_leave_type} block placeholder="Full/Half" class="margin-bottom-small" type="text" label="First/Second" required>
              <option value="1st">First Half - 1st</option>
              <option value="2nd">Second Half - 2nd</option>
            </Select>
          {/if}
        </div>
        <div>
        </div> 
        <label for="reason">Reason</label>
        <Input bind:value={leaveFormRecord.reason} block type="textarea" class="margin-bottom-small" id="reason" required/>
      </div>

      </div>
      <div class="margin-top-small border" style="padding:.4em;display:flex;flex-direction:row;justify-content:flex-end">
        <Button nativeType="submit" type="secondary" class="margin-top-small margin-right-small">{isUpdate?'Update Record':'Add Record'}</Button>
        <Button on:click={()=>{!isUpdate?goto("/"):goto("/leaveform")}} type="danger" nativeType="button" class="margin-top-small margin-left-small">CLOSE</Button>
      </div>
    </form>
</Form>
{/if}

{#if loading}<div><Spinner/></div>{/if}
</div>







