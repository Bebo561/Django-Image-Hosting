import React from 'react'
import './Styles/SignUp.css'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom';

function SignUp() {
    const nav = useNavigate();
    var [username, setUser] = useState('');
    var [password, setPass] = useState('');
    var [question, setQuestion] = useState('');
    var [ans, setAns] = useState('');
    
    const usernameInput = (event: React.ChangeEvent<HTMLInputElement>) =>{
        event.preventDefault();
        setUser(event.target.value);
    }
    const passwordInput = (event : React.ChangeEvent<HTMLInputElement>) =>{
        event.preventDefault();
        setPass(event.target.value);
    }
    const answerInput = (event : React.ChangeEvent<HTMLInputElement>) =>{
        event.preventDefault();
        setAns(event.target.value);
    }
    const questionInput = (event: React.ChangeEvent<HTMLSelectElement>)=>{
        event.preventDefault();
        setQuestion(event.target.value);
    }
    const handleSub=(event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const url = 'http://localhost:8000/account';
        if(username === '' || password === '' || question === '' || ans === ''){
            return alert("Error - Missing Fields");
        }
        const Registerinfo= {
            Username: username,
            Password: password,
            Security_Question: question, 
            Answer: ans
        };
        console.log(Registerinfo);
        axios.post(url, Registerinfo).then((res) => {
            console.log(res);
            alert("Successful Submission!");
            nav('/Signin');
        }).catch((error) => {
            alert(error.response.data);
        })
        
    }

  return (
    <React.Fragment>
        <div id = "wrapper2">
        <Link to="/?page=1" id = "HomeRedirect2">←Home</Link>
            <form id = "RegComp" method="POST">
                <h1 id="RegHeader">Sign Up</h1>
                <p id="RegSubTitle" >Create your account</p>
                <input type = "text" name="Username" id="RegForm" onChange={usernameInput} placeholder = "Enter Username" />
                <input type = "password" name ="Password" id="RegForm" onChange={passwordInput} placeholder = "Enter Password"/>
  
                <label id="Seclabel">{question}</label>
                <select name="SecQ" id="SecQ" onChange={questionInput}>
                    <option value="null" selected disabled>Choose</option>
                    <option value="Color">What is your favorite color?</option>
                    <option value="elementary">What was your elementary school?</option>
                    <option value="First Dog">What was the name of your first dog?</option>
                </select>
                <input type = "text" name="Answer" id="RegForm" onChange={answerInput} placeholder = "Answer To Above" />
                <button id="signIn" onClick={handleSub} >Register</button>
                <h3 id="RegFooter">Already Have An Account?</h3>
                <Link to ="/Signin" id="LogRedirect">Login</Link>
            </form>
        </div>
    </React.Fragment>
  )
}
export default SignUp