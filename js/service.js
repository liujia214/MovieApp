angular.module('movieApp',[]).controller('movieController',function($scope,$http){
    $scope.movies = {};

    //get image base url by configuration method
    $http.get('https://api.themoviedb.org/3/configuration?api_key=93de35ae5c8a692fb531be661be11895')
        .then(function(result){
           $scope.base_url = result.data.images.base_url;
        });
    //get collection by collection method
    $http.get('https://api.themoviedb.org/3/collection/528?api_key=93de35ae5c8a692fb531be661be11895')
        .then(function(result){
            $scope.collection = result.data.parts;
            $scope.collection.forEach(function(movie,index){
                //get all movie details and store them into an object
                $http.get('http://api.themoviedb.org/3/movie/' + movie.id + '/credits?api_key=93de35ae5c8a692fb531be661be11895').then(function(result){
                    var stars = result.data.cast;
                    //show first four characters' names on page
                    var stars_name = stars.map(function(e){
                        return e.name;
                    }).slice(0,4).join(', ');

                    var director = result.data.crew.filter(function(e){
                        return e.job === 'Director';
                    }).map(function(e){
                        return e.name;
                    }).join(', ');

                    var writers = result.data.crew.filter(function(e){
                        return e.job === 'Author' || e.job === 'Writer' || e.job === 'Story' || e.job === 'Screenplay';
                    }).map(function(e){
                        return e.name;
                    });
                    //retrieve unique writers' names
                    writers = writers.sort().filter(function(ele,index,arr){
                        return !index || arr[index-1]!= ele;
                    }).join(', ');
                    //store movies' detail into an object
                    $scope.movies[movie.id] ={director:director,writers:writers,stars_name:stars_name,stars:stars};

                    //show the first movie detail when page is initialized
                    if(index===0)$scope.focus($scope.collection[0]);
                });
            });
        });
    //show movie detail when focus on different movies
    $scope.focus = function(movie){
        //delete the other movies' focus style at first
        $scope.collection.forEach(function(e){
            e.isFocus = false;
        });
        //then add style to the focused one
        movie.isFocus = true;
        //retrieve the movie detail from movie object based on movie's id
        var focusedMovie = $scope.movies[movie.id];
        $scope.movie_img = movie.poster_path;
        $scope.overview = movie.overview;
        $scope.director =focusedMovie.director;
        $scope.writers = focusedMovie.writers;
        $scope.stars_name = focusedMovie.stars_name;
        $scope.stars =  focusedMovie.stars;
        console.log($scope.stars);
        //show first character's photo when page is initialized
        $scope.cast($scope.stars[0]);
    };
    //show character photo when focus on different characters
    $scope.cast = function(star){
        $scope.stars.forEach(function(e){
            e.isFocus = false;
        });
        star.isFocus = true;
        $scope.cast_img = star.profile_path;
    }
});