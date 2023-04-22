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

    buttonStr += `<button onclick="sendToUser('${i}')">Send to ${i}</button>`
  }

  $("#send-div-send-buttons-p").html(buttonStr)
}

function scrollToBottom(divToScroll) {
  divToScroll.scrollTop(divToScroll.prop("scrollHeight"))
}

function sendToUser(toUser) {
  const sendInput = $("#send-div-send-input")
  const messageText = sendInput.val()
  const messageId = toUser + "_" + new Date().getTime().toString()

  const message = {
    id: messageId,
    text: messageText,
  }

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
  const str = `<p class="sent-p" data-id="${message.id}"><label>To ${toUser}<span class="sent-ack">&check;</span></label>: ${message.text}</p>`
  $("#send-div-sent-area").append(str)
}

function receivedFromUser(fromUser, message) {
  appendToReceived(fromUser, message)
  scrollToBottom($("#receive-div-received"))
}

function appendToReceived(fromUser, message) {
  const str = `<p class="received-p"><label>From ${fromUser}</label>: ${message.text}</p>`
  $("#receive-div-received").append(str)
}

function receivedSuccessAck(messageId) {
  $(".sent-p[data-id=" + messageId + "]")
    .find(".sent-ack")
    .show()
}
