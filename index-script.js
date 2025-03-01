// sidebar toogle 
   function toggleSidebar() {
            document.querySelector('.sidebar').classList.toggle('open');
            document.querySelector('.content').classList.toggle('shifted');
        }

// login-btn
document.getElementById("loginButton").addEventListener("click", function() {
    window.location.href = "auth/login.html";
  });