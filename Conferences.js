// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Conferences');
    self.displayName = 'NBA Conferences List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
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
        console.log('CALL: getConferences...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            var record = data.Records
            localStorage.setItem('records',JSON.stringify(record))
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            checkfav()
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
//verifica se esta nos fav
function checkfav() {
    var Conference = localStorage.getItem('records')
    Conference = JSON.parse(Conference) || []
    var fav = localStorage.getItem('Conferences')
    var list = JSON.parse(fav) || [];
    for (i = 0; i < Conference.length; i++) {
        //console.log("aaa")

        //console.log(Conference[i])
        var check = list.some(item => item.Id === Conference[i].Id);
        //console.log(check)
        if (check) {
            mudarbotao(Conference[i].Id)
        }
    }
}

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})

//moda o botao para o de remover
function mudarbotao(id) {
    var itemRemove = '#favestado_' + id
    var itemADD = '#favestado_' + id
    $(itemRemove).empty()
    $(itemADD).append('<button class="btn btn-default btn-xs" style="background-color: red; border-radius: 30px;float: right;;margin-left: 10px;"' +
        'onclick="Remove_player('+ id +')">' +
        '<i class="fa-solid fa-trash" id="favourite_" title="Remove to favorites" ></i>' +
        '</button>')
}
//remove player dos fav
function Remove_player(records) {
    //console.log(records)
    var Conferences = JSON.parse(localStorage.getItem("Conferences")) || [];
    for (let key in Conferences) {
        if (Conferences.hasOwnProperty(key) && JSON.stringify(Conferences[key].Id) === JSON.stringify(records)) {
            Conferences.splice(key, 1);
            //console.log(Conferences);
            break;
        }
    }
    
    Conferences = localStorage.setItem("Conferences", JSON.stringify(Conferences))
    alert("Conference removido dos favoritos")
    location.reload()
}
//adcionar os fav
function add_player(records) {


    console.log(records)
    var Conferences = JSON.parse(localStorage.getItem("Conferences")) || [];



    count = 0
    for (let key in Conferences) {

        if (Conferences.hasOwnProperty(key) && JSON.stringify(Conferences[key]) === JSON.stringify(records)) {
            count = 1

        }
    }
    //console.log(count)
    if (count === 0) {

        Conferences.push(records);
        //console.log(Conferences)
        console.log('aaaa')
        Conferences = localStorage.setItem("Conferences", JSON.stringify(Conferences))
        alert("Conference adicionado aos favoritos")
        mudarbotao(records.Id)

    }
    else {
        alert("Conference já nos favoritos")
    }

};