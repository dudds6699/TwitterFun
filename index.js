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


//myConnection
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
    var startQuery = "st_setsrid(st_makepoint(";
    
    //some times 3395 or 4326
    var endQuery = "),3395)";
    var coordinates = tweet.geo.coordinates;
    //converts the thing to sql nice stuff
/*
    return sql.insert()
            .into("tweets")
            .set("username", tweet.user.screen_name)
            .set("Tweet", tweet.text)
            .set("geo", startQuery + coordinates[0] + "," + coordinates[1] + endQuery,{
                dontQuote:true
            }).toParam();
  */          
            
    var query =
        {
				text : "INSERT INTO tweets (username, tweet, geo) Values ($1,$2,st_setsrid(st_makepoint($3,$4),3395))",
				values:[tweet.user.screen_name, tweet.text, coordinates[0] , coordinates[1]  ]
        };
        
    return query;

}