<!DOCTYPE html>

<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>WebRTC Chat</title>
	<link rel="icon" type="image/x-icon" href="/images/favicon.png">
	<link href="styles/default.css" rel="stylesheet" type="text/css">
</head>

<body>

	<div id="user-id-div">
		<p>
			<label>Select User:
				<select id="user-id-select">
				</select>
			</label>
		</p>
		<p>
			<button onclick="chooseUser()">Enter</button>
		</p>
	</div>

	<div id="send-receive-div">
		<div>
			<p id="send-receive-user-p">Current User: <span id="send-receive-user-span"></span></p>
		</div>
		<div id="send-receive-container">
			<div id="send-div">
				<h3>Send</h3>
				<div id="send-div-send-area">
					<input type="text" id="send-div-send-input" />
					<p id="send-div-send-buttons-p">
					</p>
				</div>
				<div id="send-div-sent-area">
				</div>
			</div>
			<div id="receive-div">
				<h3>Receive</h3>
				<div id="receive-div-received">
				</div>
			</div>
		</div>
	</div>


	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
	<script src="scripts/main.js"></script>
	<script src="scripts/sender.js"></script>
	<script src="scripts/receiver.js"></script>
	<script src="scripts/socket.js"></script>
	<script src="scripts/ChannelCache.js"></script>

</body>

</html>