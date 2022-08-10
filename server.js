const express = require('express');
const app = express();
/*
const db = require('./db');
const conn = db.conn;
const User = db.User;
const Post = db.Post;
*/

const { conn, User, Post } = require('./db');


app.use('/assets', express.static('assets'));
        //check if can find accessible assets folder

app.use(express.urlencoded({extended: false}));


app.post('/posts', async(req, res, next) => {
    try{
        const post = await Post.create(req.body);
        res.redirect(`/posts/${post.id}`);

    }
    catch(ex){
        next(ex);
    }
});

app.get('/', async(req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: [ User ]
        });

        const users = await User.findAll();
        res.send(`
        <html>
            <head>
                <title>Wizard News Seq</title>
                <link rel = 'stylesheet' href = '/assets/style.css'/>
            </head>
            <body>
                <h1>Wizard News Seq</h1>
                <main>
                <ul>
                    ${
                        posts.map ( post => {
                            return `
                                <li>
                                    <a href='/posts/${post.id}'>${ post.title } by ${post.user.name}
                                </li>
                            `
                        }).join('')
                    }
                </ul>
                <form method = 'post' action = '/posts'>
                    <input name = 'title' placeholder='title' />
                    <input name = 'content' placeholder = 'content'/>
                    <select name = 'userId'>
                        ${
                            users.map ( user => {
                                return `
                                    <option value='${user.id}'> ${user.name}</option>
                                `;
                            }).join('')
                        }
                    </select>
                    <button> Create </button>
                </main>
                </form>
            </body>
        </html>
        `)
    }
    catch(ex) {
        next(ex);
    }
});

app.get('/posts/:id', async(req, res, next) => {
    try {
            //findByPk returns one record at most (bc primary key)
        const post = await Post.findByPk(req.params.id,{
            include: [ User ]
        });
        res.send(`
        <html>
            <head>
            </head>
            <body>
                <h1>Wizard News Seq</h1>
                <h2>${post.title} by ${post.user.name}</h2>
                <p>${post.content}</p>
            </body>
        </html>
        `)
    }
    catch(ex) {
        next(ex);
    }
});

const start = async() => {
    try{
        console.log('starting');
        await conn.sync({ force: true});
                //wipes out existing models/tables
        const moe = await User.create({ name: 'moe'});
        const lucy = await User.create({ name: 'lucy'});
        const larry = await User.create({ name: 'larry'});
        const ethyl = await User.create({ name: 'ethyl'});
        await Post.create( { title: 'foo', content: 'this is the foo content', userId: moe.id});
        await Post.create( { title: 'bar', content: 'this is the bar content', userId: moe.id});
        await Post.create( { title: 'bazz', content: 'this is the bazz content', userId: lucy.id});

        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on port ${port}`));

    }
    catch (ex) {
        console.log(ex);
    }
};

start();
