function Login() {
  return (
   <div>
     <h2>Login Page</h2>
     <form>
<label htmlFor="email">Email</label>
<input id="email" type="email" value={email}></input>

     </form>
   </div>

  );
}

export default Login;