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
            //self.SetFavourites();
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
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})

function add_player() {

    var lista = JSON.parse(localStorage.getItem("Lista")) || [];
    var name = event.target.id
    var id = name.split("_")
    console.log(Array.isArray(lista));
    id = id[1]
    if (!lista.includes(id)) {

        lista.push(id);
        console.log(lista)
        lista = localStorage.setItem("Lista", JSON.stringify(lista))

        alert("Jogador adicionado aos favoritos")
    }
    else {
        alert("Jogador já nos favoritos")
    }

};

$(document).ready(function () {
    var lista = JSON.parse(localStorage.getItem("Lista")) || [];
    if (lista.length != 0) {
        $(".favourites").show()
        for (i in lista) {
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
                self.CountryId = ko.observable('');
                self.CountryName = ko.observable('');
                self.PositionId = ko.observable('');
                self.PositionName = ko.observable('');
                self.Photo = ko.observable('');

                //--- Page Events
                self.activate = function (id) {
                    console.log('CALL: getPlayer...');
                    var composedUri = self.baseUri() + id;
                    ajaxHelper(composedUri, 'GET').done(function (data) {
                        console.log(data);
                        hideLoading();

                        self.Id(data.Id);
                        self.Name(data.Name);
                        self.CountryId(data.CountryId);
                        self.CountryName(data.CountryName);
                        self.PositionId(data.PositionId);
                        self.PositionName(data.PositionName);
                        self.Photo(data.Photo);
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
            $(".favourites").innerHTML +=
                '<div data-bind="foreach: records" class="row" id="Players">' +
                '<div class="card mb-3" style="max-width: 400px; margin-right: 5px; margin-bottom: 5px;">' +
                '<div class="row g-0">' +
                '<div class="col-md-7">' +
                '<div class="card-body">' +
                '<h5 class="card-title" data-bind="text: Name"></h5>' +
                '<p class="card-text" data-bind="text: CountryName">' +
                '<a href="./countryDetails.html?id=" class="nav-link"' +
                'data-bind="text: CountryName, attr: { href:"./countryDetails.html?id=" + CountryId }"' +
                'title="Show Country Details"></a>' +
                '</p>' +
                '<p class="card-text">' +
                '<small class="text-body-secondary" data-bind="text: PositionName">' +
                '<a href="./positionDetails.html?id=" class="nav-link"' +
                'data-bind="text: PositionName, attr: { href:' + './positionDetails.html?id=' + ' + PositionId }"' +
                'title="Show Position Details"></a>' +
                '</small>' +
                '</p>' +
                '<div class="fixed">' +
                '<a href="./PlayersDetails.html" class="btn btn-primary"' +
                'data-bind="attr: { href:"+"./PlayersDetails.html?id=" + "Id" }">Show Details</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-5" style="margin: none;">' +
                '<!-- ko if: Photo === null -->' +
                '<img src="images/logo players.png" alt data-bind="text: Name" class="card-img-top"' +
                'style="width: 168px; height: 185px;border-radius:5px ">' +
                '<!-- /ko -->' +
                '<!-- ko ifnot: Photo === null -->' +
                '<img data-bind="attr: { src: Photo, alt: "Name" }" class="card-img-top"' +
                'style="width: 168px; height: 185px;border-radius:5px ">' +
                '<!-- /ko -->' +
                '</div>' +
                '</div>' +

                '</div>' +
                '</div>'


        };
    };
});