

//CREATE CONSTANTS (GETTING ELEMENTS)
const wrapperNode = document.getElementById("wrapper");
const chatWindowNode = document.getElementById("chat-window");
const inputUserMessageNode = document.getElementById("input-message");
const btnSendMessageNode = document.getElementById("btn-submit-message");
const btnGetLocationNode = document.getElementById("btn-get-geolocation");


//CREATE VARIABLES (FOR WEBSOCKET)
let serverUrl = `wss://echo-ws-service.herokuapp.com`;
let websocket;


//NATIVE FUNCTIONS
//PRINT CONNECTION STATUS
function outputConnectionStatus(node, text, color) {
    node.textContent = text;
    node.style.cssText = `
    line-height: 20px;
    color: ${color};
    font-size: 1.2em;
    align-self: center;
    font-weight: bold;
    `;
}
//FUNCTION TO CREATE MESSAGE ELEMENT
function createMessageElement(side, message, url) {
    const messageElement = document.createElement('div');
    messageElement.setAttribute("class", `message-element ${side}-side-message`)
    side === "client" ? messageElement.style.alignSelf = "right" : messageElement.style.alignSelf = "left";
    if (message === 'Геопозиция' && side === 'server') messageElement.innerHTML = `<a href=${url} style="border-bottom: var(--white); color: var(--dark_grey)" target="_blank">${url}<\a>`;
    else messageElement.textContent = message;
    chatWindowNode.appendChild(messageElement);
    return messageElement;
}



//EVENTS
window.addEventListener('load', () => {
    websocket = new WebSocket(serverUrl);
    const connectionStatusMessage = document.createElement('p');

    websocket.onopen = () => {
        outputConnectionStatus(connectionStatusMessage, "Соединение установлено!", "green");
    }
    websocket.onerror = () => {
        outputConnectionStatus(connectionStatusMessage, "Ошибка сервера!", "red");
    }
    websocket.onclose = () => {
        outputConnectionStatus(connectionStatusMessage, "Соединение разорвано!", "yellow");
    }
    wrapperNode.appendChild(connectionStatusMessage);
})
btnSendMessageNode.addEventListener('click', async () => {
    const userMessage = inputUserMessageNode.value;
    if (userMessage) {
        createMessageElement("client", userMessage);
        await websocket.send(userMessage);
        websocket.onmessage = (event) => {
            const serverMessage = event.data;
            createMessageElement("server", serverMessage);
        }
    } else {
        alert("Поле ввода пустое!");
    }
})
inputUserMessageNode.addEventListener('keydown', (key) => {
    if (key.keyCode === 13) btnSendMessageNode.click();
})
btnGetLocationNode.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        createMessageElement('client', "Геопозиция")
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const urlMap = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            websocket.send(urlMap);
            websocket.onmessage = (event) => {
                const serverMessage = event.data;
                createMessageElement('server', `Геопозиция`, serverMessage);
            }
        });
    } else {
        alert('Невозможно получить геопозицию: Ваш браузер не поддерживает эту технологию!')
    }
})
