var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Teams');
    self.displayName = 'NBA Teams List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.Id = ko.observableArray("");
    self.Acronym = ko.observableArray("");
    self.Name = ko.observableArray("");
    self.Logo = ko.observable("");
    self.SetFavourites = ko.observable("")
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
    var Teams = JSON.parse(localStorage.getItem("Teams")) || [];
    $('#fav_div').show()

    //show the favs 

    if (Teams.length > 0) {

        Teams.forEach(Team => {
            var logo = Team.Logo
            if (Team.Logo == null) {
                logo = 'images/equipas.png'
            }

            $('#favourites').append(

                '<div class="card" style="width: 15rem; margin-right: 5px; margin-bottom: 5px;">' +
                '<div class="imagemDivsTeams"' +
                'style="background-image: url(' + logo + ')">' +

                '</div>' +

                '<div class="card-body">' +
                '<h5 class="card-title">' + Team.Name + '</h5>' +
                '<p class="card-text">' +
                '<strong>Acronym:</strong><span>' + Team.Acronym + '</span> <br>' +
                '</p>' +
                '<a  class="btn btn-primary"' +
                'href="./TeamsDetails.html?id=' + Team.Id + '&acronym=' + Team.Acronym + '">Show Details</a>' +
                '<button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"' +
                'onclick="Remove_player(' + Team.Id + ')">' +
                '<i class="fa-solid fa-trash" id="favourite_' + Team.Id + '" title="Remove to favorites" ></i>' +
                '</button>' +
                '</div>' +
                '</div>'
            );
            //console.log(Team)

        })
    } else {
        $('#favourites').append(`
            <div class="info">Nenhuma Team nos favoritos</div>

            `)

    }











    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})





//add to fav and append is to the start of the page
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
        var Team = records
        //change the color of the card depending on the darkmode state
        var darkmode = localStorage.getItem("darkmode_state")
        var BacColor = 'white'
        if (darkmode == 1) {
            BacColor = 'rgb(128, 128, 128)'
        }

        $('#favourites .info').remove()
        $('#fav_div').show()
        if (Team.Logo == null) {
            console.log('null')
            var logo = 'images/equipas.png'
        }
        else {
            var logo = Team.Logo
        }
        $('#favourites').append(

            '<div class="card" style="width: 15rem; margin-right: 5px; margin-bottom: 5px;background-color: ' + BacColor + '">' +
            '<div class="imagemDivsTeams"' +
            'style="background-image: url(' + logo + ')">' +

            '</div>' +

            '<div class="card-body">' +
            '<h5 class="card-title">' + Team.Name + '</h5>' +
            '<p class="card-text">' +
            '<strong>Acronym:</strong><span>' + Team.Acronym + '</span> <br>' +
            '</p>' +
            '<a  class="btn btn-primary"' +
            'href="./TeamsDetails.html?id=' + Team.Id + '&acronym=' + Team.Acronym + '">Show Details</a>' +
            '<button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"' +
            'onclick="Remove_player(' + Team.Id + ')">' +
            '<i class="fa-solid fa-trash" id="favourite_' + Team.Id + '" title="Remove to favorites" ></i>' +
            '</button>' +
            '</div>' +
            '</div>'
        );
        //console.log(Team)


        alert("Team adicionado aos favoritos")
    }
    else {
        alert("Team já nos favoritos")
    }

};
//remove player
function Remove_player(records) {

    var Teams = JSON.parse(localStorage.getItem("Teams")) || [];
    for (let key in Teams) {
        console.log('key' + key)
        if (Teams.hasOwnProperty(key) && JSON.stringify(Teams[key].Id) === JSON.stringify(records)) {
            Teams.splice(key, 1);
            console.log(Teams)
            break

        }
    }
    Teams = localStorage.setItem("Teams", JSON.stringify(Teams))
    alert("Team removido dos favoritos")
    location.reload();
}
//autocomplete 
$("#tags").on("input", function () {
    var inputValue = $(this).val();
    //empty until lenght >2 

    if (inputValue.length < 2) {
        $("#ui-id-1").empty();
        localStorage.setItem("AutoconpleteTeams", JSON.stringify([]))

    }
    //call api 
    else if (inputValue.length == 2) {
        url = 'http://192.168.160.58/NBA/api/Teams/Search?q=' + $("#tags").val();
        console.log('CALL: getAutocomplete...');
        ajaxHelper(url, 'GET').done(function (data) {
            autocomplete = data
            localStorage.setItem("AutoconpleteTeams", JSON.stringify(autocomplete))
        });
    }

    var autocomplete = JSON.parse(localStorage.getItem("AutoconpleteTeams")) || [];
    if (autocomplete.length != 0) {

        $("#tags").autocomplete({
            source: function (request, response) {
                var term = request.term.toLowerCase();

                var filteredAutocomplete = autocomplete.filter(function (item) {
                    return item.Name.toLowerCase().includes(term);
                });
                if (filteredAutocomplete.length == 0){
                    filteredAutocomplete =["Error"]

                }

                response(filteredAutocomplete);
            },
            autoFocus: true,
            minLength: 1,
            open: function () {
                darkmodestate = localStorage.getItem("darkmode_state")

                $(".ui-autocomplete:visible").css({ top: "+=20" });
                if (darkmodestate == 1) {
                    $(".ui-autocomplete:visible").css({
                        backgroundColor: "gray",
                    });
                }
                else {
                    $(".ui-autocomplete:visible").css({
                        backgroundColor: "white",
                    });
                }
            },

        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            if (item.Name != undefined) {
                return $("<li>")
                    .attr("data-value", item.Name)
                    .append('<a href="./TeamsDetails.html?id=' + item.Id + '&acronym=' + item.Acronym + '">' + item.Name + ' <a>')
                    .appendTo(ul);
            }
            else {
                return $("<li>")
                    .attr("data-value", item.Name)
                    .append('<span>Team not found</span>')
                    .appendTo(ul);
            }

        };
    }
    else {

        $("#tags").autocomplete({
            source: function (request, response) {
                response([{ label: "Team not found" }]);
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
$(window).scroll(function () {
    if ($('.ui-autocomplete').length != 0) {
        $('.ui-autocomplete').hide()
    }
});
