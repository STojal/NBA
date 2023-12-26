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
    favorites()
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})


function add_season(records) {
    var seasons = JSON.parse(localStorage.getItem("season")) || [];
    count = 0
    for (let key in seasons) {

        if (seasons.hasOwnProperty(key) && JSON.stringify(seasons[key]) === JSON.stringify(records)) {
            count = 1

        }
    }
    console.log(count)
    if (count === 0) {

        seasons.push(records);
        console.log(seasons)
        seasons = localStorage.setItem("season", JSON.stringify(seasons))
        player = records

    }
    else {
        alert("season já nos favoritos")
    }

};
function Remove_season(records) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(records)
    var Seasons = JSON.parse(localStorage.getItem("season")) || [];
    for (let key in Seasons) {
        if (Seasons.hasOwnProperty(key) && JSON.stringify(Seasons[key].Id) === JSON.stringify(records)) {
            console.log('key: ' + key);
            Seasons.splice(key, 1);
            console.log(Seasons);
            break;
        }
    }
    Seasons = localStorage.setItem("season", JSON.stringify(Seasons))
    alert("season removido dos favoritos")
    location.reload();
}


function favorites() {
    var seasons = JSON.parse(localStorage.getItem("season")) || [];
    var table = document.getElementById("table1");
    var buttons = table.getElementsByTagName("button");
    const val = Object.values(buttons);
    console.log

    /*
    if (seasons.length != 0) {
        for (i = 0; i < seasons.length; i++) {
            for (p = 0; p < rows.length; p++) {
                /*console.log(cells[p])
                console.log(seasons[i])
                if ((rows[p])["id"] == seasons[i]["Id"]) {
                    console.log("aaa")
                }
                
            }
        }
    }*/
}