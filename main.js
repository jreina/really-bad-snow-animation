const randBetween = (min, max) => Math.floor(Math.random() * max) + min;

function Snow(options) {
  let screenHeight = () => window.innerHeight;
  let screenWidth = () => window.innerWidth;

  const _options = Object.assign(
    {
      increment: 3,
      interval: 50,
      limit: 20
    },
    options
  );

  const _state = {
    flakes: [],
    intervalId: -1,
    derps: 0
  };

  /**
   * Creates a new div with the class set to "snowflake" and initializes
   * the top and left style attributes to the x and y properties specified by
   * the parameter object.
   * @param {Object} original 
   */
  const _getSnowflake = original => {
    const flake = document.createElement("div");
    let { x, y } = original;
    flake.setAttribute("class", "snowflake");
    flake.setAttribute("style", `left: ${x}px; top: ${y}px`);
    return { position: original, flake, original };
  };

  /**
   * Creates a new random flake (div.snowflake element) using the factory function, 
   * adds it to the body, and pushes it with some position data into an array on the state object.
   */
  const _getRandomFlake = () => {
    let x = randBetween(0, screenWidth());
    let y = randBetween(-10, -1 * screenHeight());
    let flake = _getSnowflake({ x, y });

    document.body.appendChild(flake.flake);
    // We'll keep the flakes in memory so can iterate over them
    // when we need to render the next 'frame'.
    // We also hang on to the origin values since the "waving" affect
    // will be a function of the current point and the original random values.
    _state.flakes.push(flake);
  };

  /** Returns a boolean indicating whether or not there are too many snowflakes. */
  const _tooManyFlakes = () => _state.flakes.length > _options.limit;

  /**
   * Calculates the new position of a given flake using the position data stored in the flake object.
   * @param {Object} currFlake 
   */
  const _getNewPosition = currFlake => {
    let { position, flake, original } = currFlake;
    let width = screenWidth();
    let height = screenHeight();

    let y =
      position.y + _options.increment + 10 > height
        ? original.y
        : position.y + _options.increment;

    let x = 30 * Math.sin(y / 20) + original.x;

    return Object.assign({}, currFlake, { position: { x, y } });
  };

  /**
   * Loops over the flakes stored in the flakes array on the state object, calculates
   * their new position, and applies the new positioning to the style attribute of the flake.
   */
  const _moveFlakes = () => {
    _state.flakes = _state.flakes.map(_getNewPosition);
    _state.flakes.forEach(flake => {
      let newStyle = `left: ${flake.position.x}px; top: ${flake.position.y}px`;
      flake.flake.setAttribute("style", newStyle);
    });
  };

  /**
   * Starts the animation loop, updating the position of each flake using the
   * interval specified in milliseconds.
   * @param {Number} interval 
   * @returns {Number} the ID of the window interval. This ID can be used as the parameter for clearInterval.
   */
  const _startAnimation = interval => {
    return setInterval(() => {
      if (!_tooManyFlakes()) _getRandomFlake();
      _moveFlakes();
    }, interval);
  };

  const _updateRefreshInterval = interval => {
    clearInterval(_state.intervalId);
    _state.intervalId = _startAnimation(interval);
  };
  const _codes = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };
  const _handleKey = ({ keyCode }) => {
    switch (keyCode) {
      case _codes.up:
        _options.interval = 0.9 * _options.interval;
        break;
      case _codes.down:
        _options.interval = 1.1 * _options.interval;
        break;
      case _codes.right:
        _options.limit = 1.1 * _options.limit;
        break;
      case _codes.left:
        _options.limit = 0.9 * _options.limit;
        break;
    }
    _updateRefreshInterval(_options.interval);
  };

  /**
   * Spicy derps.
   */
  const _derp = () => {
    ++_state.derps;
    if (_state.derps > 4) {
      _options.limit = 4096;
      _updateRefreshInterval(20);
      document.body.setAttribute("class", "derp-mode");
    }
  };

  /**
   * Initialize the snow animation.
   */
  const _init = () => {
    _state.intervalId = _startAnimation(_options.interval);
  };

  this.Init = _init;
  this.Derp = _derp;
  this.KeyDownHandler = _handleKey;
}
