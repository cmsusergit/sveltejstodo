<script>
import {supabase} from '$lib/db'  

import EmployeeComponent from '$lib/component/employee/list.svelte'
import {leaveTypeList} from '$lib/../store'
import {onMount} from 'svelte'
import LeavebalanceComponent from '$lib/component/leaveform/leavebalance.svelte'
import {Popover,Modal} from 'spaper'
let currEmployee,is_editable=false
let isOpenDlg=false
onMount(()=>{fetchLeaveTypeList();})


const addLeaveBalance=async()=>{
  let { data, error } = await supabase
  .rpc('updateleavebalance1', {
    emptype:0, 
    flag:true, 
    ltype:1, 
    value:0.0
  })
  if(error){
    alert(JSON.stringify(error))
    return
  }

  alert("BatchUpdate Done")
}
const resetLeaveBalance=()=>{}
const fetchLeaveTypeList=async()=>{
    if($leaveTypeList && $leaveTypeList.length>0)return;
    let {data,error}=await supabase.from("Leavetype").select('*')
    if(error){
      alert(JSON.stringify(Error))
    }
    $leaveTypeList=data
}
</script>
<svelte:head>
	<title>LeaveBalance</title>
</svelte:head>
<div>
  <h4> 
    Leavebalance Detail
  </h4>
    {#if currEmployee} 
      <LeavebalanceComponent on:set_editable={(ee)=>{is_editable=ee.detail.value}} employee_id={currEmployee.id} is_editable={is_editable}/>
    {/if}
    <div style="margin-right:1em;padding:1em;width:100%;display:flex;justify-content:end;">
      <button on:click={()=>{isOpenDlg=true}} style="width:10em;" class="btn-primary">Batch Update</button>
    </div>
    <EmployeeComponent let:currRecord={record}>    
    <Popover label="Veiw Balance" position="left">    
      <button on:click={()=>{currEmployee=record;is_editable=false;}} class='btn-secondary' style="padding:0.2em;"><svg class="svg-icon" viewBox="0 0 20 20">
							<path d="M8.627,7.885C8.499,8.388,7.873,8.101,8.13,8.177L4.12,7.143c-0.218-0.057-0.351-0.28-0.293-0.498c0.057-0.218,0.279-0.351,0.497-0.294l4.011,1.037C8.552,7.444,8.685,7.667,8.627,7.885 M8.334,10.123L4.323,9.086C4.105,9.031,3.883,9.162,3.826,9.38C3.769,9.598,3.901,9.82,4.12,9.877l4.01,1.037c-0.262-0.062,0.373,0.192,0.497-0.294C8.685,10.401,8.552,10.18,8.334,10.123 M7.131,12.507L4.323,11.78c-0.218-0.057-0.44,0.076-0.497,0.295c-0.057,0.218,0.075,0.439,0.293,0.495l2.809,0.726c-0.265-0.062,0.37,0.193,0.495-0.293C7.48,12.784,7.35,12.562,7.131,12.507M18.159,3.677v10.701c0,0.186-0.126,0.348-0.306,0.393l-7.755,1.948c-0.07,0.016-0.134,0.016-0.204,0l-7.748-1.948c-0.179-0.045-0.306-0.207-0.306-0.393V3.677c0-0.267,0.249-0.461,0.509-0.396l7.646,1.921l7.654-1.921C17.91,3.216,18.159,3.41,18.159,3.677 M9.589,5.939L2.656,4.203v9.857l6.933,1.737V5.939z M17.344,4.203l-6.939,1.736v9.859l6.939-1.737V4.203z M16.168,6.645c-0.058-0.218-0.279-0.351-0.498-0.294l-4.011,1.037c-0.218,0.057-0.351,0.28-0.293,0.498c0.128,0.503,0.755,0.216,0.498,0.292l4.009-1.034C16.092,7.085,16.225,6.863,16.168,6.645 M16.168,9.38c-0.058-0.218-0.279-0.349-0.498-0.294l-4.011,1.036c-0.218,0.057-0.351,0.279-0.293,0.498c0.124,0.486,0.759,0.232,0.498,0.294l4.009-1.037C16.092,9.82,16.225,9.598,16.168,9.38 M14.963,12.385c-0.055-0.219-0.276-0.35-0.495-0.294l-2.809,0.726c-0.218,0.056-0.351,0.279-0.293,0.496c0.127,0.506,0.755,0.218,0.498,0.293l2.807-0.723C14.89,12.825,15.021,12.603,14.963,12.385"></path>
						</svg></button>
      </Popover>  
    <Popover label="Edit Balance" position="top">           
    <button on:click={()=>{currEmployee=record;is_editable=true;}} class='btn-success' style="padding:0.2em;"><svg class="svg-icon" viewBox="0 0 20 20">
							<path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
						</svg></button>
      </Popover>

   </EmployeeComponent>
</div>
<Modal bind:active={isOpenDlg} title="Batch Update">

  <div style="width:20em;padding:10px;">
    <div>
      <div  class="border padding-small">
        <div style="display:flex;justify-content:space-around;" >
          <div>
            <label for="leavetype">Leave Type</label>
            <select id="leavetype">      
              {#each $leaveTypeList as leaveType}
                <option value={leaveType.id}>{leaveType.leave_type}</option>
              
              {/each}
            </select>
          </div>
          <div>
            <label for="leavetype">Leave Type</label>
            <select id="leavetype">      
              {#each $leaveTypeList as leaveType}
                <option value={leaveType.id}>{leaveType.leave_type}</option>
              {/each}
            </select>
          </div>
        </div> 
        <div style="margin-top:.4em;padding:10px;">
              <label for="leavebalance">Leave Balance</label>
              <input style="width:100%;" type="number">



        </div>
      </div>
      <div style="margin-top:.2em;display:flex;justify-content:end;padding:.1em;">
        <button on:click={addLeaveBalance} type="button" style="margin-right:5px;width:50%;">+Add</button>
        <button on:click={resetLeaveBalance} type="button" style="margin-right:5px;width:50%;">Reset</button>
      </div>
    </div>  
  </div>
</Modal>



