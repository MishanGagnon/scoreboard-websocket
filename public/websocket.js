let quarter = 0
    const quarters = ["1st", "2nd", "3rd", "4th"]
    const input = document.querySelector("input")
    const it = document.getElementById("iterator")
    const quarterH1 = document.getElementById("quarter")
    const downsAndYardsInput = document.getElementById("downsAndYardsInput")
    const downsAndYardsPreview = document.getElementById("downsAndYardsPreview")
    input.addEventListener("input", ()=>{updateIterator()})
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
            console.log("disconneted from server")
            setTimeout(createWebsocket,1000)
        })

        socket.addEventListener("message", (event)=>{
            data = JSON.parse(event.data)
            if(data.teamOne != undefined || data.teamTwo != undefined){
                document.getElementById("teamOneScore").innerText = "Home: \n" + data.teamOne
                document.getElementById("teamTwoScore").innerText = "Away: \n" + data.teamTwo
            }
            if(data.iterator != undefined){
                it.value = data.iterator
            }
            if(data.quarter != undefined){
                quarter = data.quarter
                quarterH1.innerText = quarters[quarter]
            }
            if(data.downsAndYards != undefined){
                downsAndYardsPreview.innerText = data.downsAndYards
            }
        })
    }
    createWebsocket()

    const sendFlag = () => {
        socket.send(JSON.stringify({flag: "ping"}))
        console.log("sending flag")
    }
    const sendMessage = (val, teamNum) => {
        updateIterator()
        socket.send(JSON.stringify({value: val, teamNumber: teamNum}))
    }

    const reset = () => {
        sendMessage("reset",0);
    }
    const updateIterator = () => {
        if(it.value === ""){
            socket.send(JSON.stringify({iterator: 0}))
        }else{
            socket.send(JSON.stringify({iterator: it.value}))
        }
    }

    const updateQuarter = (val) => {
        if(quarter + val >= 0 && quarter + val <= 3){
            quarter += val
            quarterH1.innerText = quarters[quarter]
            socket.send(JSON.stringify({quarter: quarter}))
        }
    }
    const createQR = () =>{
        const encodedURL = encodeURI(window.location.hostname)
        fetch("https://api.qrserver.com/v1/create-qr-code/?data=" + encodedURL + "&size=100x100")
            .then(response => {
                let qrIMG = document.getElementById("qr") 
                qrIMG.src = response.url
            })
        document.getElementById("qrButton").hidden = true
    }

    const setDownsAndYards = () => { 
        let downs = downsAndYardsInput.value.slice(0,1)
        let yards = String(parseInt(downsAndYardsInput.value.slice(1, downsAndYardsInput.value.length)))
        console.log(yards)
        if((Number.isInteger(parseInt(downs)) && (parseInt(downs) <= 4))){
            if(Number.isInteger(parseInt(yards)) || yards.toLowerCase() === "goal"){
                if(yards.toLowerCase() === "goal"){
                    yards = "Goal"
                }
                let str = quarters[parseInt(downs)-1] + " & " + yards
                downsAndYardsPreview.innerText = str
                socket.send(JSON.stringify({downsAndYards: str}))
            }else{
                console.log("bad input")
            }
        }else{ 
            console.log("bad input")
        }

        console.log(Number.isInteger(parseInt(downsAndYardsInput.value)))
    }