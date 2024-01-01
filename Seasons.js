// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Seasons');
    self.displayName = 'Seasons List';
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
            var record = data.Records
            localStorage.setItem('records', JSON.stringify(record))
            self.Height(data.Height);
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            self.Photo(data.Photo);
            checkfav()
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


function checkfav() {
    var Season = localStorage.getItem('records')
    Season = JSON.parse(Season) || []
    var fav = localStorage.getItem('Seasonfav')
    var list = JSON.parse(fav) || [];
    for (i = 0; i < Season.length; i++) {
        //console.log("aaa")

        //console.log(Season[i])
        var check = list.some(item => item.Id === Season[i].Id);
        //console.log(check)
        if (check) {
            mudarbotao(Season[i].Id)
        }
    }
}
function mudarbotao(id) {
    var itemRemove = '#favestado_' + id
    var itemADD = '#favestado_' + id
    $(itemRemove).empty()
    $(itemADD).append('<button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;float: right;;margin-left: 10px;"' +
        'onclick="Remove_player(' + id + ')">' +
        '<i class="fa-solid fa-trash" id="favourite_" title="Remove to favorites" ></i>' +
        '</button>')
}

function Remove_player(records) {
    //console.log(records)
    var fav = JSON.parse(localStorage.getItem("Seasonfav")) || [];
    for (let key in fav) {
        if (fav.hasOwnProperty(key) && JSON.stringify(fav[key].Id) === JSON.stringify(records)) {
            fav.splice(key, 1);
            //console.log(fav);
            break;
        }
    }

    fav = localStorage.setItem("Seasonfav", JSON.stringify(fav))
    alert("Season  removido dos favoritos")
    location.reload()
}
//adcionar os fav
function add_player(records) {


    console.log(records)
    var fav = JSON.parse(localStorage.getItem("Seasonfav")) || [];



    count = 0
    for (let key in fav) {

        if (fav.hasOwnProperty(key) && JSON.stringify(fav[key]) === JSON.stringify(records)) {
            count = 1

        }
    }
    //console.log(count)
    if (count === 0) {

        fav.push(records);
        //console.log(fav)
        fav = localStorage.setItem("Seasonfav", JSON.stringify(fav))
        alert("Season  adicionado aos favoritos")
        mudarbotao(records.Id)

    }
    else {
        alert("Season  já nos favoritos")
    }

};
//autocomplete
$("#tags").on("input", function () {
    var inputValue = $(this).val();
    //only works if lenght is more than 2
    if (inputValue.length < 2) {
        $("#ui-id-1").empty();
        localStorage.setItem("Autoconplete", JSON.stringify([]))

    }
    //call the api
    else if (inputValue.length == 2) {
        url = 'http://192.168.160.58/NBA/api/Seasons/Search?q=' + $("#tags").val();
        console.log('CALL: getAutocomplete...');
        ajaxHelper(url, 'GET').done(function (data) {
            autocomplete = data
            localStorage.setItem("Autoconplete", JSON.stringify(autocomplete))
        });
    }
    //appends the inf
    var autocomplete = JSON.parse(localStorage.getItem("Autoconplete")) || [];
    console.log(autocomplete.length != 0)
    //if autocomplete has something
    if (autocomplete.length != 0) {
        $("#tags").autocomplete({

            source: function (request, response) {
                var term = request.term.toLowerCase();
                var filteredAutocomplete = autocomplete.filter(function (item) {
                    return item.Season.includes(term);
                });
                response(filteredAutocomplete);
            },
            autoFocus: true,
            minLength: 0,
            open: function () {
                darkmodestate = localStorage.getItem("darkmode_state")

                $(".ui-autocomplete:visible").css({ top: "+=20" });
                if (darkmodestate == 1) {
                    $(".ui-autocomplete:visible").css({
                        backgroundColor: "gray",
                    });
                }
                else{
                    $(".ui-autocomplete:visible").css({
                        backgroundColor: "white",
                    });
                }

            },

        }).data("ui-autocomplete")._renderItem = function (ul, item) {

            if (item.Season != undefined) {
                return $("<li>")
                    .attr("data-value", item.Season)
                    .append('<a href="./SeasonsDetails.html?id=' + item.Id + '"><span>' + item.Season + '</span> <a>')
                    .appendTo(ul);
            }
            else {
                return $("<li>")
                    .attr("data-value", item.Season)
                    .append('<span>Season not found</span>')
                    .appendTo(ul);
            }


        };
    }    //if autocomplete has nothing

    else {

        $("#tags").autocomplete({
            source: function (request, response) {
                response([{ label: "Season not found" }]);
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