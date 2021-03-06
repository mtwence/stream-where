// Globals 
var input = $("#input");
var form = $("#form");

var submitButton = document.querySelector("#submit-button");

// Return Locale Storage on reload
retrieveFav();

// Add most recent movie clicked to save to page on reload 
$(".favorite-btn").click(function () {
	var favTitle = $(this).siblings(".card-content").children(".media").children(".media-content").children(".movie-title").text();
	if (favTitle != null || favTitle != "") {
		localStorage.setItem("call", favTitle);
		console.log(favTitle + " saved.");
	} else {
		console.log("Invalid.");
	}
});

// Function to retrieve local storage 
function retrieveFav() {
	var movieInput = localStorage.getItem("call");
	if (movieInput != null) {
		console.log("Your favorite movie is: " + movieInput);
		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': 'a341e5528dmshfb626c60584810dp17d30ejsnb83576f61579',
				'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
			}
		};

		fetch('https://movie-database-alternative.p.rapidapi.com/?s=' + movieInput + '&r=json&page=1', options)
			.then(function (response) {
				return response.json();
			}).then(function (data) {
				var IDstorage = []; // Array for storing IDs
				for (var i = 0; i < data.Search.length - 1; i++) {
					//Image link to the poster
					var poster = data.Search[i].Poster;
					var imageDisplay = document.getElementById(i + 1).children[1].children[0].children[0].children[0].children[0];
					imageDisplay.setAttribute("src", poster);
					//Movie title
					var title = data.Search[i].Title;
					var titleDisplay = document.getElementById(i + 1).children[1].children[0].children[1].children[1];
					titleDisplay.textContent = title;
					//Release year
					var year = data.Search[i].Year;
					var yearDisplay = document.getElementById(i + 1).children[1].children[0].children[1].children[3];
					yearDisplay.textContent = "Release Year: " + year;
					//Critical imdbID
					var imdbID = data.Search[i].imdbID;
					IDstorage.push(imdbID);
				}
				console.log(IDstorage);

				const options1 = {
					method: 'GET',
					headers: {
						'X-RapidAPI-Key': 'a341e5528dmshfb626c60584810dp17d30ejsnb83576f61579',
						'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
					}
				};
				// Fetch request to utelly API which gathers data on movie availability on streaming platforms| for loop to add all the imdb codes pushed to idStorage
				for (var j = 0; j < IDstorage.length; j++) {
					fetch('https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id=' + IDstorage[j] + '&source=imdb&country=us', options1)
						.then(function (res) {
							return res.json();
						}).then(function (data) {
							console.log(data);
							var streamStorage = [];
							var streamLength = data.collection.locations.length
							console.log(streamLength)
							// for loop to gather streaming platform name, icon, and link to watch/buy 
							for (var i = 0; i < streamLength; i++) {
								var streamName = data.collection.locations[i].display_name;
								streamStorage.push(streamName)
								console.log(streamStorage)

								for (var k = 0; k < streamStorage.length; k++) {
									var streamDisplay = document.getElementById(i + 1).children[1].children[1];
									if (streamStorage < 1) {
										streamDisplay.textContent = "Not Available for Streaming"
									}
									else {
										streamDisplay.textContent = "Streaming Here: " + streamStorage;
										var icon = data.collection.locations[i].icon;
										console.log(icon);

										var link = data.collection.locations[i].url;
										console.log(link);
									}
								}
							}
						})
				}
			})
	}
}


// function to add %20 inbetween spaces of searchs for input into MDA API
form.on("submit", function (x) {
	x.preventDefault();
	var search = input.val();
	var rep = / /gi;
	var movieInput = search.replace(rep, "%20");

	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'a341e5528dmshfb626c60584810dp17d30ejsnb83576f61579',
			'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
		}
	};
	// Fetch request to MDA APi
	fetch('https://movie-database-alternative.p.rapidapi.com/?s=' + movieInput + '&r=json&page=1', options)
		.then(function (response) {
			return response.json();
		}).then(function (data) {
			var IDstorage = []; // Array for storing IDs
			for (var i = 0; i < data.Search.length - 1; i++) {
				//Image link to the poster
				var poster = data.Search[i].Poster;
				var imageDisplay = document.getElementById(i + 1).children[1].children[0].children[0].children[0].children[0];
				imageDisplay.setAttribute("src", poster);
				//Movie title
				var title = data.Search[i].Title;
				var titleDisplay = document.getElementById(i + 1).children[1].children[0].children[1].children[1];
				titleDisplay.textContent = title;
				//Release year
				var year = data.Search[i].Year;
				var yearDisplay = document.getElementById(i + 1).children[1].children[0].children[1].children[3];
				yearDisplay.textContent = "Release Year: " + year;
				//Critical imdbID
				var imdbID = data.Search[i].imdbID;
				IDstorage.push(imdbID);
			};

			const options1 = {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': 'a341e5528dmshfb626c60584810dp17d30ejsnb83576f61579',
					'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
				}
			};
			// Fetch request to utelly API which gathers data on movie availability on streaming platforms| for loop to add all the imdb codes pushed to idStorage
			for (var j = 0; j < IDstorage.length; j++) {
				fetch('https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id=' + IDstorage[j] + '&source=imdb&country=us', options1)
					.then(function (res) {
						return res.json();
					}).then(function (data) {
						console.log(data);
						var streamStorage = [];
						var streamLength = data.collection.locations.length
						// for loop to gather streaming platform name, icon, and link to watch/buy 
						for (var i = 0; i < streamLength; i++) {
							var streamName = data.collection.locations[i].display_name;
							streamStorage.push(streamName)
							for (var k = 0; k < streamStorage.length; k++) {
								var streamDisplay = document.getElementById(i + 1).children[1].children[1];
								streamDisplay.textContent = "Streaming Here: " + streamStorage;
								var icon = data.collection.locations[i].icon
								var link = data.collection.locations[i].url;
							}
						}
					}
					)
			}
		})
})