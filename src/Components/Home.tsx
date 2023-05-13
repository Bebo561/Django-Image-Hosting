import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'
import './Styles/home.css'

export default function Home(){
    const nav = useNavigate();
    var [images, setImages] = useState([]);
    var [currPage, setcurrPage] = useState(1);
    var [totalPages, setTotalPages] = useState(0);
    var [tags, setTags] = useState('');
    var [tagSearched, setTagSearched] = useState(false);
    var [loading, setLoading] = useState<Boolean>();
    function PopulatePage(){
        const currentURL = window.location.href;
        var page = (currentURL.slice(28));
        if(page === ''){
            page = '1';
        }
        var pageNo = page;
        setcurrPage(parseInt(page));
        const url = 'http://localhost:8000/Post?q=' + pageNo;
        setLoading(true);
        setImages([]);
        axios.get(url).then((res) => {
            setLoading(false);
            setImages(res.data);
        }).catch((err) =>{
            alert(err);
        });
    }

    function MaxPages(){
        const url = 'http://localhost:8000/Tags'
        axios.get(url).then((res) =>{
            var temp = res.data.count;
            var pageCount = Math.ceil(temp/10);
            setTotalPages(pageCount);
            console.log(totalPages)
        }).catch((err) =>{
            alert(err);
        });
    }

    useEffect(() =>{
        PopulatePage();
        MaxPages();
    }, []);

    function HandleSearch(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        if(tags === ''){
            setcurrPage(1);
            const url = 'http://localhost:8000/Post?q=' + 1;
            nav('/?page=1')
            setLoading(true);
            setTagSearched(false);
            setImages([]);
            axios.get(url).then((res) => {
                setLoading(false);
                setImages(res.data);
            }).catch((err) =>{
                alert(err);
            });
            return 0;
        }
        setLoading(true);
        setImages([]);
        setTagSearched(true);
        var tagArray = tags.split(" ");
        const url = 'http://localhost:8000/Tags';
        var data = {
            Tags: tagArray
        };
        console.log(data)
        axios.post(url, data).then((res) => {
            nav('/')
            setLoading(false);
            setImages(res.data);
        }).catch((err) =>{
            alert(err);
        })
    }

    function HandleDetailsRedirect(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        var x = e.currentTarget.id;
        sessionStorage.setItem("page", currPage.toString());
        if(x !== undefined){
            nav(`/Image?id=${x}`)
        }
    }

    function HandlePageSearch(e: React.KeyboardEvent<HTMLInputElement>){
        var p = currPage;
        if(e.key === "Enter" && currPage <= totalPages && currPage>= 1){
            nav(`/?page=${p}`);
            PopulatePage();
            return 0;
        }
    }

    function IncrementPage(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        var inc = currPage;
        if(inc + 1 <= totalPages){
            inc++;
            setcurrPage(inc);
            console.log(currPage)
            nav(`/?page=${inc}`)
            const url = 'http://localhost:8000/Post?q=' + inc;
            setLoading(true);
            setImages([]);
            axios.get(url).then((res) => {
                setLoading(false);
                setImages(res.data);
            }).catch((err) =>{
                alert(err);
            });
        }
        else{
            return 0;
        }
    }
    function DecrementPage(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        var dec = currPage
        if(dec - 1 > 0){
            dec--;
            setcurrPage(dec);
            nav(`/?page=${dec}`)
            const url = 'http://localhost:8000/Post?q=' + dec;
            setLoading(true);
            setImages([]);
            axios.get(url).then((res) => {
                setLoading(false);
                setImages(res.data);
            }).catch((err) =>{
                alert(err);
            });
        }
        else{
            return 0;
        }
    }
    return(
        <>
            <Navbar></Navbar>
            <div id="home-search-holder">
                <center>
                    <label id="tag-Label">Tag Search</label><br></br>
                    <input type="text" onChange={(e) => {setTags(e.target.value)}} placeholder="Search" id="tag-Search"></input><br></br>
                    <button id="tag-Button" onClick={HandleSearch}>Search</button>
                    {totalPages !==0 && tagSearched === false && 
                    <>
                    <p>Max Page Count - {totalPages}</p>
                    <button id="home-Back" onClick={DecrementPage}>&#8678;</button>
                    <input type="number" id="home-Input" onKeyDown ={HandlePageSearch} placeholder={currPage.toString()} onChange={(e) => {setcurrPage(parseInt(e.target.value))}} min="1" max={totalPages}></input>
                    <button id="home-Forward" onClick={IncrementPage}>&#8680;</button>
                    </>}
                </center>
            </div>
            <div id = "img-grid">
                {loading &&
                <center>
                    <h1 id="home-Loading">Loading...</h1>
                </center>
                }
                {images.length !== 0 && 
                 images.map((image:any) => {
                    return (
                        <>
                        <div id="img-container">
                        {image.img.substr(0,8) === "iVBORw0K" ?
                        <img src={`data:image/png;base64,${image.img}`} alt="Img" key={image.Id} id="imgs" ></img>
                        :
                        <img src={`data:image/jpeg;base64,${image.img}`} alt="Img" key={image.Id} id="imgs" ></img>
                        }
                            <div id="img-overlay"> 
                                    <div id="img-button-container">
                                        <center>
                                            <button className="img-button" onClick={HandleDetailsRedirect} id={image.id}>See More</button>
                                         </center>
                                    </div>
                            </div>
                        </div>
                        </>
                    );
                  })
                }
            </div>
        </>
    )
}