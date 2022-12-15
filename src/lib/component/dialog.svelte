<script>
import {Form,Modal,Button,Card,Pagination,Table} from 'spaper'

import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher();

export let title=""
</script>
<div class="container-cube">
  <div class="cube">
    <Card header={title}>
        <slot></slot>
      <div slot="footer" class="margin-none" style="display:flex;justify-content:center;">
      <button on:click={()=>dispatch('continue')} class="margin-right-large btn-secondary" type="button">Continue</button>
      <button on:click={()=>dispatch('close')} class="btn-danger" type="button">Close</button>
    </div>
    </Card>
    <div>
      
    </div>
    
  </div>
</div>
<style>
.container-cube{
  background-color:rgb(0,0,0,0.8);color:white;
  position:absolute;top:0;left:0;width:100%;height:100%;z-index:100;
}

.cube{
position:relative;
background-color:floralwhite;color:indigo;
top:20%;
width:100%;
border:5px groove rgb(100,100,200,0.8);
padding-top:.1em;
padding-left:1em;
padding-right:1em;
padding-bottom:1em;
}
</style>