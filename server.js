const Sequelize = require('sequelize');
        //Sequelize used as constructor, thus capitalized
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/wizard_news_seq_2208_db');

const User = conn.define('user', {
    name: {
        type: Sequelize.STRING
    }
        //sequelize defines user, creates model and calling conn.sync force:true creates table
        //models: abstraction for tables; queries can retrieve data
});

const Post = conn.define('post', {
    title: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.TEXT
    }
});

//Post.belongsTo(User);
User.hasMany(Post);

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

    }
    catch (ex) {
        console.log(ex);
    }
};

start();
