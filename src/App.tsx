import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Components/Home'
import SignIn from './Components/Signin'
import SignUp from './Components/SignUp'
import Post from './Components/post'
import ImageDetails from './Components/ImageDetails'

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path = '/' element={<Home />}/>
        <Route path = '/Signin' element = {<SignIn />}/>
        <Route path = '/Signup' element = {<SignUp />}/>
        <Route path = '/Post' element = {<Post />}/>
        <Route path = '/Image' element = {<ImageDetails />}/>
      </Routes>
    </React.Fragment>
  )
}

export default App
