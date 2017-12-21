function FlipDomHandler(flip, move) {

  $(".decorated").on("click", function(ev) {
    // show()
    console.log(".decorated clicked")
    $("#img-large").attr("src", $(this).attr("src"))
  })

  $("#img-large").on("load", function() {
    handlePlusminus($("#arrow-up"));
    show(move)
  })
  $("#img-large").css({
    '-webkit-perspective': 1000,
    '-moz-perspective': 1000,
    '-ms-perspective': 1000,
    '-o-perspective': 1000,
    'perspective': 1000,

    '-webkit-backface-visibility': 'hidden',
    '-moz-backface-visibility': 'hidden',
    '-ms-backface-visibility': 'hidden',
    '-o-backface-visibility': 'hidden',
    'backface-visibility': 'hidden'
  });

}

function show(move, cb) {
  var el = $(".large-view")

  var dims = {
  width: document.getElementById("img-large").width, // $("#img-large").css("width"),
  height: document.getElementById("img-large").height // $("#img-large").css("height")
  }
  console.log("show", dims)

  $("#btn_wrap").on("click", function(ev) {
    ev.preventDefault();
    hide();
  })
  var arrowUp = $("#arrow-up");
  arrowUp.off("click");
  move.refreshTriggerer(arrowUp, function() {
      console.log("arroUp clicked")
      setTimeout(function() {
        $(".sign-path_v-svg").toggleClass("scale")
      }, 500)
  });

  el.removeClass("noned")
  move.resubscribe($("#img-large"));

  setTimeout(function() {
    el.removeClass("transparent")
  }, 10)
}

function handlePlusminus(arrowUp) {
  arrowUp.find(".arrow_rotating")
    .on("transitionend", function() {
      arrowUp.find(".sign-path-svg").removeClass("transparent");
      $(this).off("transitionend");
    })

  arrowUp.find(".arrow_rotating").addClass("transparent");
  console.log("handlePlsmins")

  $("#arrow-up").on("click", function() {
  })
}

function hide() {
  var el = $(".large-view");

  $("#arrow-up .sign-path-svg").addClass("transparent");
  setTimeout(function() {
    $("#arrow-up .arrow_rotating").off("transitionend");
    $("#arrow-up .arrow_rotating").removeClass("transparent");
    $(".sign-path_v-svg").removeClass("scale")
  }, 500)

  el.on("transitionend", function() {
    $(this)
      .addClass("noned")
    $("#btn_wrap").off("click")
    $("#arrow-up")
      .off("click")
      .on("click", ScrollForestScroll.doScroll);

    $(this).off("transitionend")
  })

  $(".large-view")
    .addClass("transparent")
  console.log("close")
}
