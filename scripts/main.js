const numberOfUsers = 4
var currentUser = 0

$(document).ready(function () {
  populateUserSelect()
})

function populateUserSelect() {
  let optionStr = ""
  for (let i = 1; i <= numberOfUsers; i++)
    optionStr += `<option value="${i}">${i}</option>`

  $("#user-id-select").html(optionStr)
}

function chooseUser() {
  const userId = $("#user-id-select").val()
  currentUser = userId
  $("#send-receive-user-span").text(userId)
  $("#send-receive-div").show()
  $("#user-id-div").hide()

  popuplateSendButtons()
  initialiseSocket()
}

function popuplateSendButtons() {
  let buttonStr = ""
  for (let i = 1; i <= numberOfUsers; i++) {
    if (i == currentUser) continue

    buttonStr += `<button onclick="sendToUser(${i})">Send to ${i}</button>`
  }

  $("#send-div-send-buttons-p").html(buttonStr)
}

function scrollToBottom(divToScroll) {
  divToScroll.scrollTop(divToScroll.prop("scrollHeight"))
}

function sendToUser(toUser) {
  const sendInput = $("#send-div-send-input")
  const message = sendInput.val()

  if (message === "") {
    alert("Empty message")
    return false
  }
  sendInput.val("")

  // Send Action
  sender.sendMessage(toUser, message)

  appendToSent(toUser, message)
  scrollToBottom($("#send-div-sent-area"))
}

function appendToSent(toUser, message) {
  const str = `<p>To ${toUser}: ${message}</p>`
  $("#send-div-sent-area").append(str)
}

function receivedFromUser(fromUser, message) {
  appendToReceived(fromUser, message)
  scrollToBottom($("#receive-div-received"))
}

function appendToReceived(fromUser, message) {
  const str = `<p>From ${fromUser}: ${message}</p>`
  $("#receive-div-received").append(str)
}
