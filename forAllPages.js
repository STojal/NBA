const darkmodeToggle = document.getElementById('darkmode-toggle');
const background = document.querySelector('.background');
const navbar = document.querySelector('.navbar');

var darkmode_state = localStorage.getItem("darkmode_state", darkmode_state);
console.log(darkmode_state)

darkmodeToggle.addEventListener('change', function() {
  if (this.checked) {
    background.style.background = 'hsl(0, 1%, 14%)';
    background.style.color = 'rgb(192,192,192)';

    $('.navbar').css('background-color', 'hsl(0, 1%, 14%)');
    $('.navbar').css('color', 'rgb(192,192,192)');
    darkmode_state =1;
    $(".fa-sun").css({ left: "5px", color: "#7e7e7e", transition: "0.3s" });
    $(".fa-moon").css({ left: "60px", color: "#fff", transition: "0.3s" });


  } else {
    $(".fa-sun").css({ left: "5px", color: " #fff"  , transition: "0.3s" });
    $(".fa-moon").css({ left: "60px", color: "#7e7e7e", transition: "0.3s" });
    background.style.background = 'hsl(0, 0%, 100%)';
    background.style.color = 'black';
    $('.navbar').css('background-color', 'hsl(0, 0%, 100%)');
    darkmode_state = 0


  }
  localStorage.setItem("darkmode_state", darkmode_state)
});
$(document).ready(function() {

    if (darkmode_state==1){
        background.style.background = 'hsl(0, 1%, 14%)';
        background.style.color = 'rgb(192,192,192)';
        darkmode_state =1

        $('.navbar').css('background-color', 'hsl(0, 1%, 14%)');
        $('.navbar').css('color', 'rgb(192,192,192)');
        $('#darkmode-toggle').css('background', "linear-gradient(180deg, #777, #3a3a3a)");
        $(".fa-sun").css({ left: "5px", color: "#7e7e7e", transition: "0.3s" });
        $(".fa-moon").css({ left: "60px", color: "#fff", transition: "0.3s" });
        $('#darkmode-toggle').css("background", "#242424");


    }
    $('#arenasbutton').hover(function() {
        $('#drop').slideDown(500);
        //console.log($('#arenasbutton:hover').length)
        //console.log($('#drop:hover').length)
        if ($('#arenasbutton:hover').length === 0 && $('#drop:hover').length===0 ){
            $('#drop').slideUp(500);
        }
    });
    $('#drop').hover(function() {
        if ($('#arenasbutton:hover').length === 0 && $('#drop:hover').length===0 ){
            $('#drop').slideUp(500);
        }
    });
    });
