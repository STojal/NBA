// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/api/Players/');
    self.displayName = 'NBA Player Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Birthdate = ko.observable('');
    self.CountryId = ko.observable('');
    self.CountryName = ko.observable('');
    self.DraftYear = ko.observable('');
    self.PositionId = ko.observable('');
    self.PositionName = ko.observable('');
    self.Height = ko.observable('');
    self.Weight = ko.observable('');
    self.School = ko.observable('');
    self.Photo = ko.observable('');
    self.Biography = ko.observable('');
    self.Seasons = ko.observable('')
    self.Teams = ko.observable('')
    self.Data = ko.observable('')

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getPlayer...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();

            checkfav(data)
            localStorage.setItem('Jogadoradd', JSON.stringify(data))
            self.Data(data)
            self.Id(data.Id);
            self.Name(data.Name);
            self.Birthdate(data.Birthdate);
            self.CountryId(data.CountryId);
            self.CountryName(data.CountryName)
            self.DraftYear(data.DraftYear);
            self.PositionId(data.PositionId);
            self.Height(data.Height);
            self.PositionName(data.PositionName);
            self.Weight(data.Weight);
            self.School(data.School);
            self.Photo(data.Photo);
            self.Biography(data.Biography);
            self.Seasons(data.Seasons);
            self.Teams(data.Teams);
        });
    };

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
    //check the fav to see if it contains player
    function checkfav(player) {

        var fav = localStorage.getItem('jogadores')
        var list = JSON.parse(fav) || [];
        var check = list.some(item => item.Id === player.Id);

        if (check) {

            $('#favourite').remove()
            $('#favestado').append('<button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"' +
                'onclick="Remove_player(' + player.Id + ')">' +
                '<i class="fa-solid fa-trash" id="favourite_${player.Id}" title="Remove to favorites" ></i>' +
                '</button>')
        }
        else {


        }
    }
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

    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})


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
    });
}
//get the ranks and append 
function statiplayer() {
    var idplayer = $('#idplayer').text()
    composedUri = 'http://192.168.160.58/NBA/api/Statistics/PlayerRankBySeason?playerId=' + idplayer
    ajaxHelper(composedUri, 'GET').done(function (stats) {
        console.log(stats)
        var count = 0

        var sortedData = stats.sort((a, b) => a.Rank - b.Rank);
        console.log(sortedData)

        $.each(sortedData, function (index, item) {
            console.log(item)
            var val = (item.Rank)
            if (item.SeasonType == "Regular Season") {
                var seasonId = item.Season
                seasonIdId = seasonId.split('-')[0]
                
                $('#rankregular').append('<li>Detalhes  <a href="PlayerSeasonDetails.html?'+seasonIdId +'&'+ idplayer+'">' + item.Season + '</a>' + ' Rank:' + val + '</li>')
            }
            else {
                if (count == 0) {
                    $('#ranksPlayer').append('<h5><b>Ranking do jogador nos Playoffs</b></h5><ol id="rankPlayoffs"></ol>')
                    $('#rankPlayoffs').append('<li><a>' + item.Season + '</a>' + ' Rank:' + val + '</li>')
                    count += 1
                } else {
                    $('#rankPlayoffs').append('<li><a>' + item.Season + '</a>' + ' Rank: ' + val + '</li>')
                }

            }
        })
    }

    )
}
//remove from fav
function Remove_player(records) {
    //console.log(records)
    var jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
    for (let key in jogadores) {
        if (jogadores.hasOwnProperty(key) && JSON.stringify(jogadores[key].Id) === JSON.stringify(records)) {
            jogadores.splice(key, 1);
            //console.log(jogadores);
            break;
        }
    }
    jogadores = localStorage.setItem("jogadores", JSON.stringify(jogadores))
    alert("Jogador removido dos favoritos")
    location.reload();
}
//add to fav
function add_player() {
    var records = localStorage.getItem('Jogadoradd')
    records = JSON.parse(records)
    var jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];



    count = 0
    for (let key in jogadores) {

        if (jogadores.hasOwnProperty(key) && JSON.stringify(jogadores[key]) === JSON.stringify(records)) {
            count = 1

        }
    }
    //console.log(count)
    if (count === 0) {

        jogadores.push(records);
        //console.log(jogadores)
        jogadores = localStorage.setItem("jogadores", JSON.stringify(jogadores))
        player = records
        alert("Jogador adicionado aos favoritos")
        location.reload();
    }
    else {
        alert("Jogador já nos favoritos")
    }

};