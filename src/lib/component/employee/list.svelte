<script> 
import { supabase } from '$lib/db'

import { onMount } from 'svelte'
import { page } from '$app/stores'
import {Form,Modal,Pagination,Popover} from 'spaper'
import {deptList} from '$lib/../config'
import Spinner from '$lib/component/spinner.svelte'
import {displayToast} from '$lib/../config'
let loading = false,isDetailDlg=false
let currPage=1,pageSize=4


let employeeList=[],searchText=''
let searchBy='emp_name',selectByDept=''
let employeeRecord={},recordCount=0
let sortBy='emp_name',isAscending=true
$:{    
  selectByDept;
  fetchEmployee()
}
onMount(()=>{
  fetchEmployee()
})
export const handleRemove=async()=>{
  fetchCount()
  const nn=recordCount/pageSize
  if(typeof nn == 'number' && !isNaN(nn))
    if (!Number.isInteger(nn)) {
      currPage=(currPage-1)<1?1:(currPage-1)
    }
  fetchEmployee()
}
const columnList=[ {name:'ID',field:'id'},{name:'Name',field:'emp_name'},{name:'Employee Code',field:'emp_code'},{name:'Email',field:'email'},{name:'Contact',field:'contact'},{name:'Department'},{name:''}]
const fetchEmployee = async () => {
    loading=true;
    let st=(currPage-1)*pageSize
    let en=(currPage-1)*pageSize+pageSize-1
    let dt = await supabase
      .from("Employee")
      .select(`id,emp_name,emp_code,email,contact,emp_type,dept_name,designation`,{count:'exact'})
      .ilike(searchBy, `%${searchText}%`)
      .ilike('dept_name', `%${selectByDept}%`)
      .order(sortBy, { ascending: isAscending }).range(st,en);
    if (dt.error) {
      displayToast(JSON.stringify(error),'primary')
      console.error("error", error);
    } else {

      employeeList = dt.data
      recordCount=dt.count
      currPage=1
    }
    loading=false
  };
const handleDetail=(record)=>{
  employeeRecord=record
  isDetailDlg=true
}
</script>
<div>
<div style="margin:.5em;padding-right:0.5em;display:flex;justify-content:flex-end;flex-wrap: wrap">
  <div style="margin-right:0.4em;display:flex;padding:.1em;align-items:center;flex-wrap: wrap">
  <label style="margin-right:.4em;">Select Department</label>     
    <select bind:value={selectByDept} style="margin-left:.2em;">
      <option value="">ALL</option>
 
      {#each deptList as dept}
        <option value={dept.deptName}>{dept.deptName}</option>
      {/each}
    </select>
    <div style="margin-left:.2em;margin-right:0.2em;"></div>
    <label for="searchText" style="margin-right:.4em;">Search</label>      
    <input on:change={()=>{fetchEmployee();}}
    bind:value={searchText} id="searchText" type="text">
    <select bind:value={searchBy} style="margin-left:.2em;">
      <option value="emp_name">Name</option>
      <option value="emp_code">Employee Code</option>
      <option value="email">Email</option>
      <option value="contact">Contact</option>
    </select>
    <button on:click={()=>{fetchEmployee();}} style="margin-left:.4em;padding:0.5em;">Search</button>
  </div>
  <Pagination on:change={()=>fetchEmployee()} total={recordCount} pageSize={pageSize} bind:current={currPage}/>    

</div>
{#if employeeList && employeeList.length>0}
<div class="margin-top-small border" style="width:100%;overflow:auto;">
<div class="padding-small">
    <table class="table-hover">
      <thead>
        <tr>
          {#each columnList as column}
            
            {#if column.field}
              <th on:click={()=>{sortBy=column.field;isAscending=!isAscending;fetchEmployee();}} style="cursor:pointer">{column.name}  
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
        {#each employeeList as record}

          <tr>
            <td>{record.id}</td>
            <td>{record.emp_name}</td>
            <td>{record.emp_code}</td>
            <td>{record.email}</td>
            <td>{record.contact}</td>
            <td>{record.dept_name}</td>
            <td>
            <slot currRecord={record}></slot>
            <Popover label="Detail" position="right">
              <button on:click={()=>handleDetail(record)} class="btn-primary" style="padding:0.2em;">
              <svg class="svg-icon" viewBox="0 0 20 20">
							<path d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"></path>
						</svg>
              </button></Popover>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
<div style="margin:.5em;padding-right:0.5em;display:flex;justify-content:flex-end;">

  <Pagination on:change={()=>fetchEmployee()} total={recordCount} pageSize={pageSize} bind:current={currPage}/>    
</div>
{:else}
  <div class="margin-top-small border ">
  <h4 style="text-align:center">List Empty</h4>
</div>
{/if}
</div>
<Modal bind:active={isDetailDlg} title="Employee Detail">
<div class='border padding-small'>
  <div style="overflow:auto;width:400px;height:280px;padding:.2em;">


      <p><b>Id:</b> {employeeRecord.id}</p>
      <p><b>Name:</b> {employeeRecord.emp_name}</p>
      <p><b>Employee Code:</b> {employeeRecord.emp_code}</p>
      <p><b>Department:</b> {employeeRecord.dept_name}</p>
      <p><b>Designation:</b> {employeeRecord.designation}</p>
      <p><b>Email:</b> {employeeRecord.email}</p>
      <p><b>Contact:</b> {employeeRecord.contact}</p>
      <p><b>Employee Type:</b> {employeeRecord.emp_type==0?'Vacational':(employeeRecord.emp_type==1?'NnVacational':'AdHoc')}</p>
  </div>
</div>
</Modal>
{#if loading}<div><Spinner/></div>{/if}

