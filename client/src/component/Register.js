import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './Signin.css';

const Register= ()=>{
    const [username,setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsername = (event)=>{
        
        setUsername(event.target.value);
    }

    const handlePassword = (event)=>{
        setPassword(event.target.value);
    }

    async function register(ev){
        ev.preventDefault();
        const response = await fetch(`${API_BASE_URL}/register`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({username,password}),

        })
        if(response.status === 200){
            alert('registration success');
            navigate('/login');
        }else{
            alert('registration failed');
        }
    }
    return(
        <>
        <form className='container' onSubmit={register}>
            <h1>Register Page</h1>
            <div className="UserName">
                <label >UserName</label>
                <input type="text" placeholder="Enter Username" value={username} onChange={handleUsername} required />
            </div>
            <div className="password">
                <label >Password</label>
                <input type="password" placeholder="Enter Password" value={password} onChange={handlePassword} required />
            </div>
            <button>Register</button>
    
        </form>
        </>
    )
}

export default Register;