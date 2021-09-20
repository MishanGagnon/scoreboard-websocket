let quarter = 0
const quarters = ["1st", "2nd", "3rd", "4th"]
const quarterH1 = document.getElementById("quarter")
const downsAndYardsPreview = document.getElementById("downsAndYardsPreview")
const homeScore = document.getElementById("teamOneScore")
const awayScore = document.getElementById("teamTwoScore")
const flag = document.getElementById("flag")
let previousHomeScore;
let previousAwayScore;
let initialLoad = true

let url = window.location.hostname
let protocol = "wss://"
if(url === "localhost"){
    url+= ":3000"
    protocol = "ws://"
}
let socket = WebSocket
const createWebsocket = () => {
    socket = new WebSocket(protocol + url)
    socket.addEventListener('open', (event)=>{
        console.log("connected to server")
    })
    socket.addEventListener('close', (event)=>{
        console.log("connected to server")
        setTimeout(createWebsocket, 1000)
    })
    socket.addEventListener("message", (event)=>{
        data = JSON.parse(event.data)
        console.log(data)
        if(data.teamOne != undefined){
            if(initialLoad){
                previousHomeScore = data.teamOne
                resetAnimation(homeScore, data.teamOne, "Small")
            }
            else{ 
                if(previousHomeScore != data.teamOne){
                    resetAnimation(homeScore, data.teamOne, "Small")
                    previousHomeScore = data.teamOne
                }
            }
        }
        if(data.teamTwo != undefined){
            if(initialLoad){
                previousAwayScore = data.teamTwo
                resetAnimation(awayScore, data.teamTwo, "Small")
            }
            else{ 
                if(previousAwayScore != data.teamTwo){
                    resetAnimation(awayScore, data.teamTwo, "Small")
                    previousAwayScore = data.teamTwo
                }
            }
            
        }
        if(data.quarter != undefined){
            quarter = data.quarter
            resetAnimation(quarterH1, quarters[quarter], "")
        }
        if(data.downsAndYards != undefined){
            resetAnimation(downsAndYardsPreview, data.downsAndYards, "")
            initialLoad = false
        }
        if(data.flag != undefined){
            console.log("recieved flag")
            flag.classList.add("flag")
            setTimeout(()=>{flag.classList.remove("flag")},5500)
        }
    })
}

const resetAnimation = (tag, data, size) => {
    tag.classList.add("downFromBelow" + size)
    setTimeout(()=>{
        tag.classList.remove("downFromBelow"+ size)
        tag.innerText = data
        tag.classList.add("upFromBelow"+ size)
        setTimeout(()=>{
            tag.classList.remove("upFromBelow"+size)
        },500)
    },500)

}

createWebsocket()