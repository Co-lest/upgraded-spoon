const signup = document.querySelector("#signup-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");

const obj = { username: "", password: "" };

signup.addEventListener("submit", function (event) {
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
    obj.username = usernameValue;
    obj.password = passwordValue;

    fetch("http://localhost:3303/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response);
      })
      .then((data) => {
        console.log(data); // Process the response
        alert("Sign up successful!");
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }
  signup.reset(); // Clear the form
});
