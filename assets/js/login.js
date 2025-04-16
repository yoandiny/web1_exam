const isConnected = localStorage.getItem("isConnected");
const loginForm = document.querySelector('.login-form');

if (isConnected === "true"){
    window.location.href = "../../profil.html";}


const handleLogin = (loginWay) => {
    const loginButton = document.getElementById(loginWay);
    loginButton.innerText= '...';
    
    if(loginWay === 'google-login'){
        localStorage.setItem("Username", 'Google User');
    }else{
        localStorage.setItem("Username", 'GitHub User');
    }

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

    const mail = localStorage.getItem('mail') || null;
    const password = localStorage.getItem('password') || null ;
    const mailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const mailValue = mailInput.value;
    const passwordValue = passwordInput.value;

    const submitButton = document.querySelector('.login-form-submit');
    const messageBox = document.querySelector('.login-form-message');
    const message = document.querySelector('.login-form-message-text');

    submitButton.innerText = '...';

    setTimeout(() => {
        if(mailValue && passwordValue){
            if(mailValue == mail && passwordValue == password){
                message.innerText = 'Connexion réussie';
                messageBox.classList.add('login-succes-message')
    
                setTimeout(() => {
                    localStorage.setItem("isConnected", "true");
                    window.location.href = "profil.html";
                }, 100);
            }else{
                message.innerText = 'Adresse mail ou mot de passe erroné';
            messageBox.classList.add('login-error-message')

            setTimeout(() => {
                submitButton.innerText = 'Login';
            }, 100);
            }
            
           
        
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
