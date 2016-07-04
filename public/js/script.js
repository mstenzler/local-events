'use strict'
const DEBUG=true;

function debug() {

  if (DEBUG) {
    console.log(arguments);
  }
}

function showTemplate(args) {
  if (args === undefined) {
    throw "showTemplate requires an args hash parameter";
  }
  console.log("In Show Template!!!");

  var template = args.template;
  var displayTag = args.displayTag;
  var data = args.templateData || {};
  if (!template || !displayTag) {
    throw "showTemplate requires a parameter hash containing 'template' and 'displayTag'";
  }
  
  debug("In showTemplate: tempate = ", template);
  debug("displayTag = ", displayTag);
  var displayHtml = new EJS({url: template}).render(data);
  debug("New HTML = ", displayHtml);
  $(displayTag).html(displayHtml);
}

function rsvp(e) {
  e.preventDefault();
  let $button = $(e.target);
  debug("$button = ", $button);
  let eventfulId = $button.siblings("input[name='eventful_id']").val();
  debug("eventfulId = ", eventfulId);

  let title = $button.siblings("input[name='title']").val();
  let description = $button.siblings("input[name='description']").val();
  let latitude = $button.siblings("input[name='latitude']").val();
  let longitude = $button.siblings("input[name='longitude']").val();
  let start_time = $button.siblings("input[name='start_time']").val();
  let end_time = $button.siblings("input[name='end_time']").val();
  let venue_name = $button.siblings("input[name='venue_name']").val();
  let venue_address = $button.siblings("input[name='venue_address']").val();

  if (!eventfulId) {
    alert("No eventful id for this event!");
    return;
  }

  let data = {
    eventful_id: eventfulId,
    title: title,
    description: description,
    latitude: latitude,
    longitude: longitude,
    start_time: start_time,
    end_time: end_time,
    venue_name: venue_name,
    venue_address: venue_address
  } 

  console.log('rsvp dat = ', data);

  $.ajax({
    url: "/event/api/rsvp",
    data: data,
    type: "POST",
    dataType : "json",
  })
  .done(function( json ) {
    console.log("POST SUCCESS! json = ", json);
    
  })
  // Code to run if the request fails; the raw request and
  // status codes are passed to the function
  .fail(function( xhr, status, errorThrown ) {
    alert( "Sorry, there was a problem!" );
    console.log( "Error: ",  errorThrown );
    console.log( "Status: ",  status );
    console.dir( xhr );
  }); 

}


function updateRsvp(e) {
  e.preventDefault();
  let $button = $(e.target);
  debug("$button = ", $button);
  let eventId = $button.siblings("input[name='event_id']").val();
  debug("eventId = ", eventId);
  let $rsvpTypeInput = $button.siblings("input[name='rsvp_type']");
  let rsvpType = $rsvpTypeInput.val();

  if (!eventId) {
    alert("No eventful id for this event!");
    return;
  }

  let data = {
    event_id: eventId,
    rsvp_type: rsvpType
  } 

  console.log('rsvp dat = ', data);

  $.ajax({
    url: "/event/api/updatersvp",
    data: data,
    type: "POST",
    dataType : "json",
  })
  .done(function( json ) {
    console.log("POST SUCCESS! json = ", json);
    if (rsvpType === 'unrsvp') {
      $button.text('RSVP');
      $rsvpTypeInput.val('rsvp');
    } else {
      $button.text('UNRSVP');
      $rsvpTypeInput.val('unrsvp');
    }
  })
  // Code to run if the request fails; the raw request and
  // status codes are passed to the function
  .fail(function( xhr, status, errorThrown ) {
    alert( "Sorry, there was a problem!" );
    console.log( "Error: ",  errorThrown );
    console.log( "Status: ",  status );
    console.dir( xhr );
  }); 

}

function getSearchResults(e) {
  e.preventDefault();
  var category = $('#category-selector').val();
  var location = $('#location-input').val();
  console.log(`In getSearchResults, category = ${category}, location = ${location}`);
  $.ajax({
    url: "/event/json/search",
    data: {
        category: category,
        location: location
    },
    type: "POST",
    dataType : "json",
  })
  .done(function( json ) {
    console.log("POST SUCCESS! About to show template");
     showTemplate( {
      template: '/templates/event_list.ejs',
      displayTag: '#search-results',
      templateData: { events: json }
     })
  })
  // Code to run if the request fails; the raw request and
  // status codes are passed to the function
  .fail(function( xhr, status, errorThrown ) {
    alert( "Sorry, there was a problem!" );
    console.log( "Error: ",  errorThrown );
    console.log( "Status: ",  status );
    console.dir( xhr );
  })
  // Code to run regardless of success or failure;
  // .always(function( xhr, status ) {
  //   alert( "The request is complete!" );
  // });

} 

$(document).ready(function() {
  console.log('loaded');

  // $('.testButton').on('click', function(e) {
  //   var args = {
  //     templateData: { name: 'FOOBAR!!!!' },
  //     template: "/templates/event_list.ejs",
  //     displayTag: '#testDiv'
  //   }
  //   showTemplate(args);
  // })

  $('#search-button').on('click', getSearchResults);

  $('#search-results').on('click', rsvp);

  $('#popular-events').on('click', updateRsvp);

});