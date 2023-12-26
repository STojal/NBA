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
    

    // adciona arenas aos favouritos
    if (arenas.length > 0) {

        arenas.forEach(arena => {
            console.log(arena)
            $('#favourites').append(`
            <div class="col-md-4 mb-4">
            <div class="card">
            <div class="card" style="background-image: url('${arena.Photo}'); background-size: cover;">
            <h5 class="card-title">${arena.Name}</h5>
            <p class="card-text"><strong>State:</strong> <a href="./stateDetails.html?id=${arena.StateId}">${arena.StateName}</a></p>
            <p class="card-text"><strong>Team:</strong> <a href="./TeamsDetails.html?id=${arena.TeamId}&acronym=${arena.TeamAcronym}">${arena.TeamName}</a></p>
            <p class="card-text"><strong>Location:</strong> <span>${arena.Location}</span></p>
            <a href="./arenaDetails.html?id=${arena.Id}" class="btn btn-outline-primary me-2">Show Details</a>
            <button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"
            onclick="Remove_player(${arena.Id})">
            <i class="fa-solid fa-trash" id="favourite_${arena.Id}" title="Remove to favorites" ></i>                           
            </button>
            </div>
            </div>

  `)
        });

    }
    else{
        $('#favourites').append(`
            <div class="info">Nenhuma arena nos favoritos</div>

            `)

    }

    console.log("ready!");
    ko.applyBindings(new vm());







});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');

})






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
        $('#favourites .info').remove()
        $('#fav_div').show()
        $('#favourites').append(`
        <div class="col-md-4 mb-4">
        <div class="card">
        <div class="card" style="background-image: url('${arena.Photo}'); background-size: cover;">
        <h5 class="card-title">${arena.Name}</h5>
        <p class="card-text"><strong>State:</strong> <a href="./stateDetails.html?id=${arena.StateId}">${arena.StateName}</a></p>
        <p class="card-text"><strong>Team:</strong> <a href="./TeamsDetails.html?id=${arena.TeamId}&acronym=${arena.TeamAcronym}">${arena.TeamName}</a></p>
        <p class="card-text"><strong>Location:</strong> <span>${arena.Location}</span></p>
        <a href="./arenaDetails.html?id=${arena.Id}" class="btn btn-outline-primary me-2">Show Details</a>
        <button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;"
        onclick="Remove_player(${arena.Id})">
        <i class="fa-solid fa-trash" id="favourite_${arena.Id}" title="Remove to favorites" ></i>                           
        </button>
        </div>
        </div>
        </div>`);
        alert("Arenas adicionado aos favoritos")
    }
    else {
        alert("Arenas já nos favoritos")
    }

};
function Remove_player(records) {
    var arenas = JSON.parse(localStorage.getItem("arenas")) || [];

    for (let key in arenas) {
        if (arenas.hasOwnProperty(key) && JSON.stringify(arenas[key].Id) === JSON.stringify(records)) {
            arenas.splice(key, 1);
            break;
        }
    }
    if (arenas.length === 0){
        $('#favourites').append(`
        <div class="info">Nenhuma Team nos favoritos</div>

        `)
    }
    arenas = localStorage.setItem("arenas", JSON.stringify(arenas));
    alert("Arena removido dos favoritos");

    // Remove the corresponding HTML element from the page
    $('#favourite_' + records).closest('.col-md-4').remove();
    
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
                response([{ label: "Arena not found" }]);
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
$(window).scroll(function() {
        if($('.ui-autocomplete').length != 0){
            $('.ui-autocomplete').hide()
        }
});
