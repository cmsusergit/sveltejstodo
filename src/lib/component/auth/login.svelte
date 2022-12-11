<script>
import {Form,Input,Button,Toast} from 'spaper'

import {supabase} from '$lib/db' 
import {goto} from '$app/navigation'
import loggedInUser from '$lib/../store'
let email='',password=''
let loading =false

function displayToast(test,type) {
  Toast.open({
    message:test,
    
    type,
    duration:2 * 1000,
    position:'top',
    dismissible:true
  })
}
const handleauth=async(type1)=>{
  try{
    loading = true
    const { error } = (type1=='login')?await supabase.auth.signInWithPassword({ email,password }):await supabase.auth.signUp({ email,password })
  if (error) throw error
  displayToast('Login Done','success')
  goto('/')
  }catch(error){
     if (error instanceof Error) {
       displayToast(error.message,'danger')
  }
  }
  finally {
      loading = false
    }
}
</script>
<div>
  <h1>
  Login Here
  </h1>
  <Form style="margin:0 auto;width:80%;" >
    <Input block bind:value={email} placeholder="email" class="margin-bottom-small" label="Email"/>
    <Input block bind:value={password} placeholder="password" type="password" label="Password"/>
    <Button
    on:click={()=>handleauth('login')} type="submit" class="margin-top-small">
      Sign in
    </Button>

   <Button on:click={()=>handleauth('signup')}>SignUp</Button>
  </Form>
</div>






