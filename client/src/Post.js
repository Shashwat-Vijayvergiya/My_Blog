import {format} from 'date-fns';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

export default function Post({_id,title,summary,cover,content,createdAt,author}){
    return(
      <>
        <div className="post">
          <div className="image">
            <Link to={`/post/${_id}`}>
              <img src={`${API_BASE_URL}/${cover}`} alt='render wala' />
            </Link>
          </div>
          <div className="texts">
            <Link to={`/post/${_id}`}>
              <h2>{title}</h2>
            </Link>
            <p className="info">
              <a href="/" className="author">{author.username}</a>
              <time>{format(new Date(createdAt),'MMM d, yyyy HH:mm')}</time>
            </p>
            <p className='summary'>{summary}</p>
          </div>
        </div>
      </>
    )
}