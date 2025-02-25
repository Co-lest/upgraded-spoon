let ws;

(function connectWebSocket () {
    const protocol = "";

    if (window.location.protocol === "https:") {
        protocol = "ws";
    } else {
        protocol = "wss";
    }

    ws = new WebSocket(`${protocol} //${window.location.host}`);

    ws.addEventListener("open", () => {
        console.log(`Connected to websocket!`);
    });

    ws.addEventListener("message", (mes) => {
        const profile = JSON.parse(mes);

        
    });
})();
