var connectionRequestQueue = [] // Queue(Array) of connectionRequest

onmessage = (event) => {
  const { to } = event.data

  connectionRequestQueue.push(
    new ConnectionRequest(to, (localDataChannel) => {
      postMessage({
        to,
        channel: localDataChannel,
      })
    })
  )
}

// Run Queue in Regular Intervals
var connectionRequestQueueTemp = [] // Temp Queue used while removing ESTABLISHED connection requests
setInterval(() => {
  while (connectionRequestQueue.length) {
    const popped = connectionRequestQueue.shift()

    if (popped.isEstablished()) continue

    connectionRequestQueueTemp.push(popped)
    popped.process()
  }

  // Swap
  ;[connectionRequestQueue, connectionRequestQueueTemp] = [
    connectionRequestQueueTemp,
    connectionRequestQueue,
  ]
}, 1000 * 10)

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
