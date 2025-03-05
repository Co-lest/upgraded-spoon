const signup = document.querySelector("#signup-form");
const username = document.querySelector("#username");
const school = document.querySelector("#school");
const password = document.querySelector("#password");
const name = document.querySelector("#name");
const hometown = document.querySelector("#hometown");
const interests = document.querySelector("#interests");
const picture = document.querySelector("#picture");
const age = document.querySelector("#age");

const obj = { name: "", username: "", password: "", hometown: "", school: "", interests: "", picture: "" };

signup.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from reloading

  let usernameValue = username.value.trim();
  let schoolValue = school.value;
  let passwordValue = password.value;
  let hometownValue = hometown.value;
  let interestsValue = interests.value;
  let nameValue = name.value;
  let pictureValue = picture.value.trim();
  let ageValue = age.value;

  if (!usernameValue || !schoolValue || !passwordValue || !interestsValue || !hometownValue || !nameValue || !ageValue) {
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
      obj.picture = pictureValue;
      obj.age = ageValue;

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
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
      if (false) {
        console.log(`User signed up`);
      }
  }
  signup.reset();
});