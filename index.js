var Index = {
  windowWidth: $(window).width(),
  modernize: function(onresize) {
    // photo slides
    /*
    if (!Modernizr.cssvhunit) {
      Markup.log("no cssvhunit in Modernizr")
      $('.photoSlides').css('height', $(window).height());
    } else if (Modernizr.cssvhunit) {
      Markup.log("cssvhunit in Modernizr")
    }
    */
    $('.photoSlides').css('height', $(window).height());
    if (onresize) {
      var self = this;
      $(window).resize(function() {
        if (self.windowWidth !== $(window).width()) {
          $('.photoSlides').css('height', $(window).height());
          self.windowWidth = $(window).width();
        }
      })
    }
  }
}

var Slider = {
  slots: {
    a: $('.photo-top'),
    b: $('.photo-bottom')
  },
  stack: {
    top: $('.photo-top'),
    bottom: $('.photo-bottom')
  },
  slideUrls: [
    'photos/02-21_20140108170653_3959947_large.jpg',
    'photos/21_20131213163327_3929318_large.jpg',
    'photos/21_20131213163318_3929317_large.jpg',
    'photos/21_20131213163343_3929319_large.jpg',
    'photos/21_20101122202029_1047854_large.jpg'
  ],
  slideUrlsNarrow: [
    'photos/01-21_20101122172143_1047015_large.jpg',
    'photos/03-21_20101122171701_1046978_large.jpg',
    'photos/04-21_20101122172201_1047019_large.jpg',
    'photos/05-21_20101122172138_1047013_large.jpg',
    'photos/10-21_20101122171806_1046992_large.jpg'
  ],
  setUrls: function() {
    if (this.mobile) {
      this.urls = this.slideUrlsNarrow;
    } else if (!this.mobile) {
      this.urls = this.slideUrls;
    };
  },
  mobile: false,
  updDevice: function(width) {
    width = parseInt(width);
    if (width < 650) {
      if (!this.mobile) {
        this.mobile = true;
        this.setUrls();
        Markup.log(this.mobile.toString());
      }
    } else if (width > 650) {
      if (this.mobile) {
        this.mobile = false;
        this.setUrls();
        Markup.log(this.mobile.toString());
      }
    }
  },
  setupTimeout: function(fn) {
   this.timeoutFn = fn;
   this.timeoutId = window.setTimeout(this.timeoutFn, this.period);
  },
  // resetTimeout: function() {
  //   window.clearTimeout(this.timeoutId);
  //   this.timeoutId = window.setTimeout(this.timeoutFn, this.period);
  // },
  init: function(period, opts) {
    this.period = period;
    this.slots.a.addClass('ztop');
    this.slots.a.addClass('transition');


    var self = this;
    if (opts && opts.adaptToMobile) {
      if (parseInt($(window).width()) < 650) {
        this.mobile = true;
      };

      $(window).resize(function() {
        self.updDevice($(window).width());
      })
    }

    this.setUrls();
    this.urls.push(this.urls.shift());
    this.urls.push(this.urls.shift());

    this.setupTimeout(function() {
      self.slide();
    })
  },
  slide: function() {
    var self = this;
    this.doSlide(this.stack.top, this.stack.bottom, function(top, bottom, cb) {
     self.setupTimeout(function() {
         self.doSlide(top, bottom, cb)
     });
    })
  },
  doSlide: function(top, bottom, cb) {
    var self = this;
    top.addClass('transparent');
    top.on('transitionend', function() {
      // prepare the slot to be the bottom next time
      $(this).removeClass('transition');
      $(this).removeClass('ztop');

      // put the bottom slide on the top
      bottom.addClass('ztop');
      bottom.addClass('transition');

      // bottom is now at the top, so we can make the latest top slot rigid
      $(this).removeClass('transparent');
      $(this).off('transitionend');

      // var urls = (self.mobile) ? self.slideUrlsNarrow : self.slideUrls;
      var image = self.urls.shift();
      $(this).css('background-image', 'url('+ image +')');
      self.urls.push(image);
      cb(bottom, top, cb)
      // self.stack.top = bottom;
      // self.stack.bottom = top;
    })
  }

    /*

    */

}

var Markup = {
  off: false,
  markup: "",
  br: "</br>",
  el: $(".markuplog"),
  log: function(value) {
    if (typeof(value) !== "string") {
      return "shit!"
    }

    this.markup += value + this.br;
    console.log(value)
    this.el.html(this.markup)
  },
  turnOff: function() {
    if (!this.off) {
      this.el.css('display', 'none');
      this.off = true;
    }
  },
  turnOn: function() {
    if (this.off) {
      this.el.css('display', 'block');
      this.off = false;
    }
  }
}

var ScrollKeyframe = {
  init: function(keyframe, dom) {
    this.keyframe = keyframe.value;
    this.scrollKeyframe = keyframe.scrollPos;
    this.dom = dom;
    this.value = this.keyframe.from;

    this.scrollKeyBit = this.scrollKeyframe / 100;
    this.scrollRate = $(window).scrollTop() / this.scrollKeyBit;

    // what is the direction of movement
    this.asc = (this.keyframe.from < this.keyframe.to) ? true : false;
    var self = this;
    $(window).scroll(function() {
      // console.log('scrollKeyframe: scrolling')
      self.scrollRate = $(window).scrollTop() / self.scrollKeyBit;
      if (self.scrollRate < 101) {
        self.do.call(self);
      }
    })
  },
  do: function() {
    if (this.asc) {
      this.value = this.keyframe.to / 100 * this.scrollRate;
    } else if (!this.asc) {
      // ???
      this.value = this.keyframe.from - this.keyframe.from / 100 * this.scrollRate;
    }

    if ( (this.value >= this.keyframe.from && this.value <= this.keyframe.to)
      || (this.value >= this.keyframe.to && this.value <= this.keyframe.from) ) {
        this.setStyle();
      }
  },
  setStyle: function() {
    var self = this;
    this.dom.el.each(function() {
      console.log('scrollKeyfr', self.value)
      $(this).css({
        'stroke': 'rgba('+ self.value +', '+ self.value +', '+ self.value +', 0.7)'
      })
    })
  }
}

function initIndex() {
  // Index.gridSetup();
  // Markup.log(JSON.stringify(Modernizr))
  Markup.turnOff();
  Index.modernize(true);
  Slider.init(2850, {adaptToMobile: true});
  ScrollKeyframe.init(
    {
      scrollPos: $('.about h1').offset().top,
      value: {from: 255, to: 0}
    }, {
      el: $('#menu path'),
      prop: 'stroke'
  });
}

$(document).ready(initIndex)
