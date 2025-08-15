import { useEffect, useState } from 'react';
import Post from './Post';
import { API_BASE_URL } from './config';

export default function IndexPage(){
    const [posts,setposts] = useState([]);
    useEffect(()=>{
        fetch(`${API_BASE_URL}/post`).then(response => {
            response.json().then(posts => {
                setposts(posts);
            })
        })
    }, [])
    return(
    <>
        {posts.length > 0 && posts.map(post=>(
            <Post {...post}/>
        ))}
    </>
)};