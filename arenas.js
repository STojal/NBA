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
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            criarmapa(recoords_data)
            self.SetFavourites(data.Records);
            SetFavourites()
            setList(recoords_data)
        });
    };
    function SetFavourites() {
        var lista_arenas = JSON.parse(localStorage.getItem("Arenas")) || [];
        self.SetFavourites(self.records().filter(function (arena) {

            return lista_arenas.includes((arena.Id).toString());

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
    console.log("ready!");
    ko.applyBindings(new vm());

});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
    
})






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
};

function add_arena() {
    var arenas = JSON.parse(localStorage.getItem("Arenas")) || [];
    var name = event.target.id
    var id = name.split("_")

    console.log(Array.isArray(arenas));
    id = id[1]
    if (!arenas.includes(id)) {

        arenas.push(id);
        console.log(arenas)
        arenas = localStorage.setItem("Arenas", JSON.stringify(arenas))

        alert("Arena adicionado aos favoritos")
    }
    else {
        alert("Arena já nos favoritos")
    }

};
function Remove_arena() {
    var arenas = JSON.parse(localStorage.getItem("Arenas")) || [];

    var name = event.target.id
    var id = name.split("_")
    id = id[1]
    arenas.pop(id);
    console.log(arenas)
    arenas = localStorage.setItem("Arenas", JSON.stringify(arenas))
    alert("Arena removida dos favoritos")

}

function setList(results){
    console.log(results)
    for (const arena of results){
        // creating a li element for each result item
        const resultItem = document.createElement('li')

        // adding a class to each item of the results
        resultItem.classList.add('result-item')

        // grabbing the name of the current point of the loop and adding the name as the list item's text
        const text = document.createTextNode(arena.name)

        // appending the text to the result item
        resultItem.appendChild(text)
    
    }

    var searchInput = document.querySelector('#search')
    searchInput.addEventListener("input", (e) => {
        let value = e.target.value
    
        if (value && value.trim().length > 5){
            value = value.toLowerCase()
            console.log(value)
            //returning only the results of setList if the value of the search is included in the person's name
            setList(results.filter(arena => {
                console.log((arena.Name).toLowerCase())
                console.log(arena.Name.toLowerCase().includes(value))
                return arena.Name.includes(value)}));
        
    };});





}