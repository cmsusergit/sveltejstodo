<script>
  import {supabase} from '$lib/db' 

  import {onMount} from 'svelte'
  import {leaveBalance,leaveTypeList} from '$lib/../store'
  import Spinner from '$lib/component/spinner.svelte'
  let loading = false,isOpenDlg=false
  export let employee_id=-1,is_editable=true
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
</script>
<div>
  <p>{JSON.stringify($leaveBalance)}</p>
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
      </tr>
    </tbody>
  
  </table>
  {#if is_editable}
    <div style="display:flex;justify-content:right;padding-right:5em;padding-top:5px;">
      <button class="padding-right-small btn-secondary">Update</button><button class="margin-left-small btn-danger">Close</button>
    </div>
  {/if}
</div>

</div>
{#if loading}<div><Spinner/></div>{/if}

