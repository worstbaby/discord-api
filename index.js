const Discord = require("discord.js"),
    client = new Discord.Client();

const express = require("express"),
    cors = require("cors"),
    app = express();

app.use(cors());

require("dotenv").config()
const PORT = process.env.PORT || '80';

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

client.on("ready", () => {
  client.user.setActivity("api esta online!");
})

const got = require("got");

const name = require("package.json").name,
    description = require("package.json").description,
    version = require("package.json").version,
    author = require("package.json").author

// GET AVATAR URL
app.get("/avatar/:userID", cors(corsOptions), (req, res) => {
    client.users.fetch(req.params.userID).then((user) => {
        const results = ({ url: `${user.displayAvatarURL({ format: "png", size: 4096, dynamic: true })}`});
        return res.send(results);
    });
});

// GET USER
app.get("/user/:userID", cors(corsOptions), (req, res) => {
    client.users.fetch(req.params.userID).then((user) => {
        const results = ({ user: `${user.username + '#' + user.discriminator}` });
        return res.send(results);
    });
});

// GET USER+AVATAR
app.get("/useravatar/:userID", cors(corsOptions), (req, res) => {
    client.users.fetch(req.params.userID).then((user) => {
        const results = ({ user: `${user.username + '#' + user.discriminator}`, avatar: `${user.displayAvatarURL({ format: "png", size: 4096, dynamic: true })}` });
        return res.send(results);
    });
});

// RANDOM ICON

app.get("/random", cors(corsOptions), (req, res) => {
    const targetGuild = client.guilds.cache.get('951293335232978955')
    let targetMembers = targetGuild.members.cache.filter(member => {
        return member.user.displayAvatarURL
    }) 
    if(targetMembers.size === 0) return

    let randUser = targetMembers.random() 
        const results = ({ url: `${randUser.user.displayAvatarURL({ format: "png", size: 4096, dynamic: true })}`});
        return res.send(results);
  });

// RANDOM WALLPAPER

app.get("/wallpaper", cors(corsOptions), (req, res) => {
    got("https://www.reddit.com/r/wallpaper/random/.json").then(response => {
    const [list] = JSON.parse(response.body);
    const [post] = list.data.children;

    const permalink = post.data.permalink;
    const test = `https://reddit.com${permalink}`;
    const image = post.data.url;

        const results = ({ wpp: `${image}` });
        return res.send(results);
  })});


// SERVER

app.get("/guild/:guildID", cors(corsOptions), (req, res) => {
    client.guilds.fetch(req.params.guildID).then((guild) => {
        const results = ({ guildusers_count: `${guild.members.cache.size} ` + `members` });
        return res.send(results);
    });
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry, can't find that! The route is [/user/:USERID] or [/guild/:GUILDID]")
});

app.use(function (req, res, next) {
    res.status(201).send("Missing parm")
});


app.use(function (req, res, next) {
    res.status(403).send("Missing access")
});

app.use(function (req, res, next) {
    res.status(500).send("Internal Server Error")
});

client.on("ready", () => {
    console.log(`The API is now online! Bot: ${client.user.username}`)
});

var server = app.listen(PORT, console.log(`api is listing to`, PORT));
server.keepAliveTimeout = 30 * 1000;
server.headersTimeout = 35 * 1000;

client.login(process.env.TOKEN);