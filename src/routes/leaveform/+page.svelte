<script>
  import {supabase} from '$lib/db' 
  import Dialog from '$lib/component/dialog.svelte'
  import AddUpdateRecord from '$lib/component/employee/addrecord.svelte'
  import Spinner from '$lib/component/spinner.svelte'
  import {displayToast} from '$lib/../config'
  import LeaveformList from '$lib/component/leaveform/record.svelte'
  import {goto} from '$app/navigation'
  import {Form,Modal,Button,Card,Pagination,Table} from 'spaper'
  let loading = false,isOpenDlg=false
  let leaveFormRecord={},reloadList
  let isUpdate=false,recordIdToRemove=-1

  const handleEdit=(record)=>{
    goto(`/leaveform/addrecord?id=${record.employee_id}&update_id=${record.id}`)
  }
  const handleRemove=async()=>{
    loading=true
    const { data, error } = await supabase
    .from('Leaveform')
    .delete()
    .eq('id', recordIdToRemove)   
    if(error)
      alert(JSON.stringify(error))
    loading=false  
    displayToast('Removed Record','success')
    reloadList()
  }
  const onRecordInserted=()=>{
    displayToast('Added/Updated Record','success')
    isOpenDlg=false
  }
</script>
<div>
  <div style="display:flex;justify-content:space-between;">
    <h4>Leaveform Detail</h4>
  </div>
<div>
  
  <LeaveformList bind:reloadList={reloadList} let:currRecord={record}>
    <button on:click={()=>handleEdit(record)} class="btn-secondary" style="padding:0.2em;"><svg class="svg-icon" viewBox="0 0 20 20">
             <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path></svg>
              
    </button>
    <button on:click={()=>{recordIdToRemove=record.id}} class="btn-danger" style="padding:0.2em;">
    <svg class="svg-icon" viewBox="0 0 20 20">
							<path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
						</svg></button>
  </LeaveformList> 
</div>
{#if loading}<div><Spinner/></div>{/if}
{#if recordIdToRemove!=-1}
<div>
  <Dialog on:continue={()=>{handleRemove(recordIdToRemove);recordIdToRemove=-1}} on:close={()=>{recordIdToRemove=-1}} title='Remove Dialog'>  
    Do You Really Want to Remove?
  </Dialog>
</div>
{/if} 
</div>