class Sender {
  _worker = null
  _pendingQueueMap = new Map()

  sendMessage(to, message) {
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
    this._requestWorker(to)
  }

  _requestWorker(to) {
    this._initWorker()
    this._worker.postMessage({ to })
  }

  _initWorker() {
    if (this._worker) return
    if (!window.Worker)
      throw new Error(
        "Worker not supported. Failed to initilialise senderWorker."
      )
    this._worker = new Worker("scripts/workers/senderWorker.js")
    this.worker.onmessage = (event) => this._onConnectionSuccess(event.data)
  }

  _onConnectionSuccess({ to, channel }) {
    const pendingQueue = this._pendingQueueMap.get(to)
    while (pendingQueue.length) {
      channel.send(pendingQueue.shift())
    }

    ChannelCache.set(to, channel)
  }

  close() {
    if (this._worker) this._worker.terminate()
  }
}
