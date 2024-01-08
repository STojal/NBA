
// ViewModel KnockOut
var vm = function (seasonId, playerid) {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/api/Players/Statistics?id=' + playerid + '&seasonId=' + seasonId);
    self.displayName = 'NBA Player Details in the regular season ' + seasonId;
    console.log('http://192.168.160.58/NBA/api/Players/Statistics?id=' + playerid + '&seasonId=' + seasonId)
    
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.PlayerId = ko.observable('');
    self.Season = ko.observable('');
    self.TeamId = ko.observable('');
    self.Acronym = ko.observable('');
    self.Regular = ko.observable('');
    
    //--- Page Events
    self.activate = function () {
        console.log('CALL: getPlayer...');
        var composedUri = self.baseUri()
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();

            self.PlayerId(data.PlayerId);
            self.Season(data.Season);
            self.TeamId(data.TeamId);
            self.Acronym(data.Acronym);
            self.Regular(data.Regular);
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
    //--- start ....
    showLoading();

    self.activate()
    console.log("VM initialized!");
};
$(document).ready(function () {
    var location = window.location.href

    var parametros = location.split('?')[1]
    var seasonId = parametros.split('&')[0]
    var playerid = parametros.split('&')[1]
    
    ko.applyBindings(new vm(seasonId, playerid));
})