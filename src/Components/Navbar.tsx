import React from 'react'
import './Styles/Navbar.css'
import {useState, useEffect} from 'react'
import{Link, useNavigate} from 'react-router-dom'
import axios from 'axios';


function Navbar() {
  var [user, setUser] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    var temp = sessionStorage.getItem('User');
    if(temp){
      setUser(temp);
    }
  }, []);

  function SignOut(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    const url = 'http://localhost:8000/Logout';
    var token = sessionStorage.getItem('token');
    const data = {
      token: token
    };
    axios.put(url, data).then((res) => {
      alert('Logout Successful');
      sessionStorage.clear();
      nav('/Signin');
    }).catch((err) => {
      alert('Error');
    })
    
  }



  return (
    <React.Fragment>
      <div id = "Header">
        <h1 id = "Hosterr">Hosterr</h1>
        {user === '' &&
        <>
          <Link to ='/Signin' id="LoginRedirect">Sign In</Link>
        </>
      }
      {user !== '' &&
      <>
         <Link to ='/Post' id="CreatePost">Post</Link>
         <button onClick={SignOut} id="LogOut">Logout</button>

      </>
      }
      </div>
    </React.Fragment>
  )
}

export default Navbar