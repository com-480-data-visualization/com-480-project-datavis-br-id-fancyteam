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

class Filter {
  constructor(options) {
    this.width = filter_width;
    this.height = filter_height;
  }
}
