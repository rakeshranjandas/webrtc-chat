const sender = {
  _pendingQueueMap: new Map(),

  sendMessage: function (to, message) {
    const channel = ChannelCache.get(to)
    if (channel !== undefined) {
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
}
