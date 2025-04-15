const isConnected = localStorage.getItem("isConnected");
const loginForm = document.querySelector('.login-form');

if (isConnected === "true"){
    window.location.href = "../../profil.html";}


const handleLogin = (loginWay) => {
    const loginButton = document.getElementById(loginWay);
    loginButton.innerText= '...';

    setTimeout(() => {
        const messageBox = document.querySelector('.login-form-message');
            const message = document.querySelector('.login-form-message-text');

            message.innerText = 'Connexion réussie';
            messageBox.classList.add('login-succes-message')

            setTimeout(() => {
                
                localStorage.setItem("isConnected", "true");
                window.location.href = "profil.html";
            
        }, 100);

    }, 3000);
    
}

const handleSubmit = () => {
    
    const mailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const mail = mailInput.value;
    const password = passwordInput.value;

    const submitButton = document.querySelector('.login-form-submit');
    const messageBox = document.querySelector('.login-form-message');
    const message = document.querySelector('.login-form-message-text');

    submitButton.innerText = '...';

    setTimeout(() => {
        if(mail && password){
            
            message.innerText = 'Connexion réussie';
            messageBox.classList.add('login-succes-message')

            setTimeout(() => {
                localStorage.setItem("isConnected", "true");
                window.location.href = "profil.html";
            }, 100);
        
        }else{
            
            message.innerText = 'Veuillez remplir tous les champs';
            messageBox.classList.add('login-error-message')

            setTimeout(() => {
                submitButton.innerText = 'Login';
            }, 100);
        }
        
    }, 3000);

    

}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmit();
});
