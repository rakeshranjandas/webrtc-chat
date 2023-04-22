const receiver = {
  receiveMessage: function (fromUser, messageJSON) {
    const message = JSON.parse(messageJSON)
    const type = message.type

    switch (type) {
      case "sent":
        receivedFromUser(fromUser, message)
        this.sendReceivedSuccessAck(fromUser, message.id)
        break

      case "ack":
        receivedSuccessAck(message.id)
    }
  },

  sendReceivedSuccessAck: function (sendAckTo, messageId) {
    const channel = ChannelCache.get(sendAckTo)

    if (channel) {
      channel.send(
        JSON.stringify({
          type: "ack",
          id: messageId,
        })
      )
    }
  },
}
