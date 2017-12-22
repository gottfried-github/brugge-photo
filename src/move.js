/*
=====================================================================
============================================================================
=========================================================================
============================================================================
=======================================================================
		V	I Like To Move It Move It	V
============================================================================
*/
//width: val.imageDims[0], height: val.imageDims[1]
function Move(el, triggerer, evttolisten) {

  this.element = el;
  this.listenerElement = this.element; // < the "false" case is for further modification
  this.triggerer = triggerer;
  this.triggererCb = function() {};

  this.pepMuted = false;
  this.movementMuted = false;

  this.subscribe = function() {
    var self = this;

    this.onUnaryScale = function(ev) {

      if (!self.movementMuted) {
        triggerer.off(evttolisten);
        self.unaryScale(ev)
      }
    };
    this.refreshTriggerer(this.triggerer);

    var count = 0;
    var fuckyou = 0;
    var evts = [];
    var log = '!'
    var togggle = true;
    this.tozzle = true;

  };

  this.refreshTriggerer = function(triggerer, cb) {
    var self = this;
    this.triggererCb = function() {
      if (cb) {
        cb();
      }
      self.onUnaryScale();
    };

    triggerer.on(evttolisten, this.triggererCb);
  }

  this.muteMovement = function() {
    if (!this.pepMuted) {
      $.pep.toggleAll(false);
      this.pepMuted = true;
    };
    if (!this.movementMuted) {
      this.movementMuted = true;
    }
  }

  this.resubscribe = function(el) {
    if (!this.pepMuted) {
      $.pep.toggleAll(false)
      this.pepMuted = true;
    }
    this.element = el;
    this.init();

    this.coordinates.originX = el.width() / 2;
    this.coordinates.originY = el.height() / 2;
    el.css("transform-origin", this.coordinates.originX+"px "+this.coordinates.originY+"px")
    this.scale = {
      x: 1,
      y: 1
    };
    this.setConstraints(this.coordinates);
    $.pep.peps[0].obj = this.element.get(0);
    $.pep.peps[0].$obj = this.element;
    $.pep.peps[0].initialPosition = $.pep.peps[0].$obj.position();
    if (this.pepMuted) {
      $.pep.toggleAll(true);
      this.pepMuted = false;
    }
    this.tozzle = false;
    this.movementMuted = false;
  }

  this.bindpep = function() {
    var self = this;
    // console.log(self.calculateConstraints(self.coordinates))
    //var elemt = el;
    //$('#board-img-top, #board-img-bottom'/*[this.top.image, this.bottom.image]*/).pep(
    this.element.pep({
      initiate: function() {},
      start: function(animID, that) {
        self.rAf = animID;
      },
      drag: function(that, evt, deltas) {
        self.coordinates.offset.x = self.coordinates.offset.x + deltas.dx;
        self.coordinates.offset.y = self.coordinates.offset.y + deltas.dy;
      },
      stop: function() {
      },
      shouldEase: false,
      place: false,
      hardwareAccelerate: false,
      constrainTo: self.calculateConstraints(self.coordinates)
    }, $(self.listenerElement));
    //$.pep.toggleAll(false);
  };

  this.unbindpep = function() {
    $.pep.unbind(this.element);
    // console.log('pep is unbind')
  }

  //================================================================
  //================================================================
  //================================================================

  this.init = function() {
    var temp = this.element.css('transform-origin').split(' ');

    var matrixStr = 'matrix(1, 0, 0, 1, 0, 0)'
    this.element.css({
      '-webkit-transform': matrixStr,
      '-moz-transform': matrixStr,
      '-ms-transform': matrixStr,
      '-o-transform': matrixStr,
      'transform': matrixStr
    })

    this.coordinates = {
      rects: this.element.get(0).getBoundingClientRect(),
      scaleX: 1,
      scaleY: 1,
      originX: parseInt(temp[0]),
      originY: parseInt(temp[1]),
      translateX: 0,
      translateY: 0,
      orig: this.element.get(0).getBoundingClientRect(),
      offset: {
        x: 0,
        y: 0
      }
    };
    // console.log(this.coordinates)

    this.easingData = {
      scale: {
        value: 10,
        target: 30
      },
      translateX: {},
      translateY: {}
    }

    this.pinchCenter = {};

    this.scale = {
      x: 1,
      y: 1
    }

  }

  var shit = '!'
  this.scaleStart = function(ev) {
    // console.log('scaleStart', this.coordinates)
    shit = shit.concat((1).toString())
    // $('#bwd').text(shit)
    $.pep.toggleAll(false);
    this.coordinates.rects = this.element.get(0).getBoundingClientRect();

    // this.pinchCenter = {
    //   x: ev.center.x,
    //   y: ev.center.y
    // }
    // var evPos = {
    //   left: ev.center.x - this.coordinates.rects.left,
    //   top: ev.center.y - this.coordinates.rects.top
    // }
    // var origin = {
    //   x: evPos.left / this.coordinates.scaleX, // /
    //   y: evPos.top / this.coordinates.scaleY
    // }

    // this.coordinates.originX = origin.x;
    // this.coordinates.originY = origin.y;

    var coords = this.calculation(this.coordinates);

    this.coordinates.translateX = coords.translateX + this.coordinates.offset.x;
    this.coordinates.translateY = coords.translateY + this.coordinates.offset.y;
    // this.setOrigin(this.coordinates.originX, this.coordinates.originY)
    this.setMatrix(coords)
    this.initialTranslate = {
      x: this.coordinates.translateX,
      y: this.coordinates.translateY
    }
  }

  this.scaleStop = function(tweakIt) {
    this.scale.x = this.coordinates.scaleX;
    this.scale.y = this.coordinates.scaleY;
    this.coordinates.rects = this.element.get(0).getBoundingClientRect();
    var temp = {
      x: this.coordinates.translateX,
      y: this.coordinates.translateY
    }
    if (tweakIt) {
      var self = this;
      // $('#fwd').text(this.coordinates.scaleX)
      this.coordinates = this.tweak(this.coordinates);
      if (this.coordinates.translateX != temp.x || this.coordinates.translateY != temp.y || (this.coordinates.translateX != temp.x && this.coordinates.translateY != temp.y)) {
        this.easing(
          [temp.x, temp.y],
          [self.coordinates.translateX, self.coordinates.translateY],
          {
            onEase: function(data) {
              self.coordinates.translateX = data[0];
              self.coordinates.translateY = data[1];
              self.setMatrix(self.coordinates)
            },
            onStop: function(data) {
              self.coordinates.translateX = data[0];
              self.coordinates.translateY = data[1];
              self.setMatrix(self.coordinates)
              self.afterStop();
            }
          }
        )
      } else {
        // console.log('scaleStop', this.coordinates)
        this.afterStop();
      }
    } else {
      // console.log('scaleStop', this.coordinates)
      this.afterStop();
    }
  }

    /*
    -webkit-
    -moz-
    -ms-
    -o-

    */
  this.afterStop = function() {
    this.setConstraints(this.coordinates);
    this.setMatrix(this.coordinates);
    this.setOrigin(this.coordinates.originX, this.coordinates.originY);
    this.setOffset();
    if (this.coordinates.scaleX > 1.5 || this.coordinates.scaleX < 0.7) {
      this.scaledUp = true;
    } else if (this.coordinates.scaleX < 1.5 && this.coordinates.scaleX > 0.7) {
      this.scaledUp = false;
    }
    triggerer.on(evttolisten, this.triggererCb);
    // console.log('afterStop', this.coordinates)
    $.pep.toggleAll(true);
  }

  this.unaryScale = function(ev) {
    var self = this;
    this.easingData.scale.value = this.coordinates.scaleX * 10;
    if (this.coordinates.scaleX > 1.5 || this.coordinates.scaleX < 0.7) {
      this.scaledUp = true;
      this.easingData.scale.target = 10;
    } else if (this.coordinates.scaleX < 1.5 && this.coordinates.scaleX > 0.7) {
      this.scaledUp = false;
      this.easingData.scale.target = 23;
    }
    this.scaleStart(ev);

    // figure out the dimensions for the element to obtain after scaling:
    var ratio = this.easingData.scale.target / this.easingData.scale.value;
    var data = {
      rects: {
        left: (this.coordinates.rects.left + this.coordinates.rects.width / 2) - ( this.coordinates.originX * (this.easingData.scale.target / 10) ),
        top: (this.coordinates.rects.top + this.coordinates.rects.height / 2) - ( this.coordinates.originY * (this.easingData.scale.target / 10) ),
        width: this.coordinates.rects.width * ratio,
        height: this.coordinates.rects.height * ratio
      },
      translateX: this.coordinates.translateX,
      translateY: this.coordinates.translateY
    }

    // if after scaling the element needs to be shifted (because of borders oveflow),
    // set the target values for easing taking that into account:
    var tweaked = this.tweak(data);

    // set point a, point b values and start easing
    var translValueX = this.coordinates.translateX;
    var translValueY = this.coordinates.translateY;
    var translTargetX = tweaked.translateX;
    var translTargetY = tweaked.translateY;

    var a = [this.easingData.scale.value, translValueX, translValueY];
    var b = [this.easingData.scale.target, translTargetX, translTargetY];
    var order = [10, 1, 1];


    this.easing(a, b, {
      onEase: function(data) {
        self.coordinates.scaleX = data[0];
        self.coordinates.scaleY = data[0];
        self.coordinates.translateX = data[1];
        self.coordinates.translateY = data[2];
        self.setMatrix(self.coordinates)
      },
      onStop: function(data) {
        self.coordinates.scaleX = data[0];
        self.coordinates.scaleY = data[0];
        self.coordinates.translateX = data[1];
        self.coordinates.translateY = data[2];
        self.setMatrix(self.coordinates)
        self.scaleStop(false)
      },
      order: order,
      control: [0.05, 2, 2]
    })
  }

  this.easing = function(a, b, options) {
    var self = this;
    options.rate = (options.rate) ? options.rate : 4;
    options.order = (options.order) ? options.order : [];
    options.control = (options.control) ? options.control : [];
    options.range = [];
    for (var i = 0; i < a.length; i++) {
      options.order[i] = (options.order[i]) ? options.order[i] : 1;
      options.control[i] = (options.control[i]) ? options.control[i] : 2;
      options.range[i] = Math.abs(b[i] - a[i]);
    }

    requestAnimationFrame(function() {
      self.ease(a, b, options, self)
    });
  }

  this.ease = function(a, b, options, self) {
    // an array for the data, calculated for one frame
    var step = [];

    // calculate the data for one frame
    for (var i = 0; i < a.length; i++) {
      a[i] += ( b[i] - a[i] ) / options.rate;
      step[i] = a[i] / options.order[i];
    }

    // call the callback for each frame
    if (options.onEase) {
      options.onEase(step);
    }

    // for flexibility sake the easing function can process
    // indefinite number of parameters.
    var condition = this.check(a, b, options)

    if (condition.condition) {
      var data = [];
      for (var y = 0; y < a.length; y++) {
        // if scaling up - then add conditions, if scaling down - substract:
        data.push( (a[y] < b[y]) ? a[y] / options.order[y] + condition.conditions[y] : a[y] / options.order[y] - condition.conditions[y] )
      }
      if (options.onStop) {
        return options.onStop(data);
      } else {
        return;
      }
    } else {
      requestAnimationFrame(function() {
        self.ease(a, b, options, self);
      });
    }
  }

  // a 'for' loop wrapper for a conditional test (so you could use
  // easing for different number of parameters). Checks for
  // each parameter if it has reached a treshold (the options.control variable),
  // after which the easing loop can be stopped.
  this.check = function(a, b, options) {
    var response = {};
    response.conditions = [];

    for (var i = 0; i < a.length; i++) {
      var temp = Math.abs(b[i] - a[i]) / options.order[i];
      if (temp < options.control[i]) {
        response.conditions.push(temp);
        response.condition = true;
      } else {
        response.condition = false;
        return response;
      }
    }

    return response;
  }

  /*
  =====================================================================
  ============================================================================
  =========================================================================
  ============================================================================
  =======================================================================
  			V	The Kit		V
  ============================================================================
  */

  this.calculation = function(coords) {
    //var realTransX = (300 * coordinates.scaleX) * (coordinates.originX / 300) - coordinates.originX;

    coords.translateX = ((coords.originX - 150) * coords.scaleX - (coords.originX - 150)); //  + coords.offset.x
    coords.translateY = ((coords.originY - 150) * coords.scaleY - (coords.originY - 150)); //  + coords.offset.y


    return coords;
  }

  this.setMatrix = function(coords) {
    var matrixStr = 'matrix(' +
    coords.scaleX + ', 0, 0, ' +
    coords.scaleY + ', ' +
    coords.translateX + ', ' +
    coords.translateY +
    ')'

    this.element.css({
      '-webkit-transform': matrixStr,
      '-moz-transform': matrixStr,
      '-ms-transform': matrixStr,
      '-o-transform': matrixStr,
      'transform': matrixStr
    })
  }

  this.setOrigin = function(x, y) {
    var originStr = x + 'px ' + y + 'px'
    this.element.css({
      '-webkit-transform-origin': originStr,
      '-moz-transform-origin': originStr,
      '-ms-transform-origin': originStr,
      '-o-transform-origin': originStr,
      'transform-origin': originStr
    })
  }

  this.setOffset = function() {
    var translateActual = this.element.css('transform').split('(')[1].split(')')[0].split(',');
    for (var i = 0; i < translateActual.length; i++) {
      translateActual[i] = parseFloat(translateActual[i]);
    }
    var translateCalculated = this.calculation( this.coordinates );
    this.coordinates.offset = {
      x: translateActual[4] - translateCalculated.translateX,
      y: translateActual[5] - translateCalculated.translateY
    }
  }

  this.tweak = function(coords) {
    var array = [
      {
        length: coords.rects.width,
        pos: coords.rects.left,
        translation: coords.translateX,
        parent: parseInt($(window).width())
      },
      {
        length: coords.rects.height,
        pos: coords.rects.top,
        translation: coords.translateY,
        parent: parseInt($(window).height())
      }
    ]

    for (var i = 0; i < array.length; i++) {
      var temp = process(array[i]);
      // console.log("tweakIt", temp)
      array[i].newPos = (typeof(temp) === 'number') ? temp : array[i].translation;
    }

    coords.translateX = array[0].newPos;
    coords.translateY = array[1].newPos;

    function process(axis) {

      if (axis.length <= axis.parent) {
        if (axis.pos > (axis.parent - axis.length)) {
          return ( axis.translation - (axis.pos - (axis.parent - axis.length)) );
        } else if (axis.pos < (0)) {
          return ( axis.translation + Math.abs(axis.pos) + 2 );
        }
        return false;
      } else if (axis.length > axis.parent) {
        if (axis.pos > (0)) {
          return ( axis.translation - axis.pos );
        } else if (axis.pos < (axis.parent - axis.length)) {
          return ( (axis.translation + ( Math.abs(axis.pos) - Math.abs(axis.parent - axis.length) )) );
        }
        return false;
      }
      return false;
    }

    return coords;
    //this.element.css( 'transform', 'matrix(' + coords.scaleX + ', 0, 0, ' + coords.scaleY +  ', ' + x.newPos + ', ' + y.newPos + ')' );

  }

  this.calculateConstraints = function(coords) {

    // console.log('calcConstrs', coords);
    var thisImageWidth = coords.rects.width,
      thisImageHeight = coords.rects.height,
      parentWidth = parseInt( $(window).width() ),
      parentHeight = parseInt( $(window).height() );

    var vertical = doIt(parentHeight, thisImageHeight)
    var horizontal = doIt(parentWidth, thisImageWidth)

    function doIt(parent, child) {
      var edges = {};
      if (child >= parent) {
        // console.log("child >= parent")

        // top, bottom || left, right
        edges.one = (parent - child);
        edges.two = 0;
      } else if (child < parent) {
        // console.log("child < parent")
        edges.one = 0;
        edges.two = (parent - child);
      }
      return edges;
    }

    /*
    console.log('constraints', [
    vertical.one,
    horizontal.two,
    vertical.two,
    horizontal.one
  ]);
    */

    // top, right, bottom, left
    return [
      vertical.one,
      horizontal.two,
      vertical.two,
      horizontal.one
    ];
  };

  this.setConstraints = function(coords) {
    //var self = this;
    // this.element.data('plugin_pep').options.constrainTo = this.calculateConstraints(coords);
    var constraints = this.calculateConstraints(coords);
    // console.log("setConstraints", constraints)
    $.pep.peps[0].options.constrainTo = constraints;
  };

  this.subscribe();
  this.init();
  this.bindpep();

}
