// ViewModel KnockOut
var vm = function () {
    var href_da_pagina = window.location.href;
    href_da_pagina = href_da_pagina.split("&")
    var acronym_parametro = href_da_pagina[1].split("=")
    var acronym_valor = acronym_parametro[1]

    var id_todo = href_da_pagina[0].split("?")
    id = id_todo[1].split("=")
    Id_parametre = id[1]

    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/api/Teams/');
    self.displayName = 'NBA Team Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Acronym = ko.observable('');
    self.Name = ko.observable('');
    self.ConferenceId = ko.observable('');
    self.ConferenceName = ko.observable('');
    self.DivisionId = ko.observable('');
    self.DivisionName = ko.observable('');
    self.StateId = ko.observable('');
    self.StateName = ko.observable('');
    self.City = ko.observable('');
    self.Logo = ko.observable('');
    self.History = ko.observable('');
    self.Seasons =ko.observableArray([]);
    self.Players = ko.observableArray([]);
    self.ReverseSeasons = ko.observableArray([]);

    //--- Page Events
    self.activate = function (id) {

        console.log('CALL: getTeam...');
        var composedUri = self.baseUri() + Id_parametre + '?Acronym=' + acronym_valor;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();

            checkfav(data)
            localStorage.setItem('Teamsadd', JSON.stringify(data))

            self.Id(data.Id);
            self.Acronym(data.Acronym);
            self.Name(data.Name);
            self.ConferenceId(data.ConferenceId);
            self.ConferenceName(data.ConferenceName)
            self.DivisionId(data.DivisionId);
            self.DivisionName(data.DivisionName);
            self.StateId(data.StateId);
            self.StateName(data.StateName);
            self.City(data.City);
            self.Logo(data.Logo);
            self.History(data.History);
            self.Seasons(data.Seasons);
            self.Players(data.Players);
            self.ReverseSeasons((data.Seasons).reverse())

        });
    };
    //adcionar e retirar o botao dos fav
    function checkfav(team) {
        console.log(team)
        var fav = localStorage.getItem('Teams')
        var list = JSON.parse(fav) || [];
        var check = list.some(item => item.Id === team.Id);

        if (check) {
            mudarbotao(team.Id)
        }

    }
    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    $('#myTabs a').on('click', function (e) {
        $('.tab-pane.fade').removeClass('show active')
        e.preventDefault()
        $(this).tab('show')
        var tabToShow = $(this).attr('data-target')
        $(tabToShow).addClass('show active')
        $(this).tab('show')
    })
    console.log("document.ready!");
    
    ko.applyBindings(new vm());
});
//change button
function mudarbotao(id) {
    $('#favourite').remove()
    $('#favestado').append('<button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;float: right;margin-top: 20px;margin-right: 10px;"' +
        'onclick="Remove_player(' + id + ')">' +
        '<i class="fa-solid fa-trash" id="favourite_${team.Id}" title="Remove to favorites" ></i>' +
        '</button>')
}
$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
//Remover os fav
function Remove_player(records) {
    //console.log(records)
    var Teams = JSON.parse(localStorage.getItem("Teams")) || [];
    for (let key in Teams) {
        if (Teams.hasOwnProperty(key) && JSON.stringify(Teams[key].Id) === JSON.stringify(records)) {
            Teams.splice(key, 1);
            //console.log(Teams);
            break;
        }
    }
    Teams = localStorage.setItem("Teams", JSON.stringify(Teams))
    alert("Team removido dos favoritos")
    location.reload()
}
//adcionar os fav
function add_player() {

    var records = localStorage.getItem('Teamsadd')
    records = JSON.parse(records)
    console.log(records)
    var Teams = JSON.parse(localStorage.getItem("Teams")) || [];



    count = 0
    for (let key in Teams) {

        if (Teams.hasOwnProperty(key) && JSON.stringify(Teams[key]) === JSON.stringify(records)) {
            count = 1

        }
    }
    //console.log(count)
    if (count === 0) {

        Teams.push(records);
        //console.log(Teams)
        Teams = localStorage.setItem("Teams", JSON.stringify(Teams))
        alert("Team adicionado aos favoritos")
        mudarbotao(records.Id)

    }
    else {
        alert("Team já nos favoritos")
    }

};
function getPlayersseason(idSeason) {
    //adciona o accordion dependendo da season

    var appednto = "#collaps_"+idSeason
    

    var text = $('#titleTeam').text()
    text = text.split('[')[1]
    var idTeam = text.split(']')[0]
    //evita span na api alem de evitar replicação de elementos
    if (($(appednto).text()).trim() == '') {
        url = 'http://192.168.160.58/NBA/api/Statistics/PlayersBySeason?seasonId=' + idSeason + '&teamid=' + idTeam
        ajaxHelper(url, 'GET').done(function (data) {

            data.forEach(type => {

                if (type.SeasonType == "Playoffs") {
                    var PlayoffsPlayers = type.Players

                    $(appednto).append(
                        '<h5  style="margin-left:10px">Playoffs</h5>' +
                        '<ul class="lista_de_seasons" id="Playoffs'+idSeason+'"></ul>' +
                        '<div>'

                    )
                    console.log(2)

                    PlayoffsPlayers.forEach(player => {
                        console.log(player)
                        console.log(2)
                        $("#Playoffs"+idSeason).append('<li><a href="./PlayersDetails.html?id=' + player.Id + '">' + player.Name + '</a><li>')
                    })

                }
                else {
                    var PlayoffsPlayers = type.Players

                    $(appednto).append(
                        '<h5 style="margin-left:10px">Regular Season</h5>' +
                        '<ul class="lista_de_seasons" id="Regular'+idSeason+'"></ul>' +
                        '<div>'

                    )
                    console.log(2)

                    PlayoffsPlayers.forEach(player => {
                        console.log(player)
                        console.log(2)
                        $("#Regular"+idSeason).append('<li><a href="./PlayersDetails.html?id=' + player.Id + '">' + player.Name + '</a><li>')
                    })
                }
            })
        });

    }
}

function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
        }
    })
}