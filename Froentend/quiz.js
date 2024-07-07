// live server hosted is at https://realtimequizapp.onrender.com
// const socket = io.connect("https://realtimequizapp.onrender.com"); // Uncomment this line if you want to use hosted server
const socket = io.connect("http://localhost:3000"); // For local server

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const leaderboardElement = document.getElementById("leaderboard");

let currentQuestion;
let username;

// Listen for new questions from the server
socket.on("newQuestion", handleNewQuestion);

// Listen for updated leaderboard from the server
socket.on("updateLeaderboard", displayLeaderboard);


//On duplicate user entry
socket.on("invalid_username",()=>{
  alert("User Already Exists");
  username = prompt("Enter your username:");
while(!username){
  alert("Username Required");
  username = prompt("Enter your username:");
}
socket.emit("join", { username });
});

// Display the question and options
function handleNewQuestion(question) {
  currentQuestion = question;
  displayQuestion();
}

// Display the question and options
function displayQuestion() {
  //questionElement.textContent = currentQuestion.text;
  questionElement.innerHTML = currentQuestion.text
  optionsElement.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    //console.log(index);
    optionsElement.innerHTML += `
    <div class="opt">
      <input type="radio" name="answer" value="${index}" id="option${index}">
      <label for="option${index}">${option}</label><br>
    </div>`;
  });
}

// Submit the selected answer
function submitAnswer() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');

  if (!selectedOption) {
    alert("Please select an answer.");
    return;
  }

  const selectedOptionIndex = parseInt(selectedOption.value);

  // Send the answer to the server
  socket.emit("submitAnswer", { selectedOptionIndex });

  // Clear selected option
  selectedOption.checked = false;
}

// Display the updated leaderboard
function displayLeaderboard(leaderboard) {
  leaderboardElement.innerHTML = "";

  leaderboard.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("score");

    if (index === 0) {
      //listItem.classList.remove("Y", "R");
      listItem.classList.add("R");
    } else if (index === 1) {
      //listItem.classList.remove("G", "R");
      listItem.classList.add("R");
    } else {
      //listItem.classList.remove("G", "Y");
      listItem.classList.add("R");
    }

    listItem.textContent = ` User: ${entry.username} - Score: ${entry.score}`;
    leaderboardElement.appendChild(listItem);
  });
}

// Prompt for username when the page loads
username = prompt("Enter your username:");
while(!username){
  alert("Username Required");
  username = prompt("Enter your username:");
}
socket.emit("join", { username });
