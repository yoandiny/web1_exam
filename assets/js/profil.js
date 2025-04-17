const isConnected = localStorage.getItem("isConnected");
const disconnectButton = document.getElementById('disconnect-button');
const typingHistory =JSON.parse(localStorage.getItem("typingHistory"))
const username = localStorage.getItem("username");
const usernameField = document.querySelector('.user-name');
const id = localStorage.getItem("id");
const idField = document.querySelector('.user-id');

const passwordField = document.getElementById('password');


if (!isConnected || isConnected === "false"){
    window.location.href = "login.html";}

const logout = () => {
    localStorage.setItem("isConnected", "false");
    window.location.href = "login.html";
}

usernameField.innerText = username;
idField.innerText = id;

document.getElementById('email').placeholder = localStorage.getItem('mail')






