class Sender {
  worker = null

  constructor() {
    if (window.Worker) {
      this.worker = new Worker("scripts/workers/senderWorker.js")
      this.worker.onmessage = (event) => this._receivedWorkerStatus(event.data)
    } else {
      throw new Error(
        "Worker not supported. Failed to initilialise senderWorker."
      )
    }
  }

  sendMessage(toUser, message) {
    this.worker.postMessage({
      to: { id: toUser },
      message: message,
    })
  }

  _receivedWorkerStatus(data) {
    console.log("sender received from worker", data)
  }

  close() {
    this.worker.terminate()
  }
}
