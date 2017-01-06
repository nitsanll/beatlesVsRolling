    var songData = angular.module('songData', []);

var model = {};

songData.run(function($rootScope ,$http, $compile) {
    $http.get("https://beatlesws.herokuapp.com/getAllSongs").success(function(data){
        model = data;
        $rootScope.$broadcast('init');
    });
});

songData.controller('songscontroller', ['$scope', '$rootScope', '$compile', function($rootScope, $scope, $compile){
    function init() {
        $scope.beatles = [];
        $scope.rolling = [];
        var beatlesArr = [];
        var rollingArr = [];
        
        for(var i = 0; i<model.length; i++){
            var dateString = model[i].release_date;
            var dateArr = dateString.split("/");
            var d = new Date(dateArr[0] + " 1 " +dateArr[1]);
            model[i].date = d;
            if(model[i].band_name == "Beatles"){
                beatlesArr.push(model[i]); 
            }
            else {
                rollingArr.push(model[i]);
            }
        }
        
        beatlesArr.sort(function(a,b) { 
            return a.date - b.date;
        });

        rollingArr.sort(function(a,b) { 
            return a.date - b.date;
        });

        $scope.beatles = beatlesArr;
        $scope.rolling = rollingArr;
    }

    $scope.showSong = function(songName, bandName, writerName, albumName, releaseDate, songLyrics) {
        var songSec = "";
        if(bandName == "Beatles") {
            songSec = angular.element(document.querySelector('#bSong'));
        } else if(bandName == "Rolling Stones") {
            songSec = angular.element(document.querySelector('#rSong'));
        }
        var song = '<h1 id = "songName">' + songName +'</h1> <p id = "songDetails"> <b> writer(s): </b>'
        + writerName + '<br> <b> Album: </b>' + albumName
        + '<br> <b> Released: </b>' + releaseDate + '</p>'
        + '<p id = "lyrics">' + songLyrics +'</p>';
        songSec.html(song); 
    }

    var unbindHandler = $rootScope.$on('init', function($scope){
        init();
        unbindHandler();
    });
}]);