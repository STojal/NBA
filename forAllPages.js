const darkmodeToggle = document.getElementById('darkmode-toggle');
const background = document.querySelector('.background');

darkmodeToggle.addEventListener('change', function() {
  if (this.checked) {
    background.style.background = 'hsl(0, 1%, 14%)';
    $('.navbar').background = "black"
    navLinks.style.background ='hsl(0, 1%, 14%)';

  } else {
    background.style.background = 'hsl(0, 0%, 100%)';

    navLinks.style.background ='hsl(0, 1%, 14%)';

  }
});
$(document).ready(function() {
    
    $('#arenasbutton').hover(function() {
        $('#drop').slideDown(500);
        console.log($('#arenasbutton:hover').length)
        console.log($('#drop:hover').length)
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
