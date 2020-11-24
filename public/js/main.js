var socket = io.connect("http://localhost:3000");

var username = document.querySelector("#username").innerHTML;
var roomName = document.querySelector("#roomName").innerHTML;

var roomUsers = document.querySelector("#roomUsers");
var allMessages = document.querySelector("#allMessages");
var inputForm = document.querySelector("form");
var message = document.querySelector("#message");
var notificationSound = new Audio("../audio/videoplayback.mp4");

// emit an event on user roon join
socket.emit("joinRoom", { username, roomName });

// send a message to a particular room
inputForm.addEventListener("submit", e => {
	e.preventDefault();

	var data = {
		roomName: roomName,
		username: username,
		message: message.value
	};

	// append the message to chatbox
	appendNewMessage(data, true);

	// send to server via socket
	socket.emit("message", data);

	// clear the message fields
	message.value = "";

	// scroll to bottom of all messages
	scrollToBottom();
});

// receive messages from socket
socket.on("message", data => {
	// append the new message
	appendNewMessage(data);
	// scroll to bottom of all messages
	scrollToBottom();
	notificationSound.play();
});

socket.on("roomEntry", data => {
	renderRoomUsers(data, "entry");
});

socket.on("roomLeave", data => {
	renderRoomUsers(data, "leave");
});

function renderRoomUsers(data, type) {
	// add in-chat notification
	allMessages.innerHTML += `
		<p class='text-center m-3'><strong>${data.username}</strong> has ${
		type === "entry" ? "joined" : "left"
	} the chat.</p>
	`;
	// add new room user
	roomUsers.innerHTML = "";
	data.roomUsers.forEach(
		user => (roomUsers.innerHTML += `<p class="user-decoration">${user.username}</p>`)
	);
	scrollToBottom();
}

function appendNewMessage({ username, message }, myMsg = false) {
	const style = {
		background: myMsg ? "purple" : "grey",
		textColor: myMsg ? "text-white" : "",
		border: myMsg ? "text-white" : ""
	};
	allMessages.innerHTML += `
        <div class="new-message round-message w-50 ${myMsg ? "ml-auto" : ""} ${
		style.background
	} ${style.textColor} ${style.border} m-3 pl-4 pt-3 border">
            ${myMsg ? "" : `<p class="text-muted">${username}</p>`}
            <p>${message}</p>
        </div>
    `;
}

function scrollToBottom() {
	allMessages.scrollTo(0, allMessages.scrollHeight);
}
