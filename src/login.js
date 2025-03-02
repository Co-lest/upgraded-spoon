const signup = document.querySelector("#signup-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const signupContainer = document.querySelector(".signup-container");
const homepage = document.querySelector(".homepage");

let ws;

const obj = { type: "log", username: "", password: "" };

connectWebSocket();

signup.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form from reloading

  const usernameValue = username.value;
  const passwordValue = password.value;

  if (!usernameValue || !passwordValue) {
    const errorMessage = document.createElement("div");
    errorMessage.setAttribute("class", "error-message");
    errorMessage.textContent = "All fields are required.";
    document.body.appendChild(errorMessage);
    setTimeout(() => {
      document.body.remove(errorMessage);
    }, 2500);
    return;
  } else {
    obj.username = usernameValue.trim();
    obj.password = passwordValue;

    if ((obj.username != "" && obj.password != "") && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(obj));
    } else {
      console.error("Websocket not connected!");
      return;
    }
  }
  signup.reset();
});

function connectWebSocket (){
    let protocol = ""
    if (window.location.protocol === "https:") {
      protocol = "wss";
    } else {
      protocol = "ws";
    }

    ws = new WebSocket(`${protocol}//${window.location.host}`);
  
    ws.addEventListener("open", () => {
      console.log(`Connected to websocket!`);
    });

    ws.addEventListener("message", (mes) => {
      let data = JSON.parse(mes.data);
      // console.log(data);

      if (data.IsloggedIn) {
        signupContainer.style.display = "none";
        homepage.style.display = "block";
      } else {
        alert("Check username or password! They do not match!");
      }
    });
}