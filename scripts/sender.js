const sender = {
  _pendingQueueMap: new Map(),

  sendMessage: function (to, message) {
    const channel = ChannelCache.get(to)
    if (channel !== undefined) {
      console.log("sending message ", to, message)
      channel.send(message)
      return
    }

    const pendingQueue = this._pendingQueueMap.get(to)
    if (pendingQueue !== undefined) {
      pendingQueue.push(message)
      return
    }

    this._pendingQueueMap.set(to, [message])
    sendSendRequest(to)
  },

  sendPendingMessagesInChannel: function (to) {
    const pendingQueue = this._pendingQueueMap.get(to)

    if (pendingQueue === undefined) {
      console.error("Could not find to in _pendingQueueMap", to)
      return
    }

    const channel = ChannelCache.get(to)

    while (pendingQueue.length) {
      let message = pendingQueue.shift()
      console.log("sending message after channel first open", to, message)
      channel.send(message)
    }

    this._pendingQueueMap.delete(to)
  },
}
