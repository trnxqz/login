document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

  
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    alert('Login reușit! Bine ai venit, ' + firstName + '!');

    
    window.location.href = 'dashboard.html';
});
