import { useEffect, useState } from "react";
import {Navigate, useParams} from 'react-router-dom';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
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


export default function EditPost() {
    const {id} = useParams();
    const[title,settitle] = useState('');
    const [summary,setsummary] =  useState('');
    const[content,setcontent] = useState('');
    const [files,setfiles] = useState('');
    const [redirect,setredirect] = useState(false);
    
    useEffect(()=>{
        fetch(`${API_BASE_URL}/post/${id}`)
        .then(response => {
            response.json().then(postInfo=>{
                settitle(postInfo.title);
                setcontent(postInfo.content);
                setsummary(postInfo.summary);
            })
        })
    },[id]);

    const HandleTitle =(event)=>{
        settitle(event.target.value);
    }

    const HandleSummary =(event)=>{
        setsummary(event.target.value);
    }

    const HandleFile = (event)=>{
        setfiles(event.target.files);
    }

    async function updatePost(ev){
        ev.preventDefault(); 

        const data = new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('id',id);
        if(files?.[0]){
            data.set('files',files?.[0]);
        }
        const response = await fetch(`${API_BASE_URL}/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            console.log("Redirecting...");
            setredirect(true);
        } else {
            const error = await response.text();
            console.log("Update failed:", error);
        }

    }

   if(redirect){
          return <Navigate to={'/'}/>
      }
      return (
          <>
          <form onSubmit={updatePost}>
              <input type="title" placeholder={'Title'} value={title} onChange={HandleTitle} />
              <input type="summary" placeholder={"Summary"} value={summary} onChange={HandleSummary} />
              <input type="file" onChange={HandleFile}/>
              <ReactQuill value={content} onChange={newValue=>setcontent(newValue)} modules={modules} formats={formats}/>
              <button type="submit" style={{marginTop:'10px'}}>Update Post</button>
          </form>
          </>
      )
}
