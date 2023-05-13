import React from 'react'
import './Styles/Signin.css'
import{Link} from 'react-router-dom'
import axios from 'axios'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom';

function SignIn() {
  const nav = useNavigate();
  var [uname, setUser] = useState('');
  var [pword, setPword] = useState('');

const usernameInput = (event: React.ChangeEvent<HTMLInputElement>) =>{
    event.preventDefault();
    setUser(event.target.value);
}
const passwordInput = (event : React.ChangeEvent<HTMLInputElement>) =>{
    event.preventDefault();
    setPword(event.target.value);
}
const handleSub=(event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  const url = 'http://localhost:8000/Login';
  if(uname === '' || pword === ''){
      return alert("Error - Missing Fields");
  }
  const Logininfo= {
      Username: uname,
      Password: pword
  };
  console.log(Logininfo);
  axios.post(url, Logininfo).then((res) => {
      alert("Successful Submission!");
      sessionStorage.setItem('token', res.data);
      sessionStorage.setItem('User', uname);
      nav('/?page=1');
  }).catch((error) => {
      alert(error.response.data);
  })
  
}
  return (
    <React.Fragment>
        <div id = "wrapper">
            <form id = "LoginComp" method="POST">
            <Link to="/?page=1" id = "HomeRedirect">←Home</Link>
                <h1 id="LogHeader">Welcome</h1>
                <p id="LogSubTitle" >Log in to post</p>
                <input type = "text" name="Username" id="SignInForm" onChange={usernameInput} placeholder = "Enter Username" /><br></br>
                <input type = "password" name ="Password" id="SignInForm" onChange = {passwordInput} placeholder = "Enter Password"/><br></br>
                <button id="signIn" onClick={handleSub} >Sign In</button>
                <h3 id="LogFooter">No Account? No problem</h3>
                <Link to ="/Signup" id="RegRedirect">Sign Up</Link>
            </form>
        </div>
    </React.Fragment>
  )
}
export default SignIn