const randBetween = (min, max) => Math.floor(Math.random() * max) + min;

var app = (function() {
  const fallInterval = 3;
  let screenHeight = window.innerHeight;
  let screenWidth = window.innerWidth;
  const _flakes = [];
  const _getSnowflake = ({ x }) => {
    const newFlake = document.createElement("div");
    newFlake.setAttribute("class", "snowflake");
    newFlake.setAttribute("style", `left: ${x}px; top: -10px`);
    newFlake.setAttribute("data-original-x", x);
    document.body.appendChild(newFlake);
    _flakes.push({ x, y: -10, flake: newFlake, originalx: x });
  };

  const _getRandomFlake = () => {
    let x = randBetween(0, screenWidth);
    _getSnowflake({ x });
  };

  const _tooManyFlakes = respect => (respect ? _flakes.length > 150 : false);

  const _moveFlakes = () => {
    _flakes.forEach(currFlake => {
      let { x, y, flake, originalx } = currFlake;
      let modulatedY =
        y + fallInterval + 10 > screenHeight ? 0 : y + fallInterval;
      let modulatedx = 30 * Math.sin(modulatedY / 20) + originalx;
      modulatedx =
        modulatedx + 20 > screenWidth
          ? modulatedx - (modulatedx - screenWidth) - 20
          : modulatedx;
      let newStyle = `left: ${modulatedx}px; top: ${modulatedY}px`;
      flake.setAttribute("style", newStyle);

      currFlake.x = modulatedx;
      currFlake.y = modulatedY;
    });
  };
  return {
    getFlake: _getRandomFlake,
    animateFlakes: _moveFlakes,
    tooManyFlakes: _tooManyFlakes
  };
})();
