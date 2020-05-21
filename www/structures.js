class Chart {
  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.plot_width = options.plot_width;
    this.plot_height = options.plot_height;
    this.maxX = options.maxX;
    this.minX = options.minX;
    this.maxY = options.maxY;
    this.minY = options.minY;
    this.x0 = [this.minX, this.maxX];
    this.x = d3.scaleLinear().domain(this.x0).range([0, this.plot_width]);
    this.y0 = [this.minY, this.maxY];
    this.y = d3.scaleLinear().domain(this.y0).range([this.plot_height, 0]);
  }
}

class Filter {
  constructor(options) {
    this.width = 200;
    this.height = 50;
  }
}
