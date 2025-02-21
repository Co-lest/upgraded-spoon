const signup = document.querySelector("#signup-form");
const username = document.querySelector("#username");
const school = document.querySelector("#school");
const password = document.querySelector("#password");
const name = document.querySelector("#name");
const hometown = document.querySelector("#hometown");
const interests = document.querySelector("#interests");

const obj = { name: "", username: "", password: "", hometown: "", school: "", interests: "" };

signup.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from reloading

  const usernameValue = username.value;
  const schoolValue = school.value;
  const passwordValue = password.value;
  const hometownValue = hometown.value;
  const interestsValue = interests.value;
  const nameValue = name.value;

  if (!usernameValue || !schoolValue || !passwordValue || !interestsValue || !hometownValue || !nameValue) {
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
      obj.school = schoolValue;
      obj.password = passwordValue;
      obj.interests = interestsValue;
      obj.hometown = hometownValue;
      obj.name = nameValue;

      let objString = JSON.stringify(obj);
      console.log(obj)

    fetch("http://localhost:3303/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: objString,
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
  signup.reset();
});