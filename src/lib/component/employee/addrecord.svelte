<script> 
import { supabase } from '$lib/db'

import { page } from '$app/stores'
import {Form,Select,Input,Button,Table,Toast} from 'spaper'
import { createEventDispatcher } from 'svelte'
import Spinner from '$lib/component/spinner.svelte'
import {deptList,designationList} from '$lib/../config'
const dispatch = createEventDispatcher();
let loading=false;
export let employeeRecord
export let isUpdate

const addRecord=async()=>{
  loading=true
  const { data, error } = await supabase
  .from('Employee')
  .insert([
    employeeRecord,
  ])
  if(error)
    alert(JSON.stringify(error))
  loading=false
  dispatch('recordadded')
 }
const updateRecord=async()=>{
  loading=true
  const { data, error } = await supabase
  .from('Employee')
  .update(employeeRecord).eq('id',+employeeRecord.id)
  if(error)
    alert(JSON.stringify(error))
  loading=false
  dispatch('recordadded')
 }
const onsubmit=async()=>{
    if(!isUpdate)
      addRecord()
    else
      updateRecord()
 }
</script>
<div> 
   <Form style="margin:0 auto;display:flex;flex-direction:column">
   <form on:submit|preventDefault={onsubmit}>   
   <div class="border">
    <div class="padding-large">
      <Input block bind:value={employeeRecord.emp_name} placeholder="Employee Name" class="margin-bottom-small" label="Name" required/>
      <div style="display:flex;justify-content:space-between">
        <Input block bind:value={employeeRecord.emp_code} placeholder="Employee Code" class="margin-bottom-small margin-right-small" label="Employee Code" required/>
        <Select label="Employee Type" class="margin-bottom-small margin-left-small" bind:value={employeeRecord.emp_type} required>
            <option value="0">Vacational</option>
            <option value="1">NnVacational</option>
            <option value="2">AdHoc</option>
        </Select> 
        <Select label="Department" class="margin-bottom-small margin-left-small" bind:value={employeeRecord.dept_name} required>
            {#each deptList as dept}
              <option value={dept.deptName}>{dept.deptName}</option>
            {/each}
        </Select>
        <Select label="Designation" class="margin-bottom-small margin-left-small" bind:value={employeeRecord.designation} required>
            {#each designationList as designation}
              <option value={designation}>{designation}</option>
            {/each}
        </Select>
    </div>
      <div style="display:flex;justify-content:space-between">
        <Input block bind:value={employeeRecord.contact} placeholder="Employee Contact" class="margin-bottom-small margin-right-small" label="Contact" required/>
        <Input block bind:value={employeeRecord.email} placeholder="Employee Email" class="margin-bottom-small margin-left-small" type="email" label="Email" required/>
      </div>
      </div>
      </div>
      <div class="margin-top-small border" style="padding:.4em;display:flex;flex-direction:row;justify-content:flex-end">

        <Button nativeType="submit" type="secondary" class="margin-top-small margin-right-small">{isUpdate?'Update Record':'Add Record'}</Button>
        <Button on:click={()=>{dispatch('closeDlg')}} type="danger" class="margin-top-small margin-left-small">CLOSE</Button>
      </div>
    </form>
  </Form>
</div>
{#if loading}<div><Spinner/></div>{/if}








