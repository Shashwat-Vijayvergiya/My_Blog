import { useContext, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { UserContext } from './component/UserContext';
import { API_BASE_URL } from './config';


export default function Navbar(){
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect (()=>{
    fetch(`${API_BASE_URL}/profile`,{
      credentials:'include',
    }).then(response => {
      response.json().then(userinfo=>{
        setUserInfo(userinfo);
      });
    }).catch(error => {
      console.log('Profile fetch error:', error);
    });
  }, [setUserInfo])

  function logout(){
    fetch(`${API_BASE_URL}/logout`,{
      credentials:'include',
      method:'POST',
    })
    setUserInfo(null);
  }

  const username = userInfo?.username;
    return(
        <>
            <header>
            <Link to="/" className="logo">MyBlog</Link>
              <nav>
                {username && (
                  <>
                   <Link to='/create'>Create</Link>
                   <a href='/'onClick={logout}>Logout</a>
                  </>
                )}
                {!username && (
                  <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                  </>
                )}
              </nav>
            </header>   
        </>
    )
}