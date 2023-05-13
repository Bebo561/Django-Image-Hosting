import React from 'react';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles/ImageDetails.css';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function ImageDetails(){
    var [Image, setImage] = useState<any>();
    var [loading, setLoading] = useState<Boolean>();
    var [comments, setComments] = useState<any>([]);
    var [commentInput, setCommentInput] = useState('');
    const nav = useNavigate();
    const user = sessionStorage.getItem("User");
    const currentURL = window.location.href;
    const id = parseInt(currentURL.slice(31));
    const page = sessionStorage.getItem("page");

    function RetrieveDetails(){
        const url =  'http://localhost:8000/Details?q=' + id;
        setLoading(true);
        axios.get(url).then((res) => {
            console.log(res.data);
            setImage(res.data);
            setLoading(false);
            //console.log(`data:image/png;base64,${images}`)
        }).catch((err) =>{
            alert(err);
        });
    }

    function RetrieveComments(){
        const url =  'http://localhost:8000/Comments?q=' + id;
        axios.get(url).then((res) => {
            setComments(res.data.Comments);
            console.log(res.data)
        }).catch((err) =>{
            alert(err);
        });
    }

    useEffect(() =>{
        RetrieveDetails();
        RetrieveComments();
    }, []);

    function HandleDownload(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        var Base64 = Image.img;
        if(Base64.substr(0,8) === "iVBORw0K" ){
            var a = document.createElement("a"); 
            a.href = "data:image/png;base64," + Base64; 
            a.download = "Image.png"; 
            a.click(); 
        }
        else{
            var a = document.createElement("a");
            a.href = "data:image/jpeg;base64," + Base64;
            a.download = "Image.jpeg"; 
            a.click(); 
        }
    }

    function HandleDelete(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        var token = sessionStorage.getItem("token");
        const url =  'http://localhost:8000/Details';
        const data = {
            Token: token, 
            Poster: user,
            Id: id
        }
        axios.delete(url, { data: {data} }).then((res) => {
            alert("Success")
            nav("/");
        }).catch((err) => {
            alert(err.response.data);
            var temp = err.response.data
            if(temp === 'Invalid Token' || temp === 'Token Expired, Please Log In'){
                nav('/SignIn')
            }
        })
    }

    function SubmitComment(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        var token = sessionStorage.getItem("token");
        var data = {
            "Image_id": id,
            "Poster": user,
            "Details": commentInput,
            "token": token
        }
        var com = {
            "Image_id": id,
            "Poster": user,
            "Details": commentInput,
            "Likes": 0
        }
        const url = 'http://localhost:8000/Comments';
        axios.post(url, data).then((res) =>{
            alert(res.data)
            setComments((comments: any) => [...comments, com]);
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
            <div id="detail-bg">
            {loading &&
            <center>
                <h1 id="detail-Loading">Loading...</h1>
            </center>}
            
            {Image && loading === false &&
                <>
                <Link to={`/?page=${page}`} id="detail-Link">←Home</Link>
                <center>
                <h1 id="detail-Title">{Image.Title}</h1>
                {Image.img.substr(0,8) === "iVBORw0K" ?
                <img src={`data:image/png;base64,${Image.img}`} alt="Img" key={Image.Id} id="detail-Img" ></img>
                :
                <img src={`data:image/jpeg;base64,${Image.img}`} alt="Img" key={Image.Id} id="detail-Img" ></img>
                }
                <div id="detail-information">
                    <h1>Information</h1>
                    <hr></hr>
                    <h2>Poster - {Image.Poster}</h2>
                    <hr></hr>
                    <h2>ID - {Image.Id}</h2>
                    <hr></hr>
                    <h2>Tags - {Image.Tags}</h2>
                </div>
                <button id="detail-Download" onClick={HandleDownload}>Download</button>
                </center>
                {user === Image.Poster &&
                    <button id="detail-Delete" onClick={HandleDelete}>Delete</button>
                }
                {user !== null && <div id="detail-Comments">
                    <center>
                        <h1 id="detail-Comments-Header">Comments</h1>
                    <div id="write-Comment">
                        <label id="write-Comment-Label">Write A Comment</label><br></br>
                        <textarea name="input-Comment" id="input-Comment" onChange={(e) => {setCommentInput(e.target.value)}}></textarea><br></br>
                        <button id="comment-Submit" onClick={SubmitComment}>Post</button>
                    </div>
                    </center>

                </div>
                }
                <center>
                {comments.map((comment:any) => {
                        return(
                            <>
                            <div id="comment-Holder">
                                <h1 id="comment-Poster">{comment.Poster}</h1>
                                <h2 id="comment-Details">{comment.Details}</h2>
                            </div>
                            </>
                        )
                    })}
                </center>
                </>
            }
            </div>
        </>
    )
}