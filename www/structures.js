class Pokemon {
  constructor(data) {
      this.id = data[0];
      this.english_name = data[1];
      this.type_1 = data[2];
      this.type_2 = data[3];
      this.total = data[4];
      this.hp = data[5];
      this.attack = data[6];
      this.defense = data[7];
      this.spec_att = data[8];
      this.spec_def = data[9];
      this.speed = data[10];
      this.generation = data[11];
      this.legendary = data[12];
  }
}

class Chart {
  constructor(options) {
    this.data = options.data;
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
