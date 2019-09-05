require('dotenv').config()
const Telegram = require('telebot');
const axios = require('axios');
const bot = new Telegram(process.env.BOT_TOKEN);

bot.on('/start', (msg) =>{
    msg.reply.text(`Hello, I am the Telegram Bot for https://francisoliver.dev!\n\nI can help you browse and look at the posts from my personal blog through Telegram. \n\nUse the command /posts to get all the posts from the blog. \nUse the command /search <query> to do a search in the blog. \nUse the command /tag <query> to show all the posts included in that tag.`);
});

bot.on('/help', (msg) =>{
    msg.reply.text(`Here are the commands! \n\nUse the command /posts to get all the posts from the blog. \nUse the command /search <query> to do a search in the blog. \nUse the command /tag <query> to show all the posts included in that tag`);
});


bot.on('/posts', (msg) =>{
    msg.reply.text(`Here are all the posts from the blog!`);
    axios.get('https://francisoliver.dev/api/posts.json').then(response => {
        for(let post of response.data){
            msg.reply.text(`Title: ${post.title}\n\nURL: ${post.url}`);
        }
    });
});

bot.on(/^\/search (.+)$/, (msg, props) =>{
    let query = props.match[1];
    msg.reply.text(`Here are the blog posts regarding your query: ${query}`);
    axios.get('https://francisoliver.dev/api/posts.json').then(response => {
        let includedPosts = []
        for(let post of response.data){
            console.log(post.title.toLowerCase());
            if (post.title.toLowerCase().includes(query.toLowerCase()) || post.excerpt.toLowerCase().includes(query.toLowerCase())) {
                includedPosts.push(post);
                msg.reply.text(`Title: ${post.title}\n\nURL: ${post.url}`);
            }
        }

        if(includedPosts.length === 0) {
            msg.reply.text('No posts regarding your search query');
        }
    });
});

bot.on(/^\/tag (.+)$/, (msg, props) =>{
    let query = props.match[1];
    msg.reply.text(`Here are the blog posts with the tag: ${query}`);
    axios.get('https://francisoliver.dev/api/posts.json').then(response => {
        let includedPosts = []
        for(let post of response.data){
            console.log(post.title.toLowerCase());
            if (post.tags.toLowerCase().includes(query.toLowerCase())) {
                includedPosts.push(post);
                msg.reply.text(`Title: ${post.title}\n\nURL: ${post.url}`);
            }
        }

        if(includedPosts.length === 0) {
            msg.reply.text(`No posts with the tag ${query}`);
        }
    });
});

bot.start();