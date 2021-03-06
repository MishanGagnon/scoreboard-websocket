const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const WebSocket = require('ws')

let teamOneScore = 3 
let teamTwoScore = 3
let scores = [teamOneScore, teamTwoScore]
let iterator = 0
let quarter = 0
let downsAndYards = "1st & 10"

const wss = new WebSocket.Server({server : server})

wss.on('connection', function connection(ws) {
    console.log("new connection to server")
    console.log(quarter)

    ws.send(JSON.stringify({teamOne : scores[0], teamTwo : scores[1], iterator: iterator, quarter: quarter, downsAndYards : downsAndYards}))

    ws.on('message', function incoming(message) {
        message = JSON.parse(message)
        if(message.value != undefined){
          if(message.value === "reset"){
            scores[0] = 0
            scores[1] = 0
          }else{
            if(scores[message.teamNumber] + (message.value * iterator) <= 0){
              scores[message.teamNumber] = 0
            }else{
              scores[message.teamNumber]+= (message.value * iterator)
            }
          }
        }
        wss.clients.forEach((client) => {
        client.send(JSON.stringify({teamOne : scores[0], teamTwo : scores[1]}))
      })

        if(message.quarter != undefined){
          quarter = message.quarter
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({quarter: quarter}))
          })
        }

        if(message.flag != undefined){
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({flag: "ping"}))
          })
        }
        if(message.iterator != undefined){
            if(!isNaN(parseInt(message.iterator))){
              iterator = parseInt(message.iterator)
            }
        }
        
        if(message.downsAndYards != undefined){
          downsAndYards = message.downsAndYards
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({downsAndYards: downsAndYards}))
          })
        }
    });
  
  });



  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
      console.log(`Our app is running on port ${ PORT }`);
  });