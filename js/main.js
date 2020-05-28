window.onload = () => { 

 /* ---------------------------------------------
                    PARALLAX EFECT
--------------------------------------------- */ 
const parallax = document.getElementById("parallax");

window.addEventListener("scroll", function()
{
    let offset = window.pageYOffset;
    parallax.style.backgroundPositionY = offset * 0.4 + "px";
    // console.log(offset);
});

/* ---------------------------------------------
                    NAVBAR CONTROL
--------------------------------------------- */


let mainNav = document.getElementById('js-menu');
let navBarToggle = document.getElementById('js-navbar-toggle');

navBarToggle.addEventListener('click', function () {
  mainNav.classList.toggle('active');
})





};

