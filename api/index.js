require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const app = express();
const User = require('./model/user');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' }) 
const fs = require('fs');
const Post = require('./model/Post');

const secret = process.env.JWT_SECRET || 'nvpfuvbaiwfavieri';
const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS) || 10);

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3000'].filter(Boolean);
console.log('Allowed Origins:', allowedOrigins);

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        console.log('Request Origin:', origin);
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error('CORS blocked for origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());
app.use(cookieparser());
app.use('/uploads',express.static(__dirname+'/uploads'));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});


app.post('/register', async(req,res)=>{
    const {username,password} = req.body;
    try{
        const userDoc =  await User.create({
            username,password:bcrypt.hashSync(password,salt)
        })
        res.json(userDoc);
    }catch(e){
        res.status(400).json(e);
    }
});

app.post('/login',async(req,res)=>{
    const{username,password} = req.body;
    try {
        const UserDoc = await User.findOne({username});
        if (!UserDoc) {
            return res.status(400).json('User not found');
        }
        
        const passOk = bcrypt.compareSync(password,UserDoc.password);
        if(passOk){
            jwt.sign({username,id:UserDoc._id},secret,{},(err,token)=>{
                if(err) throw err;
                res.cookie('token', token, {
                    sameSite: 'none',
                    secure: true,
                }).json({
                    id: UserDoc._id,
                    username,
                });
            })
        }
        else{
            res.status(400).json('wrong credentials');
        }
    } catch(e) {
        res.status(500).json('Server error during login');
    }
});

app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json('No token provided');
    }
    jwt.verify(token,secret,{}, (err,info)=>{
        if(err) return res.status(401).json('Invalid token');
        res.json(info);
    })
})

app.post('/logout',(req,res)=>{
    res.cookie('token', '', {
        sameSite: 'none',
        secure: true,
    }).json('ok');
});

app.post('/post',uploadMiddleware.single('files'),async (req,res)=>{
    // res.json(req.file);
    const { originalname,path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext
    fs.renameSync(path,newPath);

    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json('No token provided');
    }
    jwt.verify(token,secret,{},async (err,info)=>{
        if(err) return res.status(401).json('Invalid token');
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        });
        res.json(postDoc);
    });
});

app.put('/post',uploadMiddleware.single('files'), async(req,res) =>{
    let newPath = null;
    if(req.file){
         const { originalname,path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path+'.'+ext
        fs.renameSync(path,newPath);
    }
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json('No token provided');
    }
    jwt.verify(token,secret,{},async (err,info)=>{
        if(err) return res.status(401).json('Invalid token');
        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({title,
            summary,
            content,
            cover:newPath?newPath:postDoc.cover,
        });

        res.json('ok');
    });
});

app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({
            message: 'Error fetching posts',
            error: err.message
        });
    }
})

app.get('/post/:id',async(req,res)=>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})  

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
