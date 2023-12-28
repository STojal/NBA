//darkomode

const darkmodeToggle = document.getElementById('darkmode-toggle');
const background = document.querySelector('.background');
const navbar = document.querySelector('.navbar');

var darkmode_state = localStorage.getItem("darkmode_state", darkmode_state);
console.log(darkmode_state)

darkmodeToggle.addEventListener('change', function () {
  if (this.checked) {
    //mudar para dark
    background.style.background = 'hsl(0, 1%, 14%)';
    background.style.color = 'rgb(192,192,192)';
    $('nav').removeClass("navbar navbar-expand-lg navbar-light bg-light")
    $('nav').addClass("navbar navbar-expand-lg navbar-dark bg-dark")
    $('.navbar').css('background-color', 'hsl(0, 1%, 14%)');
    $('.navbar').css('color', 'rgb(192,192,192)');
    darkmode_state = 1;
    $(".fa-sun").css({ left: "5px", color: "#7e7e7e", transition: "0.3s" });
    $(".fa-moon").css({ left: "60px", color: "#fff", transition: "0.3s" });
    $('.card').css('background-color', "gray");
    $('.page-link').css("background-color", "rgb(40, 40, 40)");
    $("tr:even").css("background-color", "rgb(40, 40, 40)");
    $("tr:odd").css("background-color", "gray");
    $('#drop').css("background-color", "rgb(40, 40, 40)")
    $('#switch_mode').css("background-color", "#242424");
    $('.dropdown-menu').css('background-color', 'rgb(40, 40, 40)')
    $('.dropdown-menu a').css('color', '#1d4e83')
    $('#staticBackdrop').css('background-color', ' rgb(14, 46, 97)')
    $('#staticBackdrop').css('color', ' white')
    $('.modal-content').css('background-color', ' rgb(14, 46, 97)')
    $('.modal-content').css('color', ' white')
    $('body').css('background-color', 'hsl(0, 1%, 14%)')
    $('.accordion-item').css('--bs-accordion-btn-bg', 'rgb(40, 40, 40)')
    $('.accordion-item').css('--bs-accordion-btn-color', 'white')
    $('.estatistics').css('background-color', ' rgb(14, 46, 97)')
    $('.estatistics').css('color', 'cyan')
    $('table').removeClass()
    $('table').addClass("table table-dark table-striped")




  } else {
    //mudar para light
    $(".fa-sun").css({ left: "5px", color: " #fff", transition: "0.3s" });
    $(".fa-moon").css({ left: "60px", color: "#7e7e7e", transition: "0.3s" });
    background.style.background = 'hsl(0, 0%, 100%)';
    background.style.color = 'black';
    $('nav').removeClass("navbar navbar-expand-lg navbar-dark bg-dark")
    $('nav').addClass("navbar navbar-expand-lg navbar-light bg-light")
    $('.navbar').css('background-color', 'hsl(0, 0%, 100%)');
    $('.card').css('background-color', "white");
    $('.page-link').css("background-color", "white");
    $('.page-link:first').css("background-color", "blue");
    $('#drop').css("background-color", "white")
    $('#switch_mode').css("background-color", "white");
    $('.dropdown-menu').css('background-color', 'white')
    $('.dropdown-menu a').css('color', 'black')
    $('#drop').css('color', 'black')
    $('#staticBackdrop').css('background-color', 'white')
    $('#staticBackdrop').css('color', ' black')
    $('.modal-content').css('background-color', 'white')
    $('.modal-content').css('color', ' black')

    $('body').css('background-color', 'white')
    $('.accordion-item').css('--bs-accordion-btn-bg', 'white')
    $('.accordion-item').css('--bs-accordion-btn-color', 'black')
    $('.estatistics').css('background-color', 'white ')
    $('.estatistics').css('color', 'black')
    $('table').removeClass()
    $('table').addClass("table table-striped table-sm small")


    darkmode_state = 0


  }
  localStorage.setItem("darkmode_state", darkmode_state)
});
$(document).ready(function () {
  
  //guardar dados
  darkmodecheck()
  //drop da arena
  $('#arenasbutton').hover(function () {
    $('#drop').slideDown(500);
    //console.log($('#arenasbutton:hover').length)
    //console.log($('#drop:hover').length)
    if ($('#arenasbutton:hover').length === 0 && $('#drop:hover').length === 0) {
      $('#drop').slideUp(500);
    }
  });
  $('#drop').hover(function () {
    if ($('#arenasbutton:hover').length === 0 && $('#drop:hover').length === 0) {
      $('#drop').slideUp(500);
    }
  });

});
function offcanvas() {
  //console.log("help")
  //adcionar o off canvas os Arenas
  var Arenas = JSON.parse(localStorage.getItem("arenas")) || []
  if (Arenas.length > 0) {
    Arenas.forEach(arena => {
      $('#flush-collapseOne').append(`
   
               <div class="card">
               <div class="card" style="background-image: url('${arena.Photo}'); background-size: cover;">
               <h5 class="card-title">${arena.Name}</h5>
               <p class="card-text"><strong>State:</strong> <a href="./stateDetails.html?id=${arena.StateId}">${arena.StateName}</a></p>
               <p class="card-text"><strong>Team:</strong> <a href="./TeamsDetails.html?id=${arena.TeamId}&acronym=${arena.TeamAcronym}">${arena.TeamName}</a></p>
               <p class="card-text"><strong>Location:</strong> <span>${arena.Location}</span></p>
               <a href="./arenaDetails.html?id=${arena.Id}" class="btn btn-outline-primary me-2">Show Details</a>
               
               </div>
   
               `);
    })
  }
  else {
    $('#flush-collapseOne').append(`
           <div class="info">Nenhuma Arena nos favoritos</div>
       
           `)
  }
  //adcionar o off canvas os jogadores
  var jogadores = JSON.parse(localStorage.getItem("jogadores")) || []
  if (jogadores.length > 0) {
    jogadores.forEach(player => {
      $('#flush-collapseTwo').append(`
                   <div class="card mb-3" style="max-width: 400px; margin-right: 5px; margin-bottom: 5px;" !important>
                   <div class="row g-0">
                   <div class="col-md-7">
                   <div class="card-body">
                   <h5 class="card-title">${player.Name}</h5>
                   <p class="card-text">
                   <a href="./countryDetails.html?id=${player.CountryId}" class="nav-link">${player.CountryName}</a>
                   </p>
                   <p class="card-text">
                   <small class="text-body-secondary">
                   <a href="./positionDetails.html?id=${player.PositionId}" class="nav-link">${player.PositionName}</a>
                   </small>
                   </p>
                   <div class="fixed">
                   <a href="./PlayersDetails.html?id=${player.Id}" class="btn btn-primary">Show Details</a>
                   
                   </div>
                   </div>
                   </div>
                   <div class="col-md-5" style="margin: none;">
                   <div class="imagemDivsPlayers col-md-5" style="background-image: url('${player.Photo}')""></div>
                   </div>
                   </div>
                   </div>
               `);
    })
  }
  else {
    $('#flush-collapseTwo').append(`
           <div class="info">Nenhum jogador nos favoritos</div>
       
           `)
  }
  var teams = JSON.parse(localStorage.getItem("Teams")) || []
  if (teams.length > 0) {
    teams.forEach(Team => {
      //console.log(Team)
      $('#flush-collapseTree').append(
        `
               <div class="card" style=" margin-right: 5px; margin-bottom: 5px;">
               <div class="imagemDivsTeams"
        style="background-image: url('${Team.Logo}')">

    </div>
   
               <div class="card-body">
               <h5 class="card-title">${Team.Name}</h5>
               <p class="card-text">
               <strong>Acronym:</strong><span>${Team.Acronym}</span> <br>
               </p>
               <a  class="btn btn-primary"
               href="./TeamsDetails.html?id=${Team.Id}&acronym=${Team.Acronym}">Show Details</a>
   
               </div>
               </div>
   `);
    })
  }
  else {
    $('#flush-collapseTree').append(`
       <div class="info">Nenhuma Team nos favoritos</div>
   
       `)

  }
}
function clearoffcanvas() {
  $('#flush-collapseTree').empty()
  $('#flush-collapseTwo').empty()
  $('#flush-collapseOne').empty()
}
function goBack() {
  window.history.back();
}

window.onload = function() {
  darkmodecheck()
};
//dark mode check e muda as para dark ou white 
function darkmodecheck(){
  if (darkmode_state == 1) {
    background.style.color = 'rgb(192,192,192)';
    darkmode_state = 1
    $('nav').removeClass("navbar navbar-expand-lg navbar-light bg-light")
    $('nav').addClass("navbar navbar-expand-lg navbar-dark bg-dark")
    $('.nav').removeClass("navbar-light bg-light")
    $('.nav').addClass("navbar-dark bg-dark")
    $('.nav').css('color', 'rgb(192,192,192)');
    $('#darkmode-toggle').css('background', "linear-gradient(180deg, #777, #3a3a3a)");
    $(".fa-sun").css({ left: "5px", color: "#7e7e7e", transition: "0.3s" });
    $(".fa-moon").css({ left: "60px", color: "#fff", transition: "0.3s" });
    $('#switch_mode').css("background-color", "#242424");
    $('.card').css('background-color', "gray")
    $('.page-link').css("background-color", "rgb(40, 40, 40)");
    $('#drop').css("background-color", "rgb(40, 40, 40)")
    $('.dropdown-menu').css('background-color', 'rgb(40, 40, 40)')
    $('.dropdown-menu a').css('color', '#1d4e83')
    $('#staticBackdrop').css('background-color', ' rgb(14, 46, 97)')
    $('#staticBackdrop').css('color', ' white')
    $('.modal-content').css('background-color', ' rgb(14, 46, 97)')
    $('.modal-content').css('color', ' white')
    $('body').css('background-color', 'hsl(0, 1%, 14%)')
    $('.accordion-item').css('--bs-accordion-btn-bg', 'rgb(40, 40, 40)');
    $('.accordion-item').css('--bs-accordion-btn-color', 'white')
    $('.estatistics').css('background-color', ' rgb(14, 46, 97)')
    $('.estatistics').css('color', 'cyan')
    $('table').removeClass()
    $('table').addClass("table table-dark table-striped")



  }
  else {
    $('nav').removeClass("navbar navbar-expand-lg navbar-dark bg-dark")
    $('nav').addClass("navbar navbar-expand-lg navbar-light bg-light")
    $('#drop').css("background-color", "white")
    $('#staticBackdrop').css('background-color', ' white')
    $('#staticBackdrop').css('color', ' black')
    $('.modal-content').css('background-color', ' white')
    $('.modal-content').css('color', ' black')

    


  }
}