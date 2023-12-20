// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Players');
    self.displayName = 'NBA Players List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.Height = ko.observable('');
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.Photo = ko.observable('');
    self.SetFavourites = ko.observable('')
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getPlayers...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Height(data.Height);
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            self.Photo(data.Photo);
            self.SetFavourites(data.Records)
            console.log(self.SetFavourites())


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

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
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
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    var jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
    $('#fav_div').show()

    // console.log("fafaf" + jogadores.length)
    if (jogadores.length > 0) {

        jogadores.forEach(player => {
            console.log(player)
            $('#favourites').append(`
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
                                    <button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"
                                    onclick="Remove_player(${player.Id})">
                                        <i class="fa-solid fa-trash" id="favourite_${player.Id}" title="Remove to favorites" ></i>
                                        
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5" style="margin: none;">
                <img src="${player.Photo}" alt="${player.Name}" class="card-img-top" style="width: 168px; height: 185px; border-radius: 5px;">
                        </div>
                    </div>
                </div>
            `)
        });

    }
    else{
        $('#favourites').append(`
            <div class="info">Nenhuma Jogador nos favoritos</div>

            `)

    }

    


    console.log("ready!");
    ko.applyBindings(new vm());


});















$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})

function add_player(records) {

    var jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
    


    count = 0
    for (let key in jogadores) {

        if (jogadores.hasOwnProperty(key) && JSON.stringify(jogadores[key]) === JSON.stringify(records)) {
            count = 1

        }
    }
    console.log(count)
    if (count === 0) {

        jogadores.push(records);
        console.log(jogadores)
        jogadores = localStorage.setItem("jogadores", JSON.stringify(jogadores))
        player = records
        $('#fav_div').show()
        $('#favourites .info').remove()
        $('#favourites').append(`
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
                                    <button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"
                                    onclick="Remove_player(${player.Id})">
                                        <i class="fa-solid fa-trash" id="favourite_${player.Id}" title="Remove to favorites" ></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5" style="margin: none;">
                <img src="${player.Photo}" alt="${player.Name}" class="card-img-top" style="width: 168px; height: 185px; border-radius: 5px;">
                        </div>
                    </div>
                </div>
            `);
        alert("Jogador adicionado aos favoritos")
    }
    else {
        alert("Jogador já nos favoritos")
    }

};
function Remove_player(records) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(records)
    var jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
    for (let key in jogadores) {
        if (jogadores.hasOwnProperty(key) && JSON.stringify(jogadores[key].Id) === JSON.stringify(records)) {
            console.log('key: ' + key);
            jogadores.splice(key, 1);
            console.log(jogadores);
            break;
        }
    }
    jogadores = localStorage.setItem("jogadores", JSON.stringify(jogadores))
    alert("Jogador removido dos favoritos")
    location.reload();
}

$("#tags").on("input", function () {
    var inputValue = $(this).val();
    if (inputValue.length < 2) {
        $("#ui-id-1").empty();
        localStorage.setItem("AutoconpletePlayers", JSON.stringify([]))

    }
    else if (inputValue.length == 2) {
        url = 'http://192.168.160.58/NBA/api/Players/Search?q=' + $("#tags").val();
        console.log('CALL: getAutocomplete...');
        ajaxHelper(url, 'GET').done(function (data) {
            autocomplete = data
            localStorage.setItem("AutoconpletePlayers", JSON.stringify(autocomplete))
        });
    }

    var autocomplete = JSON.parse(localStorage.getItem("AutoconpletePlayers")) || [];

    if (autocomplete.length != 0) {
        $("#tags").autocomplete({
            source: function (request, response) {
                var term = request.term.toLowerCase();
                var filteredAutocomplete = autocomplete.filter(function (item) {
                    return item.Name.toLowerCase().includes(term);
                });
                response(filteredAutocomplete);
            },
            autoFocus: true,
            minLength: 0,
            open: function () {
                $(".ui-autocomplete:visible").css({ top: "+=20" });
            },

        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            console.log(item.Name)
            console.log(item.Id)
            return $("<li>")
                .attr("data-value", item.Name)
                .append('<a href="./PlayersDetails.html?id=' + item.Id + '">' + item.Name + ' <a>')
                .appendTo(ul);
        };
    }
    else {
        $("#tags").autocomplete({
            source: function (request, response) {
                response([{ label: "Player not found" }]);
            },
            autoFocus: true,
            open: function () {
                $(".ui-autocomplete:visible").css({ top: "+=20" });
            },

        })
    }
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
    })
}
