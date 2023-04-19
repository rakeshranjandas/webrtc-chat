var connectionEstablishedMap = new Map() // [user.id] => localDataChannel
var connectionRequestQueue = [] // Queue(Array) of connectionRequest
var pendingMessagesQueueMap = new Map() // [user.id] => Array of messages

onmessage = (event) => {
  const { to, message } = event.data

  // 1) If connection established, send message through datachannel
  const localDataChannel = connectionEstablishedMap.get(to.id)

  if (localDataChannel !== undefined) {
    localDataChannel.send(message)
    return
  }

  // 2) If connection NOT established
  // 2.1) If present in pending queue, then append
  const pendingQueue = pendingMessagesQueueMap.get(to.id)

  if (pendingQueue !== undefined) {
    pendingQueue.push(message)
    return
  }

  // 2.2) If NOT present in queue, then create new connection request
  pendingMessagesQueueMap.set(to.id, [])
  pendingMessagesQueueMap.get(to.id).push(message)

  connectionRequestQueue.push(
    new ConnectionRequest(to.id, (localDataChannel) => {
      const pendingQueue = pendingMessagesQueueMap.get(to.id)
      while (pendingQueue.length) {
        localDataChannel.send(pendingQueue.shift())
      }

      pendingMessagesQueueMap.delete(to.id)
      connectionEstablishedMap.set(to.id, localDataChannel)
    })
  )
}

class ConnectionRequest {
  _state = null // "PENDING" | "REGISTERED" | "ESTABLISHED"
  _to = null // id of to user
  _onEstablished = null // Callback on Established success. Parameter = localDataChannel
  _locked = false // lock to prevent multiple instances of process

  constructor(to, onEstablished) {
    this._state = "PENDING"
    this._to = to
    this._onEstablished = onEstablished
    this._locked = false
  }

  isEstablished() {
    return this._state === "ESTABLISHED"
  }

  process() {
    if (this._locked) return
    this._locked = true

    switch (this._state) {
      case "PENDING":
        this._doRegister()
        break

      case "REGISTERED":
        this._doEstablish()
        break
    }
  }

  async _doRegister() {
    /*
        fetch().then(() => {
            this._state = "REGISTERED"
            this._locked = false
        })
    */
  }

  async _doEstablish() {
    /*
        fetch().then(() => {
            this._state = "ESTABLISHED"
            this._locked = false
            this._onEstablished(localDataChannel)
        })
    */
  }
}
