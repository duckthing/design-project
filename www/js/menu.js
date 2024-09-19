document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('nav-toggle-btn'); // Assuming this is your hamburger ID
  const navLinks = document.getElementById('nav-links');

  toggleButton.addEventListener('click', function () {
    navLinks.classList.toggle('show');
  });
});
