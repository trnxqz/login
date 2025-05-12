document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // User data to check (hardcoded for now)
    const validUser = {
        firstName: 'Traian',
        lastName: 'Boboc',
        phone: '+37368105543',
        email: 'traianb415@gmail.com',
        password: 'traian009_'
    };

    // Validation logic
    if (firstName === validUser.firstName &&
        lastName === validUser.lastName &&
        phone === validUser.phone &&
        email === validUser.email &&
        password === validUser.password) {
            alert('Login successful!');
            window.location.href = 'dashboard.html';  // Redirect to a dashboard or home page
    } else {
        alert('Invalid credentials!');
    }
});
