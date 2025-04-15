const isConnected = localStorage.getItem("isConnected");
const registerForm = document.querySelector('.register-form');

if (isConnected === "true"){
    window.location.href = "../../profil.html";}


const handleregister = (registerWay) => {
    const registerButton = document.getElementById(registerWay);
    registerButton.innerText= '...';

    setTimeout(() => {

        const messageBox = document.querySelector('.register-form-message');
        const message = document.querySelector('.register-form-message-text');

        message.innerText = 'Inscription réussie';
        messageBox.classList.add('register-succes-message')

        setTimeout(() => {
            localStorage.setItem("isConnected", "true");
            window.location.href = "profil.html";
        }, 100);
    }, 3000);
    
}

const handleSubmit = () => {
    const usernameInput = document.getElementById('username');
    const mailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const mail = mailInput.value;
    const password = passwordInput.value;

    const submitButton = document.querySelector('.register-form-submit');
    const messageBox = document.querySelector('.register-form-message');
    const message = document.querySelector('.register-form-message-text');

    submitButton.innerText = '...';

    setTimeout(() => {
        if(mail && password && username){
            
            message.innerText = 'Inscription réussie';
            messageBox.classList.add('register-succes-message')

            setTimeout(() => {
                localStorage.setItem("isConnected", "true");
                window.location.href = "profil.html";
            }, 100);
        
        }else{
            
            message.innerText = 'Veuillez remplir tous les champs';
            messageBox.classList.add('register-error-message')

            setTimeout(() => {
                submitButton.innerText = 'Register';
            }, 100);
        }
        
    }, 3000);

    

}

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmit();
});
