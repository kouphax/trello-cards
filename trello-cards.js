/*
 *
 *  Print a https://www.pivotaltracker.com view as index cards
 *
 *  depends on jQuery and Underscore and the Pivotal code ..
 *
 *  released under the WTFPL licence
 *
 *  https://github.com/psd/pivotal-cards
 *
 */
(function ($, global, undefined) {

  var options = {
    "filing-colours": true,
    "rubber-stamp": true,
    "double-sided": true,
    "white-backs": true
  };

  var make_front = _.template(
    '<div class="card" id="front-<%= cardno %>">' +
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

  $('body > *').hide();
  var main = $('<div id="pivotal-cards-pages"></div>');
  _.each(options, function(value, option) {
    if (value) {
      main.addClass(option);
    }
  });
  $('body').append(main);

  var projectName = $("#board-header .board-name span.text").text();
  /*
   *  Find visible items
   */


  var fronts = [];
  var backs = [];

  // grab the visible cards (should be with ALL cards or "matched-cards" if filtering is on
  var items = []
  if($("#board").hasClass("filtering")){
    items = $(".list-card.matched-card")
  }else{
    items = $(".list-card")
  }


  items.each(function() {
    var anchor = $(this).find("a.list-card-title");

    var id = anchor.attr("href").split("/").splice(-1,1);
    var name = anchor.text();
    var hasPoints = /^\((\d+)\)/.test(name)
    var points = "?"

    if(hasPoints){
      points = /^\((\d+)\)/.exec(name)[1]
      name = name.replace(/^\((\d+)\)/, "")
    }

    var card = global.boardView.model.getCard(parseInt(id,0))
    var desc = card.get("desc")

    var tasks = [];
    var checklistId = card.get("idChecklists")[0]

    if(checklistId !== undefined){
      var list = boardView.model.getChecklist(checklistId).get("checkItems");
      tasks = _.map(list, function(item){
        var isComplete = card.checkItemStateList.any(function(state){
          return (state.get("idCheckItem") === item.id) && (state.get("state") === "complete")
        })
        return {
          complete: isComplete,
          description: item.name
        }
      })
    }

    var item = {
      cardno: id,
      id: id,
      name: name,
      description: desc,
      project_name: projectName,
      labels: [],
      tasks: tasks,
      requester: null,
      owner: null,
      points: points
    };

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
