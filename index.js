var pg = require('pg');
var sql = require("squel").useFlavour('postgres');
var Twit = require('twit');


//mytwitter Auth
var T = new Twit({
	consumer_key : '',
	consumer_secret : '',
	access_token : '',
	access_token_secret : ''
});


//myConnection  postgres://username:password@0.0.0.0:5432/database
var conString = "";

//my stream
var stream = T.stream('statuses/sample');


stream.on('tweet', function(tweet) {
    if (tweet.geo !== null)
        connectToDb(makeSQL(tweet));
});

var client = new pg.Client(conString);
client.connect();
//client.on('drain', client.end.bind(client));

client.on('error', function(error){
    console.log(error);
    client.end.bind(client);
});


function connectToDb(sql){

        
        console.log(sql.values)
        
        var query = client.query(sql);
        
        query.on('end', function (result){
            console.log(result);
        });
        

    
    
}



function makeSQL(tweet){
    
    //just some simple parsing for the special geometry functions i use to store the point
    //some times 3395 or 4326
    //converts the thing to sql nice stuff
    var srid = 4326;  
    var coordinates = tweet.geo.coordinates;
    var query =
        {
				text : "INSERT INTO tweets (username, tweet, geo) Values ($1,$2,st_setsrid(st_makepoint($3,$4),"+srid+"))",
				values:[tweet.user.screen_name, tweet.text, coordinates[1] , coordinates[0]  ]
        };
        
    return query;

}