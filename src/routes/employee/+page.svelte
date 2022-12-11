<script> 
import { supabase } from '$lib/db'

import { onMount } from 'svelte'
import { page } from '$app/stores'
import {Form,Modal,Button,Table} from 'spaper'
import AddRecord from '$lib/component/employee/addrecord.svelte'
import {displayToast} from '$lib/../config'
let loading = false,isOpenDlg=false
let employeeList=[]
onMount(()=>{
  fetchEmployee()

})
const columnList=[
  {field:'id',label:'ID'},
  {field:'emp_name',label:'Name'},
  {field:'emp_code',label:'Employee Code'},
  {field:'email',label:'Email'},
  {field:'contact',label:'Contact'},
  {field:'emp_type',content:(dt)=>dt==0?'Vacational':(dt==1?'NnVacational':'AdHoc')},
  {field:'dept_name',label:'Department'},
  {field:'designation',label:'Designation'}
]
const fetchEmployee = async () => {
    let { data, error } = await supabase
      .from("Employee")
      .select(`*`)
       .order("emp_name", { ascending: true });
    if (error) {
      displayToast(JSON.stringify(error),'primary')
      console.error("error", error);
    } else {
      employeeList = data;
    }
  };
</script>
<div>
  <div class="row flex-edges">
    <h1 class="sm-4 col">Todo</h1>
    {#if !isOpenDlg}
      <Button on:click={()=>isOpenDlg=true} class="sm-4 col">+New Record</Button>
    {:else}      
      <Button on:click={()=>isOpenDlg=false} class="sm-4 col">Close</Button>
    {/if}
  </div>
{#if isOpenDlg==true}













  <AddRecord on:recordadded={()=>{displayToast('Added Record','success');fetchEmployee();isOpenDlg=false;}} on:closeDlg={()=>isOpenDlg=false}/>
{:else}
  <!-- <Table columns={columnList} 
  data={employeeList}/> -->
  {#if employeeList && employeeList.length>0}
    <Table columns={columnList} data={employeeList}/>
  {:else}
    <h4>List Empty</h4>
  {/if}
{/if}
</div>










