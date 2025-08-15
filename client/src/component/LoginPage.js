import { useContext, useState } from 'react';
import {Navigate} from 'react-router-dom';
import './Signin.css';
import { UserContext } from './UserContext';
import { API_BASE_URL } from '../config';

const LoginPage = ()=>{
    const[username,setUsername] = useState('');
    const[password,setpassword] = useState('');
    const [redirect,setredirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    function handleusername(event){
        setUsername(event.target.value);
    }
    function handlepassword(event){
        setpassword(event.target.value);
    }

    async function login(event){
        event.preventDefault();
        const response = await fetch(`${API_BASE_URL}/login`,{
            method:'POST',
            body: JSON.stringify({username,password}),
            headers:{'content-Type':'application/json'},
            credentials: 'include',
        })
        if(response.ok){
            response.json().then(userInfo=>{
                setUserInfo(userInfo);
                setredirect(true);
            })
        }else{
            alert('wrong credentials');
        }
    }

    if(redirect){
        return<Navigate to={'/'}/>
    }
    return(
        <>
        <form className="container"onSubmit={login}>
            <h1>Login Page</h1>
            <div className="UserName">
                <label htmlFor="uname">UserName</label>
                <input type="text" placeholder="Enter Username" value={username} onChange={handleusername}required />
            </div>
            <div className="password">
                <label htmlFor="psw">Password</label>
                <input type="password" placeholder="Enter Password" value={password} onChange={handlepassword} required/>
            </div>
            <button>Login</button>
        </form>
        </>
    )
}

export default LoginPage;