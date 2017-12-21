
$(document).ready(function() {
  manageHeight();

  var query = querry();
  var product = Products[query.pdct];
  var urls = product.items[product.cvrItem].imageUrls;
  setMedia(urls)

  $(".content-text_wrap").children("h3").text(product.name)
  $(".content-text").text(product.description)

  // initMoves(urls);
})

function querry() {
  var hash = window.location.hash.substr(1)
  var search = window.location.search.substr(1).split("&");
  var query = {};

  for (var i = 0; i < search.length; i++) {
    var pairArr = search[i].split("=");
    console.log(pairArr);
    query[pairArr[0]] = pairArr[1];
  }
  console.log(query)

  query.hash = hash;
  return query;
}

function setMedia(urls) {
  // var boards = [$("#top"), $("#middle") /*, $("#bottom")*/];
  $("#top").children(".decorated").attr("src", urls[0]);

  /*
  if (urls.length == 1) {
  $("#top").children(".decorated").attr("src", urls[0]);
  } else if (urls.length == 2) {
   $("#top").children(".decorated").attr("src", urls[0]);
   $("#bottom").children(".decorated").attr("src", urls[1]);
  } else if (urls.length > 2) {
   for (var i = 0; i < 2; i++) {
     boards[i].children(".decorated").attr("src", urls[i]);
   }
  }
  */
}

function manageHeight() {
  if (window.innerWidth <= 600) {
    $("#home").css("height", $("#home").css("height"))
  } else {
    $("#home").css("height", "100vh")
  }
}

function initMoves(picts) {

  // initialize move:
  var move = new Move($("#img-large"), $("#arrow-up"), 'click');
  console.log("move: ", move)

  // initialize flip:
  var flip;

  if (picts.length > 1) {
    flip = new Flip(picts, {
      fwd: document.getElementById("fwd"),
      bwd: document.getElementById("bwd"),
      bottom: document.getElementById("bottom"),
      middle: document.getElementById("middle"),
      top: document.getElementById("top")
    });
  }

  FlipDomHandler(flip, move);
}
