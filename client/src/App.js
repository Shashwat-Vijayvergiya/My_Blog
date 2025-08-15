import './App.css';
import Layout from './Layout';
import LoginPage from './component/LoginPage';
import Register from './component/Register';
import {Route, Routes,} from 'react-router-dom';
import { UserContextProvider } from './component/UserContext';
import CreatePost from './component/CreatePost';
import IndexPage from './IndexPage';
import PostPage from './component/PostPage';
import EditPost from './component/EditPost';

function App() {
  return (
   <>
   <UserContextProvider>
      <Routes>

         <Route path='/' element={<Layout/>}>
            <Route index element={<IndexPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/create' element = {<CreatePost/>}/>
            <Route path='/post/:id' element={<PostPage/>} />
            <Route path='/edit/:id' element={<EditPost/>} />
         </Route>     
      </Routes>
   </UserContextProvider>
      
   </>
  );
}

export default App;
