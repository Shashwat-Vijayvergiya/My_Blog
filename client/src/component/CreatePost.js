import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import {Navigate} from 'react-router-dom';
import { API_BASE_URL } from '../config';


const modules = {
  toolbar: [
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  ['clean']
]
};
const formats = [
'header',
'bold', 'italic', 'underline', 'strike',
'list', 'bullet',
'link', 'image'
];


export default function CreatePost(){
    const[title,settitle] = useState('');
    const [summary,setsummary] =  useState('');
    const[content,setcontent] = useState('');
    const [files,setfiles] = useState('');
    const [redirect,setredirect] = useState(false);

    const HandleTitle =(event)=>{
        settitle(event.target.value);
    }

    const HandleSummary =(event)=>{
        setsummary(event.target.value);
    }

    const HandleFile = (event)=>{
        setfiles(event.target.files);
    }

    async function createNewPost(ev){
        const data = new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('files',files[0]);
        ev.preventDefault();
        const response = await fetch(`${API_BASE_URL}/post`,{
            method:'POST',
            body: data,
            credentials: 'include',
        });
        if(response.ok){
            setredirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }
    return (
        <>
        <form onSubmit={createNewPost}>
            <input type="title" placeholder={'Title'} value={title} onChange={HandleTitle} />
            <input type="summary" placeholder={"Summary"} value={summary} onChange={HandleSummary} />
            <input type="file" onChange={HandleFile}/>
            <ReactQuill value={content} onChange={newValue=>setcontent(newValue)} modules={modules} formats={formats}/>
            <button style={{marginTop:'10px'}}>Create Post</button>
        </form>
        </>
    )
}