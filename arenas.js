// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Arenas');
    self.displayName = 'NBA Arenas List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.SetFavourites = ko.observable('')
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
        console.log('CALL: getArenas...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            var recoords_data = self.records();
            localStorage.setItem("Teste", JSON.stringify(recoords_data))
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            //criarmapa(recoords_data)
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
    var arenas = JSON.parse(localStorage.getItem("arenas")) || [];
    $('#fav_div').show()


    if (arenas.length > 0) {

        arenas.forEach(arena => {
            console.log(arena)
            $('#favourites').append(`
                <div class="card mb-3" style="max-width: 400px; margin-right: 5px; margin-bottom: 5px;" !important>
                    <div class="row g-0">
                        <div class="col-md-7">
                            <div class="card-body">
                                <h5 class="card-title">${arena.Name}</h5>
                                <p class="card-text">
                                    <a href="./countryDetails.html?id=${arena.CountryId}" class="nav-link">${arena.CountryName}</a>
                                </p>
                                <p class="card-text">
                                    <small class="text-body-secondary">
                                        <a href="./positionDetails.html?id=${arena.PositionId}" class="nav-link">${arena.PositionName}</a>
                                    </small>
                                </p>
                                <div class="fixed">
                                    <a href="./arenasDetails.html?id=${arena.Id}" class="btn btn-primary">Show Details</a>
                                    <button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"
                                    onclick="Remove_player(${arena.Id})">
                                        <i class="fa-solid fa-trash" id="favourite_${arena.Id}" title="Remove to favorites" ></i>
                                        
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5" style="margin: none;">
                <img src="${arena.Photo}" alt="${arena.Name}" class="card-img-top" style="width: 168px; height: 185px; border-radius: 5px;">
                        </div>
                    </div>
                </div>
            `)
        });

    }

    console.log("ready!");
    ko.applyBindings(new vm());







});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');

})





/*
// Não funciona pq a lista de todas as arenas não tem a lat nem a lon
function criarmapa(recoords_data) {
    console.log(recoords_data)


    console.log("window.innerHeight=", window.innerHeight);
    $("#mapid").css("height", window.innerHeight - 200);
    $(window).resize(function () {
        $("#mapid").css("width ", window.innerHeight - 200);
    });

    var mymap = L.map('mapid').setView([37.8, -96], 4);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG9qYWwiLCJhIjoiY2xwdHcwMXlvMGthdTJqcXNvZmg1cTFhNyJ9.MaPOXjhqeGOO4blUtx3dGg', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    for (arena of recoords_data) {
        console.log(arena.Lat)
        if (arena.Lat !== null) {
            L.marker([arena.Lat, arena.Lon], { opacity: 0.80 })
                .bindTooltip(arena.Name).openTooltip()
                .addTo(mymap);
        }
    };
};*/

function add_player(records) {

    var arenas = JSON.parse(localStorage.getItem("arenas")) || [];



    count = 0
    for (let key in arenas) {

        if (arenas.hasOwnProperty(key) && JSON.stringify(arenas[key]) === JSON.stringify(records)) {
            count = 1

        }
    }
    console.log(count)
    if (count === 0) {

        arenas.push(records);
        console.log(arenas)
        arenas = localStorage.setItem("arenas", JSON.stringify(arenas))
        arena = records
        $('#fav_div').show()
        $('#favourites').append(`
                <div class="card mb-3" style="max-width: 400px; margin-right: 5px; margin-bottom: 5px;" !important>
                    <div class="row g-0">
                        <div class="col-md-7">
                            <div class="card-body">
                                <h5 class="card-title">${arena.Name}</h5>
                                <p class="card-text">
                                    <a href="./countryDetails.html?id=${arena.CountryId}" class="nav-link">${arena.CountryName}</a>
                                </p>
                                <p class="card-text">
                                    <small class="text-body-secondary">
                                        <a href="./positionDetails.html?id=${arena.PositionId}" class="nav-link">${arena.PositionName}</a>
                                    </small>
                                </p>
                                <div class="fixed">
                                    <a href="./arenasDetails.html?id=${arena.Id}" class="btn btn-primary">Show Details</a>
                                    <button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"
                                    onclick="Remove_player(${arena.Id})">
                                        <i class="fa-solid fa-trash" id="favourite_${arena.Id}" title="Remove to favorites" ></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5" style="margin: none;">
                <img src="${arena.Photo}" alt="${arena.Name}" class="card-img-top" style="width: 168px; height: 185px; border-radius: 5px;">
                        </div>
                    </div>
                </div>
            `);
        alert("Arenas adicionado aos favoritos")
    }
    else {
        alert("Arenas já nos favoritos")
    }

};
function Remove_player(records) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(records)
    var arenas = JSON.parse(localStorage.getItem("arenas")) || [];
    for (let key in arenas) {
        console.log('key' + key)
        if (arenas.hasOwnProperty(key) && JSON.stringify(arenas[key].Id) === JSON.stringify(records)) {
            arenas.pop(key);
            console.log(arenas)
            break

        }
    }
    arenas = localStorage.setItem("arenas", JSON.stringify(arenas))
    alert("Arena removido dos favoritos")
    location.reload();
}

$("#tags").on("input", function () {
    var inputValue = $(this).val();
    if (inputValue.length < 2) {
        $("#ui-id-1").empty();
        localStorage.setItem("Autoconplete", JSON.stringify([]))

    }
    else if (inputValue.length == 2) {
        url = 'http://192.168.160.58/NBA/api/Arenas/Search?q=' + $("#tags").val();
        console.log('CALL: getAutocomplete...');
        ajaxHelper(url, 'GET').done(function (data) {
            autocomplete = data
            localStorage.setItem("Autoconplete", JSON.stringify(autocomplete))
        });
    }

    var autocomplete = JSON.parse(localStorage.getItem("Autoconplete")) || [];

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
            return $("<li>")
                .attr("data-value", item.Name)
                .append('<a href="./arenaDetails.html?id=' + item.Id + '">' + item.Name + ' <a>')
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
