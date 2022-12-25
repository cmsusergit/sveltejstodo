<script>
import {Form,Modal,Pagination,Popover} from 'spaper'

import {page} from '$app/stores'
import { onMount } from 'svelte'
import {supabase} from '$lib/db' 
import {displayToast} from '$lib/../config'
import Spinner from '$lib/component/spinner.svelte'
import {goto} from '$app/navigation'
let loading = false,isDetailDlg=false
let currPage=1,pageSize=4
let leaveformList=[],recordCount=0

let sortBy='from_dt',isAscending=true
let leaveTypeList=[],leaveFormRecord=null
let selectByFull='-',selectByLeavetype=''
export let employee_id=-1
const columnList=[ {name:'ID',field:'id'},{name:'Employee Name',},{name:'Leave Type'},{name:'From Date',field:'from_dt'},{name:'To Date',field:'to_dt'},{name:'Total'},{name:'Full/Half'}]

$:{
  selectByLeavetype
  selectByFull
  fetchLeaveformList()
  currPage=1
}
onMount(()=>{
  fetchLeaveType()
  fetchLeaveformList()
})
const fetchLeaveformList=async()=>{
  loading=true
  let st=(currPage-1)*pageSize
  let en=(currPage-1)*pageSize+pageSize-1
  
  
  let tempQuery=supabase.from('Leaveform').select(`*,Employee!inner(emp_name),Leavetype!inner(leave_type)`,{ count: 'exact' }).order(sortBy,{ascending: isAscending }).ilike('Leavetype.leave_type', `%${selectByLeavetype}%`)
  if(selectByFull!='-')
    tempQuery=tempQuery.eq('is_full',selectByFull)
  if(employee_id!=-1)
    tempQuery=tempQuery.eq('employee_id',employee_id)
  const dt=await tempQuery.range(st,en)
  // let  dt  
  // if(selectByFull!='-')
  //   dt= await supabase.from('Leaveform').select(`*,Employee!inner(emp_name),Leavetype!inner(leave_type)`,{ count: 'exact' }).order(sortBy,{ascending: isAscending }).
  //   ilike('Leavetype.leave_type', `%${selectByLeavetype}%`).ilike('Employee.emp_name', `%${currEmpName}%`).eq('is_full',selectByFull).range(st,en)
  // else
  //   dt= await supabase.from('Leaveform').select(`*,Employee!inner(emp_name),Leavetype!inner(leave_type)`,{ count: 'exact' }).order(sortBy,{ascending: isAscending }).ilike('Leavetype.leave_type', `%${selectByLeavetype}%`).ilike('Employee.emp_name', `%${currEmpName}%`).range(st,en)
    if (dt.error) {
      displayToast(JSON.stringify(dt.error),'primary')
      console.error("error", dt.error);
    } else {
      leaveformList=dt.data
      recordCount=dt.count  
    }
    loading=false
}
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
const handleDetail=(record)=>{
  leaveFormRecord=record
  isDetailDlg=true
}


export const reloadList=()=>{
  fetchLeaveformList()
  const nn=recordCount/pageSize
  if(typeof nn == 'number' && !isNaN(nn))
    if (!Number.isInteger(nn)) {
      currPage=(currPage-1)<1?1:(currPage-1)
    }
} 
</script>

<svelte:head>
  <title>Leaveform Detail</title>
</svelte:head>
<div>

<div style="margin:.5em;padding-right:0.5em;display:flex;justify-content:flex-end;align-items:center;flex-wrap: wrap">
  <div style="margin-right:0.4em;display:flex;padding:.1em;align-items:center;flex-wrap: wrap">
  <label style="margin-right:.4em;">Select By</label>     
   <select bind:value={selectByLeavetype} style="margin-left:.2em;">
      <option value="">ALL</option>
      {#each leaveTypeList as leave}
        <option value={leave.leave_type}>{leave.leave_type} ({leave.leave_alias})</option>
      {/each}
    </select>
    <div style="margin-left:.2em;margin-right:0.2em;"></div>
    <select bind:value={selectByFull} style="margin-left:.2em;">
      <option value="-">ALL</option>
      <option value={true}>Full</option>
      <option value={false}>Half</option>
    </select>
  </div>
  <div style="margin-left:.4em;margin-right:0.4em;"></div>
  <Pagination on:change={()=>{fetchLeaveformList()}} total={recordCount} pageSize={pageSize} bind:current={currPage}/>    
</div>
{#if leaveformList && leaveformList.length>0}
<div class="margin-top-small border" style="width:100%;overflow:auto;">

  <div class="padding-small">
      <table class="table-hover">
        <thead>
          <tr>
            {#each columnList as column}
              {#if column.field}
                <th on:click={()=>{sortBy=column.field;isAscending=!isAscending;fetchLeaveformList();}} style="cursor:pointer">{column.name}  
                  {#if column.field==sortBy}
                    {#if isAscending}
                      &darr;
                    {:else}
                      &uarr;
                    {/if}
                    {/if}
                </th>

              {:else}
                <th>{column.name}</th>
              {/if}              
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each leaveformList as record}
            <tr>
              <td>{record.id}</td>
              <td>{record.Employee.emp_name}</td>
              <td>{record.Leavetype.leave_type}</td>
              <td>{record.from_dt}</td>
              <td>{record.to_dt}</td>
              <td>{record.total}</td>
              <td>{record.is_full?'Full':`Half (${record.half_leave_type})`}</td>
              <td>
               <slot currRecord={record}></slot>               
               <Popover label="Detail" position="right">
                <button on:click={()=>handleDetail(record)} class="btn-primary" style="padding:0.2em;">
                <svg class="svg-icon" viewBox="0 0 20 20">
                <path d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"></path>
              </svg>
                </button>
              </Popover>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  <div style="margin:.5em;padding-right:0.5em;display:flex;justify-content:flex-end;">
    <Pagination on:change={()=>fetchLeaveformList()} total={recordCount} pageSize={pageSize} bind:current={currPage}/>    
</div>
  {:else}
    <div class="margin-top-small border ">
      <h4 style="text-align:center">List Empty</h4>
    </div>
  {/if}

{#if loading}<div><Spinner/></div>{/if}
</div>

<Modal bind:active={isDetailDlg} title="Employee Detail">
<div class='border padding-small'>
  <div style="overflow:auto;width:400px;height:280px;padding:.2em;">
      <p><b>Id:</b> {leaveFormRecord?.id}</p>
      <p><b>Employee Name:</b> {leaveFormRecord?.Employee.emp_name}</p>
      <p><b>Leave Type:</b> {leaveFormRecord?.Leavetype.leave_type}</p>
      <p><b>From Date:</b> {leaveFormRecord?new Date(leaveFormRecord.from_dt).toDateString():''}</p>
      <p><b>Designation:</b> {leaveFormRecord?new Date(leaveFormRecord.to_dt).toDateString():''}</p>
      <p><b>Total Days:</b> {leaveFormRecord?.total}</p>
      <p><b>Reason:</b> {leaveFormRecord?.reason}</p>
      <p><b>Full/Half:</b> {leaveFormRecord?.is_full?'Full':`Half (${leaveFormRecord?.half_leave_type})`}</p>
  </div>
</div>
</Modal>
