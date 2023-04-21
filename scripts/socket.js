var socketConn = null
const socketUrl = "ws://localhost:8081"

function initialiseSocket() {
  if (currentUser === 0) {
    alert("No Current User")
    return
  }

  socketConn = new WebSocket(socketUrl)
  socketConn.onopen = function (e) {
    console.log("Connection established!")
    sendSendRegister(currentUser)
  }

  socketConn.onmessage = function (e) {
    console.log(e.data)
    onSocketMessageReceive(JSON.parse(e.data))
  }

  socketConn.onclose = function (e) {
    console.log("Connection closed")
  }
}

function sendSendRegister(from) {
  socketConn.send(
    JSON.stringify({
      type: "REGISTER",
      from: from,
    })
  )
}

function sendSendRequest(to) {
  socketConn.send(
    JSON.stringify({
      type: "FROM_SENDER_SENDER_REQUESTING",
      to: to,
    })
  )
}

function sendReceiverReady() {
  socketConn.send(
    JSON.stringify({
      type: "FROM_RECEIVER_RECEIVER_READY",
    })
  )
}

function sendSenderSDP(to, sdp) {
  socketConn.send(
    JSON.stringify({
      type: "FROM_SENDER_SENDER_SDP",
      to: to,
      sdp: sdp,
    })
  )
}

function sendReceiverSDP(from, sdp) {
  socketConn.send(
    JSON.stringify({
      type: "FROM_RECEIVER_RECEIVER_SDP",
      from: from,
      sdp: sdp,
    })
  )
}

function sendSenderSent(to) {
  socketConn.send(
    JSON.stringify({
      type: "FROM_SENDER_SENT",
      to: to,
    })
  )
}

function onSocketMessageReceive(socketMessage) {
  switch (socketMessage.type) {
    case "FOR_RECEIVER_SENDER_REQUESTING":
      /*
        socketMessage = {type}
      */
      sendReceiverReady()
      break

    case "FOR_SENDER_RECEIVER_READY":
      /*
        socketMessage = {type, to}
      */
      generateSenderSDP(socketMessage.to).then((sdp) => {
        sendSenderSDP(socketMessage.to, sdp)
      })

      break

    case "FOR_RECEIVER_SENDER_SDP":
      /*
        socketMessage = {type, from, sdp}
      */
      generateReceiverSDP(socketMessage.from, socketMessage.sdp).then(
        (rsdp) => {
          sendReceiverSDP(socketMessage.from, rsdp)
        }
      )
      break

    case "FOR_SENDER_RECEIVER_SDP":
      /*
        socketMessage = {type, to, sdp}
      */
      acceptAndSendMessage(socketMessage.to, socketMessage.sdp).then(() =>
        sendSenderSent(socketMessage.to)
      )
      break
  }
}

async function generateSenderSDP() {
  return "_SDP_SENDER_"
}

async function generateReceiverSDP() {
  return "_SDP_RECEIVER"
}

async function acceptAndSendMessage(to, sdp) {
  console.log("Establish WebRTC Connection and send message.")
}
