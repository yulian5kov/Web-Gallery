import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {

    const[usernameOrEmail, setUsernameOrEmail] = useState('')
    const[password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(usernameOrEmail, password)
    };

    return (
        <form action="login" onSubmit={handleSubmit}>
            <h3>Log in</h3>

            <label>Username or email:</label>
            <input 
                type="usernameOrEmail"
                onChange={(e)=>setUsernameOrEmail(e.target.value)}
                value={usernameOrEmail}
            />

            <label>Password:</label>
            <input 
                type="password"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
            />

            <button disabled={isLoading}>Login</button>
            
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Login