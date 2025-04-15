const isConnected = localStorage.getItem("isConnected");
const disconnectButton = document.getElementById('disconnect-button');

if (!isConnected || isConnected === "false"){
    window.location.href = "login.html";}

const logout = () => {
    localStorage.setItem("isConnected", "false");
    window.location.href = "login.html";
}
