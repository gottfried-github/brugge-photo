var Index = {
  itemsWidths: [
    25.7,
    74.3,
    30,
    34.6,
    35.4,
    64.2,
    35.8,
    30.1,
    69.9,
    37,
    32.8,
    30.2,
    30.8,
    34.6,
    34.6,
    69.2,
    30.8,
    65.8,
    34.2
  ],
  gridSetup: function() {
    var margin = 2.5;
    var grid = document.querySelector(".grid")
    var gridItems = grid.querySelectorAll(".grid-item");

    for (var i = 0; i < gridItems.length; i++) {
      // var itemWidth = ( ParseInt($(grid).innerWidth()) / 100) * itemsWidths[i] - margin * 2;
      gridItems[i].style.width = itemsWidths[i] + "%";
    }
  },
  modernize: function() {
    // photo slides
    if (!Modernizr.cssvhunit) {
      $('.photoSlides').css('height', $(window).height());
    }
  }
}

function initIndex() {
  Index.gridSetup();
  Index.modernize();
}

$(document).load(initIndex)
