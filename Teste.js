$(document).ready(function () {
    var url = window.location.href
    console.log(url)
    var parametros = url.split("&")
    var search = parametros[1].split("=")[1]
    console.log(search)
    urlcompost = 'http://192.168.160.58/NBA/api/Search?q='+search +'&page=1&pagesize=20'
    ajaxHelper(urlcompost, 'GET').done(function (data) {
        autocomplete = data
        console.log(autocomplete)
    });
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