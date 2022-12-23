<script>
import {Form,Input,Button} from 'spaper'

import Spinner from '$lib/component/spinner.svelte'
import LeaveformList from '$lib/component/leaveform/record.svelte'
import {supabase} from '$lib/db' 
export let currEmpName
</script>
<div>
  <h4>
    Leave Report
  </h4>

  <div>
    <LeaveformList currEmpName={currEmpName} let:currRecord={record}></LeaveformList>
  </div>
</div>