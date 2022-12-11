<script>
import {Form,Input,Button} from 'spaper'

import {supabase} from '$lib/db' 
let email='',password=''
let loading =false,test=''
const handleSignUp=async()=>{
  try{

    loading = true
    const { error } = await supabase.auth.signUp({ email,password })
    if (error) throw error

    console.log("****")
    test="done"
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
  <form on:submit|preventDefault="{handleLogin}">
  <Form style="margin:0 auto;width:80%;" >
  <p style="color:red;font-size:110%;">{test}</p>
    <Input block bind:value={email} placeholder="email" class="margin-bottom-small" label="Email"/>
    <Input block bind:value={password} placeholder="password" type="password" label="Password"/>
    <Button
    
    
    on:click={handleSignUp} type="submit" class="margin-top-small">
      Sign Up
    </Button>
  </Form>
  </form>
</div>


