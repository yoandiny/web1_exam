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

        message.innerText = 'Registering complete';
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
            if(username.length >= 4){
                if(mail.includes('@') && mail.includes('.')){
                    if(password.length >= 6){
                        localStorage.setItem('id', Math.floor(Math.random() * (9999-1000)+ 1000))
                        localStorage.setItem('username', username);
                        localStorage.setItem('mail', mail);
                        localStorage.setItem('password', password);
                
                message.innerText = 'Registering complete';
                messageBox.classList.add('register-succes-message')
    
                setTimeout(() => {
                    localStorage.setItem("isConnected", "true");
                    window.location.href = "profil.html";
                }, 100);
                    }else{
                        message.innerText = "Your password must be at least 6 characters ";
                    messageBox.classList.add('register-error-message')
        
                    setTimeout(() => {
                        submitButton.innerText = 'Register';
                    }, 100);
                    }
                }else{
                    message.innerText = "Please enter a valid email ";
                    messageBox.classList.add('register-error-message')
        
                    setTimeout(() => {
                        submitButton.innerText = 'Register';
                    }, 100);
                }
                
            }else{
                message.innerText = "Your username must be at least 4 characters ";
            messageBox.classList.add('register-error-message')

            setTimeout(() => {
                submitButton.innerText = 'Register';
            }, 100);
            }
           
        
        }else{
            
            message.innerText = 'Please fill all the fields';
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
