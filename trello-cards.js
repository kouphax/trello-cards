/*
 *  Print a https://www.trello.com view as index cards
 *  depends on jQuery and Underscore and the Trello ..
 *  released under the WTFPL licence
 *
 *  https://github.com/psd/pivotal-cards
 *  https://github.com/kouphax/trello-cards
 */
(function ($, global, undefined) {

  var options = {
    "filing-colours" : true,
    "rubber-stamp"   : true,
    "double-sided"   : true,
    "white-backs"    : true
  };

  var cardColours = {
    blue   : "rgb(0,0,255,0.3)",
    green  : "rgb(0,255,0,0.3)",
    orange : "rgb(255,165,0,0.3)",
    purple : "rgb(128,0,128,0.3)",
    red    : "rgb(255,0,0,0.3)",
    yellow : "rgb(255,255,0,0.3)"
  }

  var make_front = _.template(
    '<div class="card" id="front-<%= cardno %>" style="background-color:<%=cardColour%>">' +
    '  <div class="front side">' +
    '    <div class="header">' +
    '      <span class="labels">' +
    '<% _.each(labels, function(label) { %> <span class="label"><%= label %></span> <% }); %>' +
    '      <span>' +
    '    </div>' +
    '    <div class="middle">' +
    '      <div class="story-title"><%= name %></div>' +
    '    </div>' +
    '    <div class="footer">' +
    '      <span class="points points<%= points %>"><span><%= points %></span></span>' +
    '    </div>' +
    '  </div>' +
    '</div>');

  var make_back = _.template(
    '<div class="card" id="back-<%= cardno %>">' +
    '  <div class="back side">' +
    '    <div class="header">' +
    '      <span class="project"><%= project_name %></span>' +
    '      <span class="id"><%= id %></span>' +
    '    </div>' +
    '    <div class="middle">' +
    '      <div class="story-title"><%= name %></div>' +
    '      <div class="description"><%= description %></div>' +
    '      <table class="tasks">' +
    '<% _.each(tasks, function(task) { %><tr>' +
    '      <td class="check <%= task.complete ? "complete" : "incomplete" %>"><%= task.complete ? "☑" : "☐" %></td>' +
    '      <td class="task"><%= task.description %></td>' +
    '</tr><% }); %>' +
    '      </table>' +
    '    </div>' +
    '    <div class="footer">' +
    '      <% if (requester) { %><span class="requester"><%= requester %></span><% } %>' +
    '      <% if (owner) { %><span class="owner"><%= owner %></span><% } %>' +
    '    </div>' +
    '  </div>' +
    '</div>');

  var projectName = $("#board-header .board-name span.text").text();
  var fronts      = [];
  var backs       = [];
  var items       = [];
  
  if($(".window:visible").length > 0) {
    // a single card is open
    var path = global.location.pathname
    items = $("a[href='" + path + "']").parents('.list-card').first()
  } else if($("#board").hasClass("filtering")){
    // filtering is on
    items = $(".list-card.matched-card")
  } else {
    // do all the cards!
    items = $(".list-card")
  }
  
  //Hide the entire body and overlay it with our card container
  $('body > *').hide();
  var main = $('<div id="pivotal-cards-pages"></div>');
  _.each(options, function(value, option) {
    if (value) {
      main.addClass(option);
    }
  });
  $('body').append(main);

  // generate card for each found card
  items.each(function() {
    // get the card title anchor in the card to extract the id of the card
    var anchor     = $(this).find("a.list-card-title");
    var id         = anchor.attr("href").split("/").splice(-1,1);
    var classes    = $(this).attr("class")
    var labelizer  = /([a-zA-Z]+)-label/g;
    var labels     = [];
    var labelnames = []
    var match      = [];

    // build up the list of labels and their names
    while(match = labelizer.exec(classes)) {
      labels.push(match[1]);

      var labelname = global.boardView.model.get("labelNames")[match[1]];
      if(labelname) {
        labelnames.push(labelname)
      }
    } 

    // get the card model
    var card = global.boardView.model.getCard(parseInt(id,10))

    // get the name of the card from the model
    var name = card.get("name");

    // check the name for possible existence of "points" for people using the 
    // trello scrum plugin (https://chrome.google.com/webstore/detail/jdbcdblgjdpmfninkoogcfpnkjmndgje?utm_source=chrome-ntp-icon)
    // if the points exist we want ot strip them from the name and extract their value out
    var hasPoints = /^\((\d+)\)/.test(name)
    var points = "?"
    if(hasPoints){
      points = /^\((\d+)\)/.exec(name)[1]
      name = name.replace(/^\((\d+)\)/, "")
    }

    // get the card description
    var desc = card.get("desc")

    // get the tasks from the card.  This is determined as the first checklist on the card
    // all others will be ignored.
    var tasks = [];
    var checklistId = card.get("idChecklists")[0]

    if(checklistId !== undefined){
      var list = boardView.model.getChecklist(checklistId).get("checkItems");
      tasks = _.map(list, function(item){
        // determine if the card is complete by checking the state list
        var isComplete = card.checkItemStateList.any(function(state){
          return (state.get("idCheckItem") === item.id) && (state.get("state") === "complete")
        })

        return {
          complete: isComplete,
          description: item.name
        }
      })
    }

    var cardColour = cardColours[labels[0]] || "rgba(0,0,0,0)";

    // create our card object
    var item = {
      cardno       : id,
      id           : id,
      name         : name,
      cardColour   : cardColour,
      description  : desc,
      project_name : projectName,
      tasks        : tasks,
      points       : points,
      labels       : labelnames,
      requester    : null,   // TODO
      owner        : null    // TODO
    };

    // generate the front and the back of the cards
    fronts.push($(make_front(item)));
    backs.push($(make_back(item)));
  });

  /*
   *  layout cards
   */
  function double_sided() {
    var cardno;
    var front_page;
    var back_page;

    for (cardno = 0; cardno < fronts.length; cardno++) {
      if ((cardno % 4) === 0) {
        front_page = $('<div class="page fronts"></div>');
        main.append(front_page);

        back_page = $('<div class="page backs"></div>');
        main.append(back_page);
      }
      front_page.append(fronts[cardno]);
      back_page.append(backs[cardno]);
    }
  }

  function single_sided() {
    var cardno;
    var page;

    for (cardno = 0; cardno < fronts.length; cardno++) {
      if ((cardno % 2) === 0) {
        page = $('<div class="page"></div>');
        main.append(page);
      }
      page.append(fronts[cardno]);
      page.append(backs[cardno]);
    }
  }

  if (options['double-sided']) {
    double_sided();
  } else {
    single_sided();
  }

}(jQuery, this));
