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
  init: function(keyframes, dom) {
    this.dom = dom;

    // keyframes should be specified in ascending order, by scrollPos, so
    // the first item in array should be the first keyframe to perform animation on
    this.current = keyframes.shift();
    this.prev = [];
    this.next = [].concat(keyframes);

    this.initKeyframe();
    var self = this;
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      /*
      var prevScrollTo = self.prev[0].scrollPos.to;
      var nextScrollFrom = self.next[0].scrollPos.from;
      */
      var inRange = ( scroll >= self.current.scrollPos.from && scroll <= self.current.scrollPos.to );

      if ( inRange ) {
        self.do();
      } else if ( !inRange ) {

        // if scroll position is in range of the previous keyframe,
        // then pull the previous keyframe to the current slot
        if (self.prev.length != 0 && scroll <= self.prev[0].scrollPos.to) {
          self.current.initialized = false;
          self.next.unshift(self.current);
          self.current = self.prev.shift();
          if (!self.current.initialized) {
            self.initKeyframe.call(self);
          }

        // if scroll position is in range of the next keyframe,
        // then pull the next keyframe to the current slot
        } else if (self.next.length != 0 && scroll >= self.next[0].scrollPos.from) {
          self.current.initialized = false;
          self.prev.unshift(self.current);
          self.current = self.next.shift();
          if (!self.current.initialized) {
            self.initKeyframe.call(self);
          }
        }
      }
    })
  },
  locate: function() {

  },
  setScrollRate: function() {
    this.scrollRate = ( Math.abs(this.current.scrollPos.from - $(window).scrollTop()) ) / this.scrollKeyBit;
    return this.scrollRate;
  },
  initKeyframe: function() {
    // this.keyframe = keyframe.value;

    // 'to' should always be greater than 'from'
    this.scrollKeyframe = this.current.scrollPos.to - this.current.scrollPos.from;
    this.value = this.current.value.from;

    this.scrollKeyBit = this.scrollKeyframe / 100;
    this.setScrollRate();

    // what is the direction of movement
    this.asc = (this.current.value.from < this.current.value.to) ? true : false;
    this.current.initialized = true;
    /*
    var self = this;
      $(window).scroll(function() {
      self.do.call(self);
    })
    */
  },
  do: function() {
    this.setScrollRate();
    if (this.scrollRate < 101) {
      if (this.asc) {
        this.value = parseInt(this.current.value.to / 100 * this.scrollRate);
        if ((this.current.value.to - this.value) < 35) {
          this.value = this.current.value.to
        }
      } else if (!this.asc) {
        // ???
        this.value = parseInt(this.current.value.from - this.current.value.from / 100 * this.scrollRate);
        if ((this.value - this.current.value.to) < 35) {
          this.value = this.current.value.to
        }
      }

      if ( (this.value >= this.current.value.from && this.value <= this.current.value.to)
        || (this.value >= this.current.value.to && this.value <= this.current.value.from) ) {
          this.setStyle();
          if (this.current.callback) {
            this.current.callback(this.value, this.scrollRate);
          }
        }
    }
    // console.log('value: ', this.value, ', scrollRate: ', this.scrollRate, ', asc: ', this.asc)
  },
  setStyle: function() {
    var self = this;
    this.dom.el.each(function() {
      $(this).css({
        'stroke': 'rgba('+ self.value +', '+ self.value +', '+ self.value +', 0.7)'
      })
    })
  }
}

var Menu = {
  toggledOn: false,
  transitioning: false,
  init: function(menu) {
    this.$menu = menu;
    var self = this;
    this.$menu.on('click touchend', function() {
      self.toggle.call(self)
    })
  },
  toggle: function() {
    var spans = $('#menu span');
    var self = this;
    if (this.toggledOn) {
      this.transitioning = true;
      spans.each(function() {
        var $this = $(this);
        $this.addClass('transition');
        $this.on('transitionend', function() {
          $this.removeClass('transition');
          $this.off('transitionend')
          self.toggledOn = false;
          self.transitioning = false;
        })

        $this.css('opacity', 0);
      })
    } else if (!this.toggledOn) {
      var condition = ($(window).width() > 650) ? !($(window).scrollTop() < 5) : true
      if ( condition ) {
        this.transitioning = true;
        spans.each(function() {
          var $this = $(this);
          $this.addClass('transition');
          $this.on('transitionend', function() {
            $this.removeClass('transition');
            $this.off('transitionend')
            self.toggledOn = true;
            self.transitioning = false;
          })

          $this.css('opacity', 1);
        })
      }
    }
  },
  unsubscribe: function() {
    this.$menu.off('click touchend');
  },
  subscribe: function() {
    this.init(this.$menu);
  }
}

var LargeView = {
  init: function(dom, open, close, move) {
    this.move = move;

    this.dom = dom;
    this.open = open;
    this.close = close;

    var self = this;

    // this.dom.$photo.on('load', function() {
    //   console.log('initial bind')
    //   self.show.call(self)
    // });

    this.open.$els.on('click touchend', function() {
      var url = $(this).css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "");
      self.go.call(self, url);
    });
  },
  go: function(url) {
    console.log('gone', url)
    var self = this;

    var img = document.createElement('img');

    var setUrl = function($picture) {
      self.dom.$photo.on('load', function() {
        $(this).width($picture.width() + 'px')
        $(this).height($picture.height() + 'px')
        self.show.call(self);
      })
      self.dom.$photo.attr('src', $picture.attr('src'))
      self.hwaccelerate();
    }

    img.onload = function() {
      // {
      //   dom: this,
      //   width: this.width,
      //   height: this.height
      // }

      var $picture = self.fitPhoto.call(self, this);
      setUrl($picture)
      console.log($picture)
      // console.log(self.dom.$photo.replaceWith($picture))
      // self.dom.$photo = $('.large-view_box img');
      console.log(self.dom.$photo)
      // self.dom.$photo = $(this);
    }

    img.src = url;
    // $(img).attr('src', url);
    // this.dom.$photo.attr('src', url)
  },
  show: function(url) {

    this.dom.$box.removeClass('noned');
    this.move.resubscribe(this.dom.$photo);
    var self = this;
    this.dom.$box.on('transitionend', function() {
      self.dom.$box.off('transitionend');
      self.close.unsubscribe.call(self.close.$button);
      self.close.$button.on('click touchend', function() {
        self.hide.call(self);
      })
    });
    this.dom.$box.removeClass('transparent');
  },
  hide: function() {
    var self = this;
    this.dom.$box.on('transitionend', function() {
      self.dom.$box.off('transitionend');
      self.dom.$box.addClass('noned');
      self.close.$button.off('click');
      self.close.subscribe.call(self.close.$button);
      // self.cbs.onhide();
    });

    this.dom.$box.addClass('transparent');
  },
  fitPhoto: function(picture) {
    var $window = $(window)

    var theWindow = {
      width: $window.width(),
      height: $window.height()
    }

    // we define our ratio based on width:
    theWindow.ratio = theWindow.width / theWindow.height;

    // var thePicture = {
    //  width: this.dom.$photo.width(),
    //  height: this.dom.$photo.height()
    // }

    var pictureRatio = picture.width / picture.height;
    console.log(theWindow, picture)

    if (pictureRatio > theWindow.ratio) {
      // fit picture by width
      $(picture).width(theWindow.width + 'px')
      $(picture).height(theWindow.width / pictureRatio + 'px')
      return $(picture);
      // this.dom.$photo.width()
      // this.dom.$photo.height()
    } else if (pictureRatio < theWindow.ratio) {
      // fit picture by height

      $(picture).width(theWindow.height * pictureRatio + 'px')
      $(picture).height(theWindow.height + 'px')
      return $(picture);
      // this.dom.$photo.width()
      // this.dom.$photo.height()
    }

    // if ratio > 1 then the screen is landscape
    // if (screenRatio > 1) {
    //
    // } else if (screenRatio < 1) {
    //
    // }
  },
  hwaccelerate: function() {
    this.dom.$photo.css({
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
    })
  }
}

var plusminus = {
  v: $('#scale_triggerer .sign-path_v-svg'),
  scaledUp: false,
  subscribe: function() {
    var self = this;
    $('#scale_triggerer').on('click', function() {
      self.do.call(self)
    })
  },
  scaleUp: function() {
    var self = this;
    this.v.on('transitionend', function() {
      self.scaledUp = true;
      self.v.off('transitionend')
    })

    this.v.addClass("scale-v");
    console.log('scaleUp', this.v)
  },
  scaleDown: function() {
    var self = this;
    this.v.on('transitionend', function() {
      self.scaledUp = false;
      self.v.off('transitionend')
    })

    this.v.removeClass("scale-v");
    console.log('scaleDown', this)
  },
  do: function() {
    if (!this.scaledUp) {
      this.scaleUp();
    } else if (this.scaledUp) {
      this.scaleDown();
    }
  },
  reset: function() {
    this.scaledUp = false;
  }
}

function initIndex() {
  // Index.gridSetup();
  // Markup.log(JSON.stringify(Modernizr))
  Markup.turnOff();
  Index.modernize(true);
  Slider.init(2850, {adaptToMobile: true});
  var $el = $('.about');
  var keyfr1To = parseInt($el.offset().top, 10) - (parseInt($el.css('marginTop'), 10) + parseInt($el.css('paddingTop'), 10) );
  // console.log(keyfr1To)
  // keyframes should be specified in ascending order (by scroll position)
  var keyframes = [
    {
      scrollPos: {
        from: 0,
        to: keyfr1To
      },
      value: {from: 255, to: 0},
      callback: function(value, scrollRate) {
        $('#menu span').each(function() {
          $(this).css({
            'color': 'rgba('+ value +', '+ value +', '+ value +', 0.7)'
          })
        })
        if ($(window).width() > 650) {

          if (Menu.toggledOn) {
            if (scrollRate < 5) {
              console.log(scrollRate)
              Menu.toggledOn = false;
            }
            return;
          }

          if (!Menu.transitioning) {
            var alpha = (100 - scrollRate) / 100;

            if (alpha > 0.88) {
              alpha = 1;
            } else if (alpha < 0.12) {
              alpha = 0;
            }

            $('#menu span').each(function() {
              $(this).css({
                'opacity': alpha
              })
            })
          }
        }
        //if (scrollRate > 90 && Menu.visible)
        //  return
      }
    },
    {
      scrollPos: {
        from: $('.photos').offset().top,
        to: $('.photos').offset().top + 200
      },
      value: {from: 0, to: 255},
      callback: function(value, scrollRate) {
        $('#menu span').each(function() {
          $(this).css({
            'color': 'rgba('+ value +', '+ value +', '+ value +', 0.7)'
          })
        })
      }
    },
    {
      scrollPos: {
        from: $('.info').offset().top - 350,
        to: $('.info').offset().top
      },
      value: {from: 255, to: 0},
      callback: function(value, scrollRate) {
        $('#menu span').each(function() {
          $(this).css({
            'color': 'rgba('+ value +', '+ value +', '+ value +', 0.7)'
          })
        })
      }
    }
  ];
  ScrollKeyframe.init(keyframes, {
      el: $('#menu path'),
      prop: 'stroke'
  });
  Menu.init($('#menu svg'));

  var dom = {
    $box: $('.large-view_box'),
    $photo: $('.large-photo')
  };

  var open = {
    $els: $('.grid-item')
  };

  var close = {
    $button: Menu.$menu,
    subscribe: function() {
      Menu.subscribe();
    },
    unsubscribe: function() {
      plusminus.reset();
      Menu.unsubscribe();
    }
  }
  var triggerer = {
    $el: $('#scale_triggerer'),
    cb: function() {
      plusminus.do();
    }
  }

  var move = new Move(dom.$photo, triggerer, 'click touchend');

  LargeView.init(dom, open, close, move)
  // plusminus.subscribe();
}

$(document).ready(initIndex)
