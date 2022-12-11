<script>
import {Form,Input,Button} from 'spaper'

let email='',password=''
let loading =false,test='----'

const handleLogin=async()=>{
  try{

    loading = true
    const { error } = await supabase.auth.signInWithPassword({ email,password })
    if (error) throw error

    alert("DONE")
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
    <Input block bind:value={email} placeholder="email" class="margin-bottom-small" label="Email"/>
    <Input block bind:value={password} placeholder="password" type="password" label="Password"/>
    <Button type="submit" class="margin-top-small">
      Sign in
    </Button>
  </Form>

<p>{test}</p>



  </form>
</div>


