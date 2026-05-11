import { Client } from "@stomp/stompjs";

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const brokerURL = `${protocol}//${window.location.host}/live-data`;

const client = new Client({
  brokerURL: brokerURL,
  reconnectDelay: 5000,
  onConnect: () => {
    client.subscribe("/topic/live-data", function (message) {
      const element = document.querySelector("#live-data");
      if(!element) return;
      const data = JSON.parse(message.body);
      element.querySelector("#sig-1").innerText = data.number1;
      element.querySelector("#sig-2").innerText = data.number2;
      element.querySelector("#sig-3").innerText = data.number3;
    });
  },
});

client.activate();
