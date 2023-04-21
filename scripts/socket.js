var socketConn = null
const socketUrl = "ws://localhost:8080"

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
    onSocketMessageReceive(e.data)
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

function sendSendRequest(from, to) {
  socketConn.send(
    JSON.stringify({
      type: "FROM_SENDER_SENDER_REQUESTING",
      from: from,
      to: to,
    })
  )
}

function sendReceiverReady(from) {
  socketConn.send(
    JSON.stringify({
      type: "FROM_RECEIVER_RECEIVER_READY",
      from: from,
    })
  )
}

function sendSenderSDP(from, sdp) {
  socketConn.send(
    JSON.stringify({
      type: "FROM_SENDER_SENDER_SDP",
      from: from,
      sdp: sdp,
    })
  )
}

function sendReceiverSDP(from, sdp) {
  socketConn.send(
    JSON.stringify({
      type: "FROM_RECEIVER_RECEIVER_SDP",
      from: from,
    })
  )
}

function sendSenderSent(from, to) {
  socketConn.send(
    JSON.stringify({
      type: "FROM_SENDER_SENT",
      from: from,
      to: to,
    })
  )
}

function onSocketMessageReceive(socketMessage) {
  switch (socketMessage.type) {
    case "FOR_RECEIVER_SENDER_REQUESTING":
      /*
        socketMessage = {type, from}
      */
      sendReceiverReady(currentUser)
      break

    case "FOR_SENDER_RECEIVER_READY":
      /*
        socketMessage = {type, to}
      */
      generateSenderSDP().then((sdp) => {
        sendSenderSDP(sdp)
      })

      break

    case "FOR_RECEIVER_SENDER_SDP":
      /*
        socketMessage = {type, from, sdp}
      */
      generateReceiverSDP().then((sdp) => {
        sendReceiverSDP(sdp)
      })
      break

    case "FOR_SENDER_RECEIVER_SDP":
      /*
        socketMessage = {type, to, sdp}
      */
      acceptAndSendMessage(socketMessage)
      break
  }
}

async function generateSenderSDP() {
  return "_SDP_SENDER_"
}

async function generateReceiverSDP() {
  return "_SDP_RECEIVER"
}

function socketRequestSend(to) {
  sendSendRequest(currentUser, to)
}
