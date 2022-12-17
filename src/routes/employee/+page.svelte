<script> 
import { supabase } from '$lib/db'

import { onMount } from 'svelte'
import { page } from '$app/stores'
import {Form,Modal,Button,Card,Pagination,Table} from 'spaper'
import {deptList} from '$lib/../config'
import Dialog from '$lib/component/dialog.svelte'
import AddUpdateRecord from '$lib/component/employee/addrecord.svelte'
import Spinner from '$lib/component/spinner.svelte'
import {displayToast} from '$lib/../config'
import EmployeeComponent from '$lib/component/employee/list.svelte'

let loading = false,isOpenDlg=false
let currPage=1,pageSize=4
let employeeList=[],searchText=''
let searchBy='emp_name',selectByDept=''
let employeeRecord={},recordCount=0
let sortBy='emp_name',isAscending=true
let isUpdate=false,recordIdToRemove=-1
$:{
  if(currPage){
    fetchEmployee()
  }
}

$:{    
  selectByDept;
  fetchCount()
  fetchEmployee()
}
onMount(()=>{
  fetchCount()
  fetchEmployee()
})
const fetchCount=async()=>{
  loading=true
  let { data, error } = await supabase
   .rpc('countemployee',{searchby:searchBy,searchtext:searchText,dd:'',deptname:selectByDept}) 
  if (error) {
    console.error(error)
    alert(JSON.stringify(error))
  }
  else {
    recordCount=data
  }
  loading=false
} 
const handleAddRecord=()=>{
  employeeRecord={
      user_id:$page.data.session.user.id,
      emp_name:'',
      designation:'',
      emp_code:'',
      emp_type:0, 
      dept_name:'',
      contact:'',email:''
  }
  isUpdate=false
  isOpenDlg=true
}
const handleEdit=(record)=>{
  employeeRecord=record
  isUpdate=true
  isOpenDlg=true
}
const handleRemove=async()=>{
  loading=true
  const { data, error } = await supabase
  .from('Employee')
  .delete()
  .eq('id', recordIdToRemove)   
  if(error)
    alert(JSON.stringify(error))
  loading=false  
  fetchCount()
  const nn=recordCount/pageSize
  if(typeof nn == 'number' && !isNaN(nn))
    if (!Number.isInteger(nn)) {
      currPage=(currPage-1)<1?1:(currPage-1)
    }
  fetchEmployee()
  displayToast('Removed Record','success')
}

const columnList=[ {name:'ID',field:'id'},{name:'Name',field:'emp_name'},{name:'Employee Code',field:'emp_code'},{name:'Email',field:'email'},{name:'Contact',field:'contact'},{name:'Department'},{name:''}]
const onRecordInserted=()=>{
  displayToast('Added/Updated Record','success')
  fetchCount()
  fetchEmployee()
  isOpenDlg=false
}
const fetchEmployee = async () => {
    loading=true;
    let st=(currPage-1)*pageSize
    let en=(currPage-1)*pageSize+pageSize-1
    let { data, error } = await supabase
      .from("Employee")
      .select(`id,emp_name,emp_code,email,contact,emp_type,dept_name,designation`)
      .ilike(searchBy, `%${searchText}%`)
      .ilike('dept_name', `%${selectByDept}%`)
      .order(sortBy, { ascending: isAscending }).range(st,en);
    if (error) {
      displayToast(JSON.stringify(error),'primary')
      console.error("error", error);
    } else {
      employeeList = data;
    }
    loading=false
  };
</script>


<div>
  <div style="display:flex;justify-content:space-between;">
    <h4>Employee</h4>
    {#if !isOpenDlg}
      <Button on:click={handleAddRecord} type="success" >+New Record</Button>
    {/if}
  </div>
{#if isOpenDlg==true}
  <AddUpdateRecord employeeRecord={employeeRecord} isUpdate={isUpdate} on:recordadded={onRecordInserted} on:closeDlg={()=>isOpenDlg=false}/>
{:else}
<div>
  <EmployeeComponent>
  
    <p>Hello There</p>
  </EmployeeComponent>
</div>
<!-- <div>
  <div style="margin:.5em;padding-right:0.5em;display:flex;justify-content:flex-end;">
    <div style="margin-right:0.4em;display:flex;padding:.1em;align-items:center;">
    <label style="margin-right:.4em;">Select Department</label>     
      <select bind:value={selectByDept} style="margin-left:.2em;">
        <option value="">ALL</option>
        {#each deptList as dept}
          <option value={dept.deptName}>{dept.deptName}</option>
        {/each}
      </select>
      <div style="margin-left:.2em;margin-right:0.2em;"></div>
      <label for="searchText" style="margin-right:.4em;">Search</label>      
      <input 
      bind:value={searchText} id="searchText" type="text">
      <select bind:value={searchBy} style="margin-left:.2em;">
        <option value="emp_name">Name</option>
        <option value="emp_code">Employee Code</option>
        <option value="email">Email</option>
        <option value="contact">Contact</option>
      </select>
      <button on:click={()=>{fetchCount();fetchEmployee();}} style="margin-left:.4em;padding:0.5em;">Search</button>
    </div>
    <Pagination total={recordCount} pageSize={pageSize} bind:current={currPage}/>    
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
                <button on:click={()=>handleEdit(record)} class="btn-secondary" style="padding:0.2em;">Edit</button>
                <button on:click={()=>{recordIdToRemove=record.id}} class="btn-danger" style="padding:0.2em;">Remove</button>
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

</div> -->
{/if}
</div>
{#if loading}<div><Spinner/></div>{/if}
{#if recordIdToRemove!=-1}
<div>
  <Dialog on:continue={()=>{handleRemove(recordIdToRemove);recordIdToRemove=-1}} on:close={()=>{recordIdToRemove=-1}} title='Remove Dialog'>  
    Do You Really Want to Remove?
  </Dialog>
</div>
{/if}


