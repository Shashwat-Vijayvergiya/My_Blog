import { useEffect, useState } from 'react';
import Post from './Post';
import { API_BASE_URL } from './config';

export default function IndexPage(){
    const [posts,setposts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setIsLoading(true);
        fetch(`${API_BASE_URL}/post`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(posts => {
                setposts(posts);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError(err.message);
                setIsLoading(false);
            });
    }, [])

    if (isLoading) return <div style={{padding: '20px'}}>Loading posts...</div>;
    if (error) return <div style={{padding: '20px', color: 'red'}}>Error loading posts: {error}</div>;

    return(
    <>
        {posts.length > 0 ? (
            posts.map(post=>(
                <Post key={post._id} {...post}/>
            ))
        ) : (
            <div style={{padding: '20px'}}>No posts found.</div>
        )}
    </>
)};