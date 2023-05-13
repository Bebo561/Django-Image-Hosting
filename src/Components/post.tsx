import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { toFormData } from 'axios'
import './Styles/Post.css';

export default function Post(){
    var [imageInput, setImageInput] = useState<any>([]);
    var [imageName, setImageName] = useState('');
    var [imageTags, setImageTags] = useState('');
    const nav = useNavigate();
    var user = sessionStorage.getItem('User');
    var token = sessionStorage.getItem('token');

    useEffect(() =>{
        if(user === null && token === null){
            nav('/Signin')
        }
    }, []);
    function HandleUpload(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        console.log(imageInput)

        if(imageInput.length === 0 || imageName === '' || imageTags === ''){
            return alert('Please Enter Valid Credentials')
        }
        var sendTags = [];
        sendTags = imageTags.split(' ');
        console.log(sendTags)

        console.log(imageInput.name)
        var formdata = new FormData();
        if(sendTags  && token && user ){
            formdata.append('Image', imageInput)
            formdata.append('Title', imageName);
            formdata.append('Tags', sendTags);
            formdata.append('token', token);
            formdata.append('Poster', user);
        }
        console.log(formdata);
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        };

        const url = 'http://localhost:8000/Post';
        axios.post(url, formdata, config).then((res) =>{
            alert(res.data);
            e.target.reset();
        }).catch((err) => {
            alert(err.response.data);
            var temp = err.response.data
            if(temp === 'Invalid Token' || temp === 'Token Expired, Please Log In'){
                nav('/SignIn')
            }
        });
    }

    return(
        <>
        <Navbar></Navbar>
        <center>
            <div id="PostDiv">
                <Link to='/?page=1' id='PostHome'>←Home</Link>
                <h1 id="PostTitle">Upload Image</h1>
                <form id="PostForm" onSubmit={HandleUpload}>
                <input type="file" id="ImageInput" name="image_url" accept="image/png, image/jpeg" onChange={(e) => {setImageInput(e.target.files[0])}}></input>

                <label id="PostT1">Enter Title</label>
                <input type='text' placeholder="Enter Title" id = "ImageName" name="ImageTitle" onChange={(e) => {setImageName(e.target.value)}}></input>

                <label id="PostT2">Enter Tags (Enter With Spaces)</label>
                <input type='text' placeholder="Enter Title" id = "ImageName" name="ImageTitle" onChange={(e) => {setImageTags(e.target.value)}}></input>

                <button id="PostButton">Upload</button>
                </form>
            </div>
        </center>
        </>
    )
}