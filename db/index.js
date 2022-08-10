const Sequelize = require('sequelize');
        //Sequelize used as constructor, thus capitalized
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/wizard_news_seq_2208_db');

//only keep models here

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

Post.belongsTo(User);
User.hasMany(Post);

//export 3 things: users, posts, post

module.exports = {
    User,
    Post,
    conn
}
