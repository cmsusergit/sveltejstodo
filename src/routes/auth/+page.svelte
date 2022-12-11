<script>
import {Form,Input,Button} from 'spaper'

import {supabase} from '$lib/db' 
import {goto} from '$app/navigation'
import loggedInUser from '$lib/../store'
let email='',password=''
let loading =false,test=''
const handleLogin=async()=>{
  try{
    loading = true
    const { error } = await supabase.auth.signInWithPassword({ email,password })
    
    if (error) throw error
    goto('/')
  }catch(error){
     if (error instanceof Error) {
       test=error.message
        alert(error.message)
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
  <p style="color:red;font-size:110%;">{test}</p>
    <Input block bind:value={email} placeholder="email" class="margin-bottom-small" label="Email"/>
    <Input block bind:value={password} placeholder="password" type="password" label="Password"/>
    <Button
    on:click={handleLogin} type="submit" class="margin-top-small">
      Sign in
    </Button>
    <Button on:click={()=>{goto('/signup')}}>SignUp</Button>
  </Form>
</div>



