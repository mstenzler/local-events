const { MongoClient } = require('mongodb');
const { ObjectID }    = require('mongodb');
const dbConnection    = 'mongodb://localhost:27017/local_events';
const eventful_key    = process.env.EVENTFUL_KEY;

const eventful        = require('eventful-node');
const client          = new eventful.Client(eventful_key);
const request         = require('request');
var merge             = require('merge'), original, cloned;


const DEFAULT_PAGE_SIZE = 40;
const API_URL = 'http://api.evdb.com/json/events/search'

function categories() {
  return [
  {key:"music", desc: "Concerts & Tour Dates"},
  {key:"conference", desc:"Conferences &amp; Tradeshows"},
  {key:"comedy", desc:"Comedy"},
  {key:"learning_education", desc:"Education"},
  {key:"family_fun_kids", desc:"Kids &amp; Family"},
  {key:"festivals_parades", desc:"Festivals"},
  {key:"movies_film", desc:"Film"},
  {key:"food", desc:"Food &amp; Wine"},
  {key:"fundraisers", desc:"Fundraising &amp; Charity"},
  {key:"art", desc:"Art Galleries &amp; Exhibits"},
  {key:"support", desc:"Health &amp; Wellness"},
  {key:"holiday", desc:"Holiday"},
  {key:"books", desc:"Literary &amp; Books"},
  {key:"attractions", desc:"Museums &amp; Attractions"},
  {key:"community", desc:"Neighborhood"},
  {key:"business", desc:"Business &amp; Networking"},
  {key:"singles_social", desc:"Nightlife &amp; Singles"},
  {key:"schools_alumni", desc:"University &amp; Alumni"},
  {key:"clubs_associations", desc:"Organizations &amp; Meetups"},
  {key:"outdoors_recreation", desc:"Outdoors &amp; Recreation"},
  {key:"performing_arts", desc:"Performing Arts"},
  {key:"animals", desc:"Pets"},
  {key:"politics_activism", desc:"Politics &amp; Activism"},
  {key:"sales", desc:"Sales &amp; Retail"},
  {key:"science", desc:"Science"},
  {key:"religion_spirituality", desc:"Religion &amp; Spirituality"},
  {key:"sports", desc:"Sports"},
  {key:"technology", desc:"Technology"},
  {key:"other", desc:"Other"}
];
}

function searchEvent(req,res,next) {
  console.log('req.body = ', req.body);
  let queryParams = merge(req.body, req.query);
  let data;
  queryParams.app_key = eventful_key;
  if (!queryParams.page_size) {
    queryParams.page_size = DEFAULT_PAGE_SIZE;
  }
  //queryParams.image_sizes="block100,large,dropshadow250"
  console.log("queryParams = ", queryParams);
  request({
      url: API_URL, //URL to hit
      qs: queryParams, //Query string data
      method: 'GET', //Specify the method
      json: true
  }, function(error, response, data){
      if(error) {
        console.log(error);
      } else {
        console.log(response.statusCode, data);
        //data = JSON.parse(body);
        //numItems = data.total_items;
        console.log("data = ", data);
        if (data.events.event) {
          if (data.events.event.length) {
            //console.log("IS ARRAY!!!");
            res.events = data.events.event;
          }
          else {
            //console.log("++===== NOT ARRAY=====")
            res.events = [data.events.event]
          }
        }
        else {
          res.events = null;
        }
        next();
      }
  });
}

//db.collection.update(query, update, {upsert: true})

var params = {
  '$set': {
    county: 'Pierce',
    state: 'WA'
  },
  '$push': {
    zips: {
      '$each': ['98499',
      '98499']
    }
  }
}

function saveEvent(req, res, next) {
  MongoClient.connect(dbConnection, function(err, db) {
    //console.log("user id = ", req.session.user.id);

    if (!req.session.user) {
      throw "Trying to save event without a logged in user";
    }
    if (!req.body.eventful_id) {
      throw "No eventful_id passed in post params";
    }
    let userIdObject = new ObjectID(req.session.user['_id']);
    console.log("userIdObject = ", userIdObject);
    console.log('req.body = ', req.body);
    let eventInfo = {
      '$set': {
        eventfulId: req.body.eventful_id,
        title: req.body.title,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        startTime: req.body.start_time,
        endTime: req.body.end_time,
        venueName: req.body.venue_name,
        venueAddress: req.body.venue_address
      },
      "$addToSet": { "rsvps" : userIdObject } 
    }
    console.log("eventInfo = ", eventInfo);
   // db.collection('events').insertOne(userInfo, function(err, result) {
    db.collection('events').update({eventfulId: eventInfo.eventfulId}, eventInfo, 
      {upsert: true}, function(err, result) {
      if(err) throw err;
      console.log("result = ", result);
      res.result = result;
      next();
    });
  });

} 

function rsvp(req, res, next) {

  if (!req.session.user) {
    throw "Trying to save event without a logged in user";
  }
  if (!req.body.event_id) {
    throw "No event_id passed in post params";
  }
  let userIdObject = new ObjectID(req.session.user['_id']);
  let eventId      = new ObjectID(req.body.event_id);
  let rsvpType = req.body.rsvp_type || 'rsvp';
  let eventInfo;
  if (rsvpType === 'unrsvp') {
    eventInfo = {
      "$pull": { "rsvps" : userIdObject } 
    }
  }
  else {
    eventInfo = {
      "$addToSet": { "rsvps" : userIdObject } 
    }
  }
  //let mongoCommand = (rsvpType === 'unrsvp' ? '$pull' : '$addToSet');
  //console.log("userIdObject = ", userIdObject);
  //console.log('req.body = ', req.body);

  MongoClient.connect(dbConnection, function(err, db) {
    // let eventInfo = {
    //   `${mongoCommand}`: { "rsvps" : userIdObject } 
    // }
    console.log("eventInfo = ", eventInfo);
   // db.collection('events').insertOne(userInfo, function(err, result) {
    db.collection('events').update({_id: eventId}, eventInfo, 
      {upsert: true}, function(err, result) {
      if(err) throw err;
      console.log("result = ", result);
      res.result = result;
      next();
    });
  });

} 

function getEvents(req, res, next) {
  MongoClient.connect(dbConnection, function(err, db) {
    db.collection('events').find().toArray(function(err, result) {
      if(err) throw err;
      console.log("eventList = ", result);
      res.eventList = result;
      next();
    });
  });
} 

function getMyEvents(req, res, next) {
  if (!req.session.user) {
    res.myEvents = [];
    next();
  } else {
    let userIdObject = new ObjectID(req.session.user['_id']);

    MongoClient.connect(dbConnection, function(err, db) {
      db.collection('events').find({rsvps: userIdObject}).toArray(function(err, result) {
        if(err) throw err;
        //console.log("eventList = ", result);
        res.myEvents = result;
        next();
      });
    });
  }
} 


module.exports = { searchEvent, getEvents, saveEvent, rsvp, getMyEvents, categories }
