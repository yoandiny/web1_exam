const menu = document.getElementById("navMenu");


menu.innerHTML = `
           <div class="navbar flex-btw">
            <link href='https://fonts.googleapis.com/css?family=Roboto Mono' rel='stylesheet'>
            
           <link rel="stylesheet" href="assets/css/nav.css">
            <div class="logo">
                <i class="fa-solid fa-terminal"></i>
                <h1>Keygo</h1>
            </div>
            <nav class="flex-btw">
                <ul class="flex-btw">
                    <li><a href="index.html">Test</a></li>
                    <li><a href="about.html">About</a></li>
                </ul>

                <ul class="flex-btw">
                    <li><a href="#notification.html"><i title="notification" class="fa-solid fa-bell"></i></a></li>
                    <li><a href="profil.html"><i title="profil" class="fa-regular fa-user"></i></a></li>
                </ul>
            </nav>
        </div>
`;

const logo = document.querySelector(".logo");

logo.addEventListener("click", () => {
    window.location.href = "index.html";
});