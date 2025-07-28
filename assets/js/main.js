const navbar =document.getElementById('navbar');

function opensidebar() {
    navbar.classList.add('show');
}
function closesidebar() {
    navbar.classList.remove('show');
}

document.querySelectorAll('img.fade-img').forEach(img => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
  }
});
