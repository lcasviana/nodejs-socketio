$(document).ready(($) => {
  const socket = io('http://localhost:3000');

  const getName = () => {
    const name = prompt('Name:');
    if (!name || !name.trim()) return getName();
    return name;
  }
  const name = getName();
  $(document).prop('title', `${name} - NodeJS - Socket.io`);
  socket.emit('insertPersonName', { name });

  const messageForm = $('#message-form')[0];
  messageForm.onsubmit = (event) => {
    event.preventDefault();
    const message = $('#message-comment')[0].value;
    if (!message?.trim()) return;
    $('#message-comment')[0].value = '';
    socket.emit('sendMessageToServer', { message });
  };

  $("#message-comment").keypress((event) => {
    if (event.which == 13 && !event.shiftKey) {
      messageForm.onsubmit(event);
      event.preventDefault();
    }
  });

  const messageChat = $('#message-chat')[0];
  socket.on('receiveMessageFromServer', ({ id, name, message, date }) => {
    const element = document.createElement('p');
    element.innerHTML = `${date}-${id}#<strong>${name}:</strong> ${message}`;
    messageChat.append(element);
  });
});
