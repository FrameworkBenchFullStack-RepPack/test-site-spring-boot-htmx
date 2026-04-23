const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const brokerURL = `${protocol}//${window.location.host}/live-data`;

const client = new StompJs.Client({
    brokerURL: brokerURL,
    reconnectDelay: 5000,
});

client.onConnect = function () {
    client.subscribe("/topic/live-data", function (message) {
        const data = JSON.parse(message.body);
        document.getElementById("sig-1").innerText = data.number1;
        document.getElementById("sig-2").innerText = data.number2;
        document.getElementById("sig-3").innerText = data.number3;
    });
};

client.activate();
