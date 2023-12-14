var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Teams');
    self.displayName = 'NBA Teams List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.Id =ko.observableArray("");
    self.Acronym =ko.observableArray("");
    self.Name =ko.observableArray("");
    self.Logo = ko.observable("");
    self.SetFavourites =ko.observable("")
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
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
        console.log('CALL: getTeams...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Acronym(data.Acronym);
            self.Name(data.Name);
            self.Logo(data.Logo);
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);

            self.SetFavourites(data.Records);
            SetFavourites()
        });
    };



    function SetFavourites() {
        var lista_team = JSON.parse(localStorage.getItem("Team")) || [];
        self.SetFavourites(self.records().filter(function (team) {

            return lista_team.includes((team.Id).toString());

        }))
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
    var Teams = JSON.parse(localStorage.getItem("Teams")) || [];
    $('#fav_div').show()


    if (Teams.length > 0) {
        
        Teams.forEach(Team => {
            console.log(Team)
            $('#favourites').append(`
                <div class="card mb-3" style="max-width: 400px; margin-right: 5px; margin-bottom: 5px;" !important>
                    <div class="row g-0">
                        <div class="col-md-7">
                            <div class="card-body">
                                <h5 class="card-title">${Team.Name}</h5>
                                <p class="card-text">
                                    <a href="./countryDetails.html?id=${Team.CountryId}" class="nav-link">${Team.CountryName}</a>
                                </p>
                                <p class="card-text">
                                    <small class="text-body-secondary">
                                        <a href="./positionDetails.html?id=${Team.PositionId}" class="nav-link">${Team.PositionName}</a>
                                    </small>
                                </p>
                                <div class="fixed">
                                    <a href="./TeamsDetails.html?id=${Team.Id}" class="btn btn-primary">Show Details</a>
                                    <button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"
                                    onclick="Remove_player(${Team.Id})">
                                        <i class="fa-solid fa-trash" id="favourite_${Team.Id}" title="Remove to favorites" ></i>
                                        
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5" style="margin: none;">
                <img src="${Team.Logo}" alt="${Team.Name}" class="card-img-top" style="width: 168px; height: 185px; border-radius: 5px;">
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






function add_player(records) {

    var Teams = JSON.parse(localStorage.getItem("Teams")) || [];



    count = 0
    for (let key in Teams) {

        if (Teams.hasOwnProperty(key) && JSON.stringify(Teams[key]) === JSON.stringify(records)) {
            count = 1

        }
    }
    console.log(count)
    if (count === 0) {

        Teams.push(records);
        console.log(Teams)
        Teams = localStorage.setItem("Teams", JSON.stringify(Teams))
        Team = records
        $('#fav_div').show()
        $('#favourites').append(`
                <div class="card mb-3" style="max-width: 400px; margin-right: 5px; margin-bottom: 5px;" !important>
                    <div class="row g-0">
                        <div class="col-md-7">
                            <div class="card-body">
                                <h5 class="card-title">${Team.Name}</h5>
                                <p class="card-text">
                                    <a href="./countryDetails.html?id=${Team.CountryId}" class="nav-link">${Team.CountryName}</a>
                                </p>
                                <p class="card-text">
                                    <small class="text-body-secondary">
                                        <a href="./positionDetails.html?id=${Team.PositionId}" class="nav-link">${Team.PositionName}</a>
                                    </small>
                                </p>
                                <div class="fixed">
                                    <a href="./TeamsDetails.html?id=${Team.Id}" class="btn btn-primary">Show Details</a>
                                    <button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"
                                    onclick="Remove_player(${Team.Id})">
                                        <i class="fa-solid fa-trash" id="favourite_${Team.Id}" title="Remove to favorites" ></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5" style="margin: none;">
                <img src="${Team.Logo}" alt="${Team.Name}" class="card-img-top" style="width: 168px; height: 185px; border-radius: 5px;">
                        </div>
                    </div>
                </div>
            `);
        alert("Team adicionado aos favoritos")
    }
    else {
        alert("Team já nos favoritos")
    }

};
function Remove_player(records) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(records)
    var Teams = JSON.parse(localStorage.getItem("Teams")) || [];
    for (let key in Teams) {
        console.log('key' + key)
        if (Teams.hasOwnProperty(key) && JSON.stringify(Teams[key].Id) === JSON.stringify(records)) {
            Teams.pop(key);
            console.log(Teams)
            break

        }
    }
    Teams = localStorage.setItem("Teams", JSON.stringify(Teams))
    alert("Team removido dos favoritos")
    location.reload();
}