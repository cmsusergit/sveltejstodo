<script>
import {Form,Select,Input,Button,Pagination,Toast} from 'spaper'

import {page} from '$app/stores'
import { onMount } from 'svelte'
import {supabase} from '$lib/db' 
import {displayToast} from '$lib/../config'
import Spinner from '$lib/component/spinner.svelte'
import {goto} from '$app/navigation'
let loading = false,isDetailDlg=false
let currPage=1,pageSize=4


let leaveformList=[],searchText=''
let searchBy='emp_name',selectByDept=''
let employeeRecord={},recordCount=0
let sortBy='from_dt',isAscending=true
const columnList=[ {name:'ID',field:'id'},{name:'Employee Name',},{name:'Leave Type'},{name:'From Date',field:'from_dt'},{name:'To Date',field:'to_dt'},{name:'Total'},{name:'Full/Half'}]

onMount(()=>{
  fetchCount()
  fetchLeaveformList()
})
const fetchCount=()=>{}
const fetchLeaveformList=async()=>{
  loading=true
  let { data, error } = await supabase
    .from('Leaveform').select(`*,Employee(emp_name),Leavetype(leave_type)`).order(sortBy,{ascending: isAscending })
		if (error) {
      alert(JSON.stringify(error))
			console.error(error)
		}
    else{
      leaveformList=data
    }
    loading=false
}
</script>
<svelte:head>
  <title>Leaveform Detail</title>
</svelte:head>
<div>
<h4>LeaveForm Detail</h4>
<!-- <p>{JSON.stringify(leaveformList)}
</p> -->
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
              <slot currRecord={record}>
              </slot>
                <button on:click={()=>handleDetail(record)} class="btn-primary" style="padding:0.2em;">
                <svg class="svg-icon" viewBox="0 0 20 20">
                <path d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"></path>
              </svg>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  <div style="margin:.5em;padding-right:0.5em;display:flex;justify-content:flex-end;">
    <Pagination total={recordCount} pageSize={pageSize} bind:current={currPage}/>    
</div>
  {:else}
    <div class="margin-top-small border ">
      <h4 style="text-align:center">List Empty</h4>
    </div>
  {/if}
{#if loading}<div><Spinner/></div>{/if}
</div>


