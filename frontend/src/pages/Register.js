import { useState } from "react";
import { useRegister } from "../hooks/useRegister";

const Register = () => {
    const[email, setEmail] = useState('')
    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')
    const {register, error, isLoading} = useRegister()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await register(username, email, password)
    };

    return (
        <form action="register" onSubmit={handleSubmit}>
            <h3>Register</h3>

            <label>Username:</label>
            <input 
                type="username"
                onChange={(e)=>setUsername(e.target.value)}
                value={username}
            />

            <label>Email:</label>
            <input 
                type="email"
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
            />

            <label>Password:</label>
            <input 
                type="password"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
            />

            <button disabled={isLoading}>Register</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Register