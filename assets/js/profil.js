const disconnectButton = document.getElementById('disconnect-button');
const typingHistory = JSON.parse(localStorage.getItem("typingHistory") || "[]");
const profileForm = document.querySelector('.profile-form');
const username = localStorage.getItem("username");
const usernameField = document.querySelector('.user-name');
const id = localStorage.getItem("id");
const idField = document.querySelector('.user-id');
const passwordField = document.getElementById('password');

const isConnected = localStorage.getItem("isConnected");
        if (!isConnected || isConnected === "false"){
            window.location.href = "login.html";
        }


const logout = () => {
    localStorage.setItem("isConnected", "false");
    window.location.href = "login.html";
}

usernameField.innerText = username;
idField.innerText = `#${id}`;

document.getElementById('email').placeholder = localStorage.getItem('mail')

const handleUpdate = () => {
    const updateButton = document.getElementById('update-button');
    updateButton.innerText= '...';
    
    setTimeout(() => {
        const mail = document.getElementById('email').value;
        const stockedMail = localStorage.getItem('mail');
        const password = document.getElementById('password').value;
        const stockedPassword = localStorage.getItem('password');
        if(mail != stockedMail){
            if(mail == null || mail == ''){
                localStorage.setItem('mail', stockedMail);
                
            }else{
                if(mail && mail.includes('@') && mail.includes('.')){
                    localStorage.setItem('mail', mail);
                    
                }else{
                    alert('Veuillez rentrer une adresse mail valide !')
                }

            }

        }else{
            localStorage.setItem('mail', stockedMail);
        }

      

        if(password != stockedPassword){
            if(password == null || password == ''){
                localStorage.setItem('password', stockedPassword);
            }else{
                if(password.length >= 6){
                    localStorage.setItem('password', password);
                }else{
                    alert("Votre mot de passe doit contenir au moins 6 caractères !")
                }
                
            }
        }else{
            localStorage.setItem('password', stockedPassword);
        }

        window.location.reload();

    }, 2000);
    
}

profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleregister();
});

//Chart part

const labels = typingHistory.map(entry => entry.date);
const wpm = typingHistory.map(entry => entry.wpm);
const accuracy = typingHistory.map(entry => entry.accuracy);


const ctx = document.getElementById('wpmChart').getContext('2d');

const wpmChart = new Chart(ctx, {
  type: 'line', 
  data: {
    labels: labels,
    datasets: [{
      label: 'Word Per Minute (WPM)',
      data: wpm,
      borderWidth: 1
    },
    {
        label: 'Accuracy',
        data: accuracy,
        borderWidth: 1
      }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});





