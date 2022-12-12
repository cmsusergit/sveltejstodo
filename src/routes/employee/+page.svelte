<script> 
import { supabase } from '$lib/db'

import { onMount } from 'svelte'
import { page } from '$app/stores'
import {Form,Modal,Button,Table} from 'spaper'
import AddRecord from '$lib/component/employee/addrecord.svelte'
import Spinner from '$lib/component/spinner.svelte'
import {displayToast} from '$lib/../config'
let loading = false,isOpenDlg=false
let employeeList=[]
onMount(()=>{

  fetchEmployee()
})
const columnList=[
  {field:'id',label:'ID'},
  {field:'emp_name',label:'Name'},{field:'emp_code',label:'Employee Code'},
  {field:'email',label:'Email'},{field:'contact',label:'Contact'},
  {field:'emp_type',content:(dt)=>dt==0?'Vacational':(dt==1?'NnVacational':'AdHoc')},
  {field:'dept_name',label:'Department'},
  {field:'designation',label:'Designation'}
]
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
    <h2>Employee</h2>
    {#if !isOpenDlg}
      <Button on:click={()=>isOpenDlg=true} type="success" >+New Record</Button>
    <!-- {:else}      
      <Button on:click={()=>isOpenDlg=false} class="sm-4 col">Close</Button> -->
    {/if}
  </div>

{#if isOpenDlg==true}
  <AddRecord on:recordadded={()=>{displayToast('Added Record','success');fetchEmployee();isOpenDlg=false;}} on:closeDlg={()=>isOpenDlg=false}/>
{:else}


  <div class="border">
  {#if employeeList && employeeList.length>0}
  <div class="padding-small">


    <Table columns={columnList} data={employeeList}/></div>
  {:else}
    <h4 style="text-align:center">List Empty</h4>
  {/if}</div>
{/if}





</div>
{#if loading}<div><Spinner/></div>{/if}