//Initialize bot

const Discord = require('discord.js');
const Events = Discord.Events;
const client = new Discord.Client();
const studyCornerID = '327364619137974274';

console.log("Connecting...")
client.login('MzI3MzY4MzMxNDI4NDk1MzYw.DC0Zvw.RLJhdJq6PoXj-dkaVvXmKcCFa3k');

//Roles
var roleID = ["327378554771734529"];


//Client functions

//Command string manipulator
function commandIs(str, msg) {
    return msg.content.startsWith("~" + str);
}

//Get member's role
function pluck(array) {
    return array.map(function (item) { return item["name"]; });
}

//Check if member has role
function hasRole(message) {
    let modRole = message.guild.roles.find("name", "Wammus");
    if (message.member.roles.has(modRole.id)){
        return true;
    }
    else {
        return false;
    }
}



//Client events

client.on('ready', e => {
    //Clear all roles

    let studyCorner = client.guilds.get(studyCornerID);
    let role = studyCorner.roles.find("name", "Main Study Room Pass");
    let members = studyCorner.members.array();
    //users.removeRole(roleID);
    
    

    for (var user = 0; user < members.length; user++) {
        console.log("User:" + members[user].nickname);
        if (members[user].roles.has(role.id)) {
            members[user].removeRole(role);
            console.log("A user has a pass");
        }
        
    }
    

    //Show connected
    console.log('Connected :)');
    client.user.setGame("Type ~help for info");

    greetingChannel = client.channels.get(greetingChannelID);

});


var greetingChannelID = "327364619137974274"
var greetingChannel =""

client.on('guildMemberAdd', member => {

    greetingChannel.send("Welcome to Wammus' Study Corner, <@" + member.user.id + ">! This server is currently hosted by LemDaKilla (or Edison). " +
        "Feel free to ask him any questions by pinging him '@LemDaKilla'. Note that the topics he can cover are only the courses he is taking in the Computer Engineering program.");
});

//Commands
var cmds = ["pass","end","list","board"];

var pass = [];
var passSize = [0];


var comp = "https://scribblar.com/n7dhgbqrh";
var math = "Coming soon";

var board = [comp, math];


//Room Function 

function listRooms(guild) {
    let result = "Main Study Room (" + passSize+") :\n";
    for (let i = 0; i < passSize; i++) {
        result += (i + 1) + ": " + guild.members.get(pass[i]).user.username + "\n";
    }
    return result;
}

//Client message
client.on('message', message => {
    var args = message.content.split(" ");

    //Session Start

    /*
    Format : ~pass [id] [room]
    if no room number is entered, member will have access to main room.
    */
    var room = 0
    if (commandIs(cmds[0], message)) {
        //message.reply("lol ok ");
        if (hasRole(message)) {
            if (args.length > 1) {
                let getGuild = message.guild;
                let addUser = getGuild.member(message.mentions.users.first());
                
                    //console.log(user.id)
                if (args.length === 3 && !isNaN(args[2]))
                    room = parseInt(args[2]);

                if (room > 0 || args.length < 3) {

                    message.channel.send("Room pass " + room + "not available. Setting to room 0 (main).");
                    room = 0;
                }
                if (pass.includes(addUser.id)) {
                    message.channel.send(addUser.user.username + " already has the pass");
                }
                else {
                    let role = getGuild.roles.get(roleID[room]);
                    pass[passSize++] = addUser.id;
                    console.log(addUser.constructor.name);

                    addUser.addRole(role).then(newUser => {
                        let newName = newUser.user.username
                        return message.channel.send(newName + ' was given a ' + role.name);
                    }).catch(console.error);
                }
            }
        }
    }

    //End session
    if (commandIs(cmds[1], message)) {
        if (hasRole(message)) {
            console.log("emptying ");
                
            let getGuild = message.guild;
            if (args.length === 2 && !isNaN(args[1])) { 
            room = parseInt(args[1]);
            }

            if (room > 0 || args.length < 2) {
                message.channel.send("Emptying main room...");
                room = 0;
            }

            for (var i = 0; i < passSize; i++) {
                let user = getGuild.members.get(pass[i])
                let role = getGuild.roles.get(roleID[room]);
                console.log(user.constructor.name);
                user.removeRole(role).catch(console.error);
                pass[i] = null;
                passSize = 0;
            }
            message.channel.send("Session ended");
        }
    }

    //List of people who have passes
    if (commandIs(cmds[2], message)) {
        let list = listRooms(message.guild);
        message.channel.send(list);
    }

    //Whiteboards
    if (commandIs(cmds[3], message)) {
        if (args.length == 1) {
            message.reply("Selections : \n"+ "comp:0, math:1")
        }
        else {
            if (args[1] == "0" || args[1].toLowerCase == "comp") {
                message.channel.send("COMP selected");
            }
            else {
                message.channel.send("MATH selected");
            }
            message.channel.send("Whiteboard link: " + board[args[1]]);

            for (let i = 0; i < passSize; i++) {
                let passUser = message.guild.members.get(pass[i])
                passUser.send("Password is uofmece");
                console.log("Pass sent to " + passUser.user.username);
            }
        }
    }

    
});



