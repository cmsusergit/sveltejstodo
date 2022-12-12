<script> 
import { supabase } from '$lib/db'

import { onMount } from 'svelte'
import { page } from '$app/stores'
import {Form,Modal,Button,Pagination,Table} from 'spaper'
import AddUpdateRecord from '$lib/component/employee/addrecord.svelte'
import Spinner from '$lib/component/spinner.svelte'
import {displayToast} from '$lib/../config'
let loading = false,isOpenDlg=false
let currPage=1,pageSize=2
let employeeList=[]

let employeeRecord={}
let isUpdate=false
onMount(()=>{
  fetchEmployee()
})
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
const handleRemove=async(id)=>{
  loading=true
  const { data, error } = await supabase
  .from('Employee')
  .delete()
  .eq('id', id)   
  if(error)
    alert(JSON.stringify(error))
  loading=false  
  fetchEmployee()
  displayToast('Removed Record','success')
}

const columnList=[ 'ID','Name','Employee Code','Email','Contact','Department','']
const fetchEmployee = async () => {
    loading=true;
    let { data, error } = await supabase
      .from("Employee")
      .select(`id,emp_name,emp_code,email,contact,emp_type,dept_name,designation`).order("emp_name", { ascending: true });
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
  <AddUpdateRecord employeeRecord={employeeRecord} isUpdate={isUpdate} on:recordadded={()=>{displayToast('Added/Updated Record','success');fetchEmployee();isOpenDlg=false;}} on:closeDlg={()=>isOpenDlg=false}/>
{:else}
  {#if employeeList && employeeList.length>0}
  <div style="margin:.5em;padding-right:0.5em;display:flex;justify-content:flex-end;">
    <Pagination total={employeeList.length} pageSize={pageSize} bind:current={currPage}/>    
  </div>
  <div class="margin-top-small border" style="width:100%;overflow:auto;">
  <div class="padding-small">
      <table class="table-hover">
        <thead>
          <tr>
            {#each columnList as column}
            <th>{column}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each employeeList.slice((currPage-1)*pageSize,(currPage-1)*pageSize+pageSize) as record}
            <tr>
              <td>{record.id}</td>
              <td>{record.emp_name}</td>
              <td>{record.emp_code}</td>
              <td>{record.email}</td>
              <td>{record.contact}</td>
              <td>{record.dept_name}</td>
              <td>
                <button on:click={()=>handleEdit(record)} class="btn-secondary" style="padding:0.2em;">Edit</button>
                <button on:click={()=>handleRemove(record.id)} class="btn-danger" style="padding:0.2em;">Remove</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  {:else}
   <div class="margin-top-small border ">
    <h4 style="text-align:center">List Empty</h4>
  </div>
  {/if}
{/if}
</div>
{#if loading}<div><Spinner/></div>{/if}