<script>
  import {supabase} from '$lib/db' 

  import {onMount} from 'svelte'
  import {leaveBalance,leaveTypeList} from '$lib/../store'
  import Spinner from '$lib/component/spinner.svelte'
  import { createEventDispatcher } from 'svelte'
  import {displayToast} from '$lib/../config'
  import {Popover,Modal} from 'spaper'
  let loading = false,isOpenDlg=false
  export let employee_id=-1
  export let is_editable=true
  
  const dispatch = createEventDispatcher();
  $:{
    if(employee_id)
      fetchLeaveBalanceByEmpId()
  }
  onMount(()=>{
    fetchLeaveTypeList()
    fetchLeaveBalanceByEmpId()
  })
  const fetchLeaveTypeList=async()=>{
    let {data,error}=await supabase.from("Leavetype").select('*')
    if(error){
      alert(JSON.stringify(Error))
    }
    $leaveTypeList=data
  }
  const fetchLeaveBalanceByEmpId=async()=>{
    loading=true
    let {data,error}=await supabase.from("Leavebalance").select('*,Employee!inner(id)').eq('Employee.id',employee_id)
    if(error){
      alert(JSON.stringify(error))
    }
    $leaveBalance=[]
    if($leaveTypeList){
      $leaveTypeList.forEach(leaveType=>{
          if(leaveType.is_credit_required==true){
            const dt=data?.find(ob=>ob.leave_type==leaveType.id)
            $leaveBalance.push(dt)
          }    
      })
    }
    loading=false
  }
  const updateBalance=async()=>{
    loading=true

    await $leaveBalance.map(async(record)=>{
      delete record['Employee']
      const { data, error } = await supabase.from('Leavebalance').update([record]).eq("id",record.id)
      if(error){
        displayToast(JSON.stringify(error),'primary')
        loading=false
        return
      }
    })
    dispatch('set_editable',{value:false})
    loading=false
    displayToast('Added/Updated Record','success')
  }
</script>
<div>
  <div class="border padding-small">
  <table class="padding-small" style="width:100%;text-align:center;">
      
    <tr>
      {#each $leaveTypeList as leaveType}
          {#if leaveType.is_credit_required==true}<th>{leaveType.leave_alias}</th>{/if}
      {/each}
      </tr>
    <tbody>
      <tr>   
      
      
      {#each $leaveBalance as lbRecord}
          <td class="">          
            {#if is_editable}
              <div style="display:flex;justify-content:center;">
                <input bind:value={lbRecord.balance} step="0.5" type="number" min="0" style="width:5em;">
              </div>
            {:else}
              <span>{lbRecord.balance}</span>
            
            {/if}
          </td>        
      {/each}
      {#if is_editable}
        <td width="110">
        <Popover label="Edit" position="top">
          <button on:click={()=>{updateBalance()}} class="btn-secondary" style="padding:0.2em;">
            <svg class="svg-icon" viewBox="0 0 20 20"><path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path></svg></button></Popover>
          
          <Popover label="Close" position="top">
          <button on:click={()=>{dispatch('set_editable',{value:false})}} class="btn-danger" style="padding:0.2em;">
            <svg class="svg-icon" viewBox="0 0 20 20">
							<path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
						</svg>
          </button></Popover>
        </td>
      {/if}
      </tr>
    </tbody>
  </table>  
</div>
</div>
{#if loading}<div><Spinner/></div>{/if}

