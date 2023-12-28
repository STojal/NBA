
$(document).ready(function () {

    var composedUri = "http://192.168.160.58/NBA/api/Statistics/Top5RankedPlayerByPlayoffSeason";
    ajaxHelper(composedUri, 'GET').done(function (stats) {
        var sortedData = stats.sort((a, b) => b.Season - a.Season);
        var reverseddata = sortedData.reverse()


        for (count = 0; count < 5; count++) {
            console.log(reverseddata[count])
            var players = reverseddata[count].Players
            console.log(typeof(players[4].PlayerId))


                item = '#item'+count+'Title'
                $(item).text(reverseddata[count].Season)

            podium = '#list-item-'+count
            $(podium).append(
                reverseddata[count].Season+
                '<div class= "container podium" >'+
                '<div class="podium__item">'+
                '<p class="podium__city"><a href="./PlayersDetails.html?id=' + players[3].PlayerId+'">'+players[3].PlayerName+'</a></p>'+
                '<div class="podium__rank fourth">4</div>'+
                '</div>'+
                '<div class="podium__item">'+
                '<p class="podium__city"><a href="./PlayersDetails.html?id=' + players[1].PlayerId+'">'+players[1].PlayerName+'</a></p>'+
                '<div class="podium__rank second">2</div>'+
                '</div>'+
                '<div class="podium__item">'+
                '<p class="podium__city"><a href="./PlayersDetails.html?id=' + players[0].PlayerId+'">'+players[0].PlayerName+'</a></p>'+
                '<div class="podium__rank first"><b>1</b>'+

                '</div>'+
                '</div>'+
                '<div class="podium__item">'+
                '<p class="podium__city"><a href="./PlayersDetails.html?id=' + players[2].PlayerId+'">'+players[2].PlayerName+'</a></p>'+
                '<div class="podium__rank third">3</div>'+
                '</div>'+
                '<div class="podium__item">'+
                '<p class="podium__city"><a href="./PlayersDetails.html?id=' + players[4].PlayerId+'">'+players[4].PlayerName+'</a></p>'+
                '<div class="podium__rank fivth">5</div>'+
                '</div>'+
                '</div>'
               )
                



            }



    })
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
    });
}
