'use strict';
const whitelistedUsers=[
    '545703210539548684',// rush7
    '315590025712500746',// seven
    '851123172949884928',// pege
];
window.onload=()=>{
    const lanyardSocket=new WebSocket('wss://tcla.aspy.dev/socket');
    lanyardSocket.onopen=()=>{
        lanyardSocket.send(JSON.stringify({op:2,d:{subscribe_to_ids:whitelistedUsers}}));
    };
    lanyardSocket.onmessage=async(message)=>{
        const{d}=await JSON.parse(message.data);
        for(const rawUserData of Object.values(d)){
            const userData=rawUserData?.discord_user;
            if(!userData)continue;
            const UserObject={
                username:`${userData.username}#${userData.discriminator}`,
                status:rawUserData.discord_status
            };
            lanyardSocket.close();
            if(userData.avatar?.startsWith('a_')){
                UserObject.avatar=`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.gif`;
            }else if(userData.avatar==null){
                UserObject.avatar='./images/defaultAvatar.webp';
            }else{
                UserObject.avatar=`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
            }
            //MAIN USER ELEMENT, SUB ELEMENT OF LIST ELEMENT
            const userElement=document.createElement('div');
            userElement.classList.add('userElement');
            document.getElementById('userList').appendChild(userElement);
            //PFP ELEMENT, SUB-ELEMENT OF USER ELEMENT
            const PFPElement=document.createElement('img');
            PFPElement.classList.add('PFPElement',UserObject.status);
            PFPElement.src=UserObject.avatar;
            userElement.appendChild(PFPElement);
            //USERNAME ELEMENT, SUB-ELEMENT OF USER ELEMENT
            const usernameElement=document.createElement('div');
            usernameElement.classList.add('usernameElement');
            usernameElement.innerText=UserObject.username;
            userElement.appendChild(usernameElement);
        };
    };
    async function getOnline(){
        const online=await (await fetch('https://canary.discord.com/api/guilds/951293335232978955/widget.json')).json();
        document.getElementById('online').innerHTML=online.presence_count+' online';
    };
    getOnline();
};