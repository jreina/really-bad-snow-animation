const randBetween = (min, max) => Math.floor(Math.random() * max) + min;

function Snow(options) {
  let screenHeight = () => window.innerHeight;
  let screenWidth = () => window.innerWidth;

  const _options = Object.assign(
    {
      increment: 3,
      interval: 50,
      limit: 150
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

  const _getRandomFlake = () => {
    let x = randBetween(0, screenWidth());
    let y = randBetween(0, 6);
    let flake = _getSnowflake({ x, y });

    document.body.appendChild(flake.flake);
    // We'll keep the flakes in memory so can iterate over them
    // when we need to render the next 'frame'.
    // We also hang on to the origin values since the "waving" affect
    // will be a function of the current point and the original random values.
    _state.flakes.push(flake);
  };

  const _tooManyFlakes = () => _state.flakes.length > _options.limit;

  const _getNewPosition = currFlake => {
    let { position, flake, original } = currFlake;
    let width = screenWidth();
    let height = screenHeight();

    let y =
      position.y + _options.increment + 10 > height
        ? original.y
        : position.y + _options.increment;

    let x = 30 * Math.sin(y / 20) + original.x;

    return Object.assign(currFlake, { position: { x, y } });
  };
  const _moveFlakes = () => {
    _state.flakes.forEach(currFlake => {
      let flake = _getNewPosition(currFlake);
      let newStyle = `left: ${flake.position.x}px; top: ${flake.position.y}px`;
      flake.flake.setAttribute("style", newStyle);
    });
  };
  const _startAnimation = interval => {
    return setInterval(() => {
      if (randBetween(1, 10) % 2 === 0 && !_tooManyFlakes()) _getRandomFlake();
      _moveFlakes();
    }, interval);
  };

  const _derp = () => {
    ++_state.derps;
    if (_state.derps > 4) {
      clearInterval(_state.intervalId);
      _options.limit = 4096;
      _state.intervalId = _startAnimation(20);
      return true;
    } else {
      return false;
    }
  };

  const _init = () => {
    _state.intervalId = _startAnimation(_options.interval);
  };

  this.Init = _init;
  this.Derp = _derp;
}
