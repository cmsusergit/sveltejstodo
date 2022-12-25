<script>
  import {supabase} from '$lib/db' 

  import {onMount} from 'svelte'
  import {leaveBalance,leaveTypeList} from '$lib/../store'
  import Spinner from '$lib/component/spinner.svelte'
  let loading = false,isOpenDlg=false
  export let employee_id=-1
  $:{
    if(employee_id)
      fetchLeaveBalanceByEmpId()
  }

  onMount(()=>{
    fetchLeaveTypeList()
    fetchLeaveBalanceByEmpId()
  })
  const fetchLeaveTypeList=async()=>{
    let {data,error}=await supabase.from("Leavetype").select('*').eq('is_credit_required',true)
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
    $leaveBalance=data
    loading=false
  }
</script>





<div>
  <table class="border padding-small" style="width:100%;text-align:center;">
      <tr>
      {#each $leaveTypeList as leaveType}
          <th>{leaveType.leave_alias}</th>
      {/each}
      </tr>
    <tbody>
      <tr>      

     {#each $leaveTypeList as leaveType}
        <td>{$leaveBalance?.find(ob=>ob.leave_type==leaveType.id)?.balance}</td>
      {/each}
      </tr>
    </tbody>
  </table>
</div>
{#if loading}<div><Spinner/></div>{/if}