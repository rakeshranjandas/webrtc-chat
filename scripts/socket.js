var socketConn = null
const socketUrl = "ws://localhost:8081"
const connChannelLabelPref = "channel"
const senderConnChannelMap = new Map()

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
      generateSenderSDP(socketMessage.to, (senderSDP) => {
        sendSenderSDP(socketMessage.to, senderSDP)
      })

      break

    case "FOR_RECEIVER_SENDER_SDP":
      /*
        socketMessage = {type, from, sdp}
      */
      generateReceiverSDP(socketMessage.sdp, (receiverSDP) => {
        sendReceiverSDP(socketMessage.from, receiverSDP)
      })
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

function generateSenderSDP(to, onSuccessSDPCreate) {
  const senderConn = new RTCPeerConnection()

  senderConn.onicecandidate = (e) => {
    if (e.candidate) onSuccessSDPCreate(senderConn.localDescription)
  }

  const senderChannel = senderConn.createDataChannel(
    connChannelLabelPref + "_" + to.toString()
  )
  senderChannel.onopen = () => {
    console.log("Sender Channel open")
    ChannelCache.set(to, senderChannel)
    sender.sendPendingMessagesInChannel(to)
  }
  senderChannel.onclose = () => console.log("Sender Channel close")
  senderChannel.onmessage = ({ data }) => console.log("Sender received:", data)

  senderConnChannelMap.set(to, {
    conn: senderConn,
    channel: senderChannel,
  })

  senderConn.createOffer().then((o) => senderConn.setLocalDescription(o))
}

function generateReceiverSDP(senderSDP, onSuccessRSDPCreate) {
  const receiverConn = new RTCPeerConnection()
  receiverConn.onicecandidate = (e) => {
    if (e.candidate) onSuccessRSDPCreate(receiverConn.localDescription)
  }

  receiverConn.ondatachannel = ({ channel }) => {
    const receiveChannel = channel
    receiveChannel.onopen = () => console.log("Receiver Channel open")
    receiveChannel.onclose = () => console.log("Receiver Channel close")
    receiveChannel.onmessage = ({ data }) =>
      console.log("Receiver received:", data)

    receiverConn.channel = receiveChannel
  }

  receiverConn
    .setRemoteDescription(senderSDP)
    .then(() => receiverConn.createAnswer())
    .then((a) => receiverConn.setLocalDescription(a))
}

async function acceptAndSendMessage(to, sdp) {
  const { conn: senderConn, channel: senderChannel } =
    senderConnChannelMap.get(to)

  senderConn.setRemoteDescription(sdp).then(() => {
    console.log("Establish WebRTC Connection and send message.")
  })
}
