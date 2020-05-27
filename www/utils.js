// We are getting informations from here
const data_url = 'https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-datavis-br-id-fancyteam/master/www/data/pokemon001-721.csv'
// Basic parameters for the chart
const plot_height = window.innerHeight * 0.65;
const plot_width = window.innerWidth * 0.70;
const plot_margin = {
  top: 50,
  right: 40,
  bottom: 40,
  left: 100
};

const filter_height = window.innerHeight * 0.65;
const filter_width = window.innerWidth * 0.20;

// Map each color to a particular type
// Source: https://bulbapedia.bulbagarden.net/wiki/Category:Type_color_templates
const typeToColor = new Map([
  ["Bug", d3.rgb(168, 184, 32)],
  ["Dark", d3.rgb(112, 88, 72)],
  ["Dragon", d3.rgb(112, 56, 248)],
  ["Electric", d3.rgb(248, 208, 48)],
  ["Fairy", d3.rgb(238, 153, 172)],
  ["Fighting", d3.rgb(192, 48, 40)],
  ["Fire", d3.rgb(240, 128, 48)],
  ["Flying", d3.rgb(168, 144, 240)],
  ["Ghost", d3.rgb(112, 88, 152)],
  ["Grass", d3.rgb(120, 200, 80)],
  ["Ground", d3.rgb(224, 192, 104)],
  ["Ice", d3.rgb(152, 216, 216)],
  ["Normal", d3.rgb(168, 168, 120)],
  ["Poison", d3.rgb(160, 64, 160)],
  ["Psychic", d3.rgb(248, 88, 136)],
  ["Rock", d3.rgb(184, 160, 56)],
  ["Steel", d3.rgb(184, 184, 208)],
  ["Water", d3.rgb(104, 144, 240)],
  ["???", d3.rgb(104, 160, 144)]
]);


const evolutions = [{
    "source": 1,
    "target": 2
  },
  {
    "source": 2,
    "target": 3
  },
  {
    "source": 4,
    "target": 5
  },
  {
    "source": 5,
    "target": 6
  },
  {
    "source": 7,
    "target": 8
  },
  {
    "source": 8,
    "target": 9
  },
  {
    "source": 10,
    "target": 11
  },
  {
    "source": 11,
    "target": 12
  },
  {
    "source": 13,
    "target": 14
  },
  {
    "source": 14,
    "target": 15
  },
  {
    "source": 16,
    "target": 17
  },
  {
    "source": 17,
    "target": 18
  },
  {
    "source": 19,
    "target": 20
  },
  {
    "source": 21,
    "target": 22
  },
  {
    "source": 23,
    "target": 24
  },
  {
    "source": 25,
    "target": 26
  },
  {
    "source": 27,
    "target": 28
  },
  {
    "source": 29,
    "target": 30
  },
  {
    "source": 30,
    "target": 31
  },
  {
    "source": 32,
    "target": 33
  },
  {
    "source": 33,
    "target": 34
  },
  {
    "source": 35,
    "target": 36
  },
  {
    "source": 37,
    "target": 38
  },
  {
    "source": 39,
    "target": 40
  },
  {
    "source": 41,
    "target": 42
  },
  {
    "source": 42,
    "target": 169
  },
  {
    "source": 43,
    "target": 44
  },
  {
    "source": 44,
    "target": 45
  },
  {
    "source": 44,
    "target": 182
  },
  {
    "source": 46,
    "target": 47
  },
  {
    "source": 48,
    "target": 49
  },
  {
    "source": 50,
    "target": 51
  },
  {
    "source": 52,
    "target": 53
  },
  {
    "source": 54,
    "target": 55
  },
  {
    "source": 56,
    "target": 57
  },
  {
    "source": 58,
    "target": 59
  },
  {
    "source": 60,
    "target": 61
  },
  {
    "source": 61,
    "target": 62
  },
  {
    "source": 61,
    "target": 186
  },
  {
    "source": 63,
    "target": 64
  },
  {
    "source": 64,
    "target": 65
  },
  {
    "source": 66,
    "target": 67
  },
  {
    "source": 67,
    "target": 68
  },
  {
    "source": 69,
    "target": 70
  },
  {
    "source": 70,
    "target": 71
  },
  {
    "source": 72,
    "target": 73
  },
  {
    "source": 74,
    "target": 75
  },
  {
    "source": 75,
    "target": 76
  },
  {
    "source": 77,
    "target": 78
  },
  {
    "source": 79,
    "target": 199
  },
  {
    "source": 79,
    "target": 80
  },
  {
    "source": 81,
    "target": 82
  },
  {
    "source": 82,
    "target": 462
  },
  {
    "source": 84,
    "target": 85
  },
  {
    "source": 86,
    "target": 87
  },
  {
    "source": 88,
    "target": 89
  },
  {
    "source": 90,
    "target": 91
  },
  {
    "source": 92,
    "target": 93
  },
  {
    "source": 93,
    "target": 94
  },
  {
    "source": 95,
    "target": 208
  },
  {
    "source": 96,
    "target": 97
  },
  {
    "source": 98,
    "target": 99
  },
  {
    "source": 100,
    "target": 101
  },
  {
    "source": 102,
    "target": 103
  },
  {
    "source": 104,
    "target": 105
  },
  {
    "source": 108,
    "target": 463
  },
  {
    "source": 109,
    "target": 110
  },
  {
    "source": 111,
    "target": 112
  },
  {
    "source": 112,
    "target": 464
  },
  {
    "source": 113,
    "target": 242
  },
  {
    "source": 114,
    "target": 465
  },
  {
    "source": 116,
    "target": 117
  },
  {
    "source": 117,
    "target": 230
  },
  {
    "source": 118,
    "target": 119
  },
  {
    "source": 120,
    "target": 121
  },
  {
    "source": 123,
    "target": 212
  },
  {
    "source": 125,
    "target": 466
  },
  {
    "source": 126,
    "target": 467
  },
  {
    "source": 129,
    "target": 130
  },
  {
    "source": 133,
    "target": 471
  },
  {
    "source": 133,
    "target": 700
  },
  {
    "source": 133,
    "target": 134
  },
  {
    "source": 133,
    "target": 196
  },
  {
    "source": 133,
    "target": 136
  },
  {
    "source": 133,
    "target": 470
  },
  {
    "source": 133,
    "target": 135
  },
  {
    "source": 133,
    "target": 197
  },
  {
    "source": 137,
    "target": 233
  },
  {
    "source": 138,
    "target": 139
  },
  {
    "source": 140,
    "target": 141
  },
  {
    "source": 147,
    "target": 148
  },
  {
    "source": 148,
    "target": 149
  },
  {
    "source": 152,
    "target": 153
  },
  {
    "source": 153,
    "target": 154
  },
  {
    "source": 155,
    "target": 156
  },
  {
    "source": 156,
    "target": 157
  },
  {
    "source": 158,
    "target": 159
  },
  {
    "source": 159,
    "target": 160
  },
  {
    "source": 161,
    "target": 162
  },
  {
    "source": 163,
    "target": 164
  },
  {
    "source": 165,
    "target": 166
  },
  {
    "source": 167,
    "target": 168
  },
  {
    "source": 170,
    "target": 171
  },
  {
    "source": 172,
    "target": 25
  },
  {
    "source": 173,
    "target": 35
  },
  {
    "source": 174,
    "target": 39
  },
  {
    "source": 175,
    "target": 176
  },
  {
    "source": 176,
    "target": 468
  },
  {
    "source": 177,
    "target": 178
  },
  {
    "source": 179,
    "target": 180
  },
  {
    "source": 180,
    "target": 181
  },
  {
    "source": 183,
    "target": 184
  },
  {
    "source": 187,
    "target": 188
  },
  {
    "source": 188,
    "target": 189
  },
  {
    "source": 190,
    "target": 424
  },
  {
    "source": 191,
    "target": 192
  },
  {
    "source": 193,
    "target": 469
  },
  {
    "source": 194,
    "target": 195
  },
  {
    "source": 198,
    "target": 430
  },
  {
    "source": 200,
    "target": 429
  },
  {
    "source": 204,
    "target": 205
  },
  {
    "source": 207,
    "target": 472
  },
  {
    "source": 209,
    "target": 210
  },
  {
    "source": 215,
    "target": 461
  },
  {
    "source": 216,
    "target": 217
  },
  {
    "source": 218,
    "target": 219
  },
  {
    "source": 220,
    "target": 221
  },
  {
    "source": 221,
    "target": 473
  },
  {
    "source": 223,
    "target": 224
  },
  {
    "source": 228,
    "target": 229
  },
  {
    "source": 231,
    "target": 232
  },
  {
    "source": 233,
    "target": 474
  },
  {
    "source": 236,
    "target": 106
  },
  {
    "source": 236,
    "target": 237
  },
  {
    "source": 236,
    "target": 107
  },
  {
    "source": 238,
    "target": 124
  },
  {
    "source": 239,
    "target": 125
  },
  {
    "source": 240,
    "target": 126
  },
  {
    "source": 246,
    "target": 247
  },
  {
    "source": 247,
    "target": 248
  },
  {
    "source": 252,
    "target": 253
  },
  {
    "source": 253,
    "target": 254
  },
  {
    "source": 255,
    "target": 256
  },
  {
    "source": 256,
    "target": 257
  },
  {
    "source": 258,
    "target": 259
  },
  {
    "source": 259,
    "target": 260
  },
  {
    "source": 261,
    "target": 262
  },
  {
    "source": 263,
    "target": 264
  },
  {
    "source": 265,
    "target": 267
  },
  {
    "source": 265,
    "target": 268
  },
  {
    "source": 265,
    "target": 269
  },
  {
    "source": 265,
    "target": 266
  },
  {
    "source": 266,
    "target": 267
  },
  {
    "source": 268,
    "target": 269
  },
  {
    "source": 270,
    "target": 271
  },
  {
    "source": 271,
    "target": 272
  },
  {
    "source": 273,
    "target": 274
  },
  {
    "source": 274,
    "target": 275
  },
  {
    "source": 276,
    "target": 277
  },
  {
    "source": 278,
    "target": 279
  },
  {
    "source": 280,
    "target": 281
  },
  {
    "source": 281,
    "target": 282
  },
  {
    "source": 281,
    "target": 475
  },
  {
    "source": 283,
    "target": 284
  },
  {
    "source": 285,
    "target": 286
  },
  {
    "source": 287,
    "target": 288
  },
  {
    "source": 288,
    "target": 289
  },
  {
    "source": 290,
    "target": 291
  },
  {
    "source": 290,
    "target": 292
  },
  {
    "source": 291,
    "target": 292
  },
  {
    "source": 293,
    "target": 294
  },
  {
    "source": 294,
    "target": 295
  },
  {
    "source": 296,
    "target": 297
  },
  {
    "source": 298,
    "target": 183
  },
  {
    "source": 299,
    "target": 476
  },
  {
    "source": 300,
    "target": 301
  },
  {
    "source": 304,
    "target": 305
  },
  {
    "source": 305,
    "target": 306
  },
  {
    "source": 307,
    "target": 308
  },
  {
    "source": 309,
    "target": 310
  },
  {
    "source": 315,
    "target": 407
  },
  {
    "source": 316,
    "target": 317
  },
  {
    "source": 318,
    "target": 319
  },
  {
    "source": 320,
    "target": 321
  },
  {
    "source": 322,
    "target": 323
  },
  {
    "source": 325,
    "target": 326
  },
  {
    "source": 328,
    "target": 329
  },
  {
    "source": 329,
    "target": 330
  },
  {
    "source": 331,
    "target": 332
  },
  {
    "source": 333,
    "target": 334
  },
  {
    "source": 339,
    "target": 340
  },
  {
    "source": 341,
    "target": 342
  },
  {
    "source": 343,
    "target": 344
  },
  {
    "source": 345,
    "target": 346
  },
  {
    "source": 347,
    "target": 348
  },
  {
    "source": 349,
    "target": 350
  },
  {
    "source": 353,
    "target": 354
  },
  {
    "source": 355,
    "target": 356
  },
  {
    "source": 356,
    "target": 477
  },
  {
    "source": 360,
    "target": 202
  },
  {
    "source": 361,
    "target": 362
  },
  {
    "source": 361,
    "target": 478
  },
  {
    "source": 363,
    "target": 364
  },
  {
    "source": 364,
    "target": 365
  },
  {
    "source": 366,
    "target": 368
  },
  {
    "source": 366,
    "target": 367
  },
  {
    "source": 371,
    "target": 372
  },
  {
    "source": 372,
    "target": 373
  },
  {
    "source": 374,
    "target": 375
  },
  {
    "source": 375,
    "target": 376
  },
  {
    "source": 387,
    "target": 388
  },
  {
    "source": 388,
    "target": 389
  },
  {
    "source": 390,
    "target": 391
  },
  {
    "source": 391,
    "target": 392
  },
  {
    "source": 393,
    "target": 394
  },
  {
    "source": 394,
    "target": 395
  },
  {
    "source": 396,
    "target": 397
  },
  {
    "source": 397,
    "target": 398
  },
  {
    "source": 399,
    "target": 400
  },
  {
    "source": 401,
    "target": 402
  },
  {
    "source": 403,
    "target": 404
  },
  {
    "source": 404,
    "target": 405
  },
  {
    "source": 406,
    "target": 315
  },
  {
    "source": 408,
    "target": 409
  },
  {
    "source": 410,
    "target": 411
  },
  {
    "source": 412,
    "target": 414
  },
  {
    "source": 412,
    "target": 413
  },
  {
    "source": 415,
    "target": 416
  },
  {
    "source": 418,
    "target": 419
  },
  {
    "source": 420,
    "target": 421
  },
  {
    "source": 422,
    "target": 423
  },
  {
    "source": 425,
    "target": 426
  },
  {
    "source": 427,
    "target": 428
  },
  {
    "source": 431,
    "target": 432
  },
  {
    "source": 433,
    "target": 358
  },
  {
    "source": 434,
    "target": 435
  },
  {
    "source": 436,
    "target": 437
  },
  {
    "source": 438,
    "target": 185
  },
  {
    "source": 439,
    "target": 122
  },
  {
    "source": 440,
    "target": 113
  },
  {
    "source": 443,
    "target": 444
  },
  {
    "source": 444,
    "target": 445
  },
  {
    "source": 446,
    "target": 143
  },
  {
    "source": 447,
    "target": 448
  },
  {
    "source": 449,
    "target": 450
  },
  {
    "source": 451,
    "target": 452
  },
  {
    "source": 453,
    "target": 454
  },
  {
    "source": 456,
    "target": 457
  },
  {
    "source": 458,
    "target": 226
  },
  {
    "source": 459,
    "target": 460
  },
  {
    "source": 495,
    "target": 496
  },
  {
    "source": 496,
    "target": 497
  },
  {
    "source": 498,
    "target": 499
  },
  {
    "source": 499,
    "target": 500
  },
  {
    "source": 501,
    "target": 502
  },
  {
    "source": 502,
    "target": 503
  },
  {
    "source": 504,
    "target": 505
  },
  {
    "source": 506,
    "target": 507
  },
  {
    "source": 507,
    "target": 508
  },
  {
    "source": 509,
    "target": 510
  },
  {
    "source": 511,
    "target": 512
  },
  {
    "source": 513,
    "target": 514
  },
  {
    "source": 515,
    "target": 516
  },
  {
    "source": 517,
    "target": 518
  },
  {
    "source": 519,
    "target": 520
  },
  {
    "source": 520,
    "target": 521
  },
  {
    "source": 522,
    "target": 523
  },
  {
    "source": 524,
    "target": 525
  },
  {
    "source": 525,
    "target": 526
  },
  {
    "source": 527,
    "target": 528
  },
  {
    "source": 529,
    "target": 530
  },
  {
    "source": 532,
    "target": 533
  },
  {
    "source": 533,
    "target": 534
  },
  {
    "source": 535,
    "target": 536
  },
  {
    "source": 536,
    "target": 537
  },
  {
    "source": 540,
    "target": 541
  },
  {
    "source": 541,
    "target": 542
  },
  {
    "source": 543,
    "target": 544
  },
  {
    "source": 544,
    "target": 545
  },
  {
    "source": 546,
    "target": 547
  },
  {
    "source": 548,
    "target": 549
  },
  {
    "source": 551,
    "target": 552
  },
  {
    "source": 552,
    "target": 553
  },
  {
    "source": 554,
    "target": 555
  },
  {
    "source": 557,
    "target": 558
  },
  {
    "source": 559,
    "target": 560
  },
  {
    "source": 562,
    "target": 563
  },
  {
    "source": 564,
    "target": 565
  },
  {
    "source": 566,
    "target": 567
  },
  {
    "source": 568,
    "target": 569
  },
  {
    "source": 570,
    "target": 571
  },
  {
    "source": 572,
    "target": 573
  },
  {
    "source": 574,
    "target": 575
  },
  {
    "source": 575,
    "target": 576
  },
  {
    "source": 577,
    "target": 578
  },
  {
    "source": 578,
    "target": 579
  },
  {
    "source": 580,
    "target": 581
  },
  {
    "source": 582,
    "target": 583
  },
  {
    "source": 583,
    "target": 584
  },
  {
    "source": 585,
    "target": 586
  },
  {
    "source": 588,
    "target": 589
  },
  {
    "source": 590,
    "target": 591
  },
  {
    "source": 592,
    "target": 593
  },
  {
    "source": 595,
    "target": 596
  },
  {
    "source": 597,
    "target": 598
  },
  {
    "source": 599,
    "target": 600
  },
  {
    "source": 600,
    "target": 601
  },
  {
    "source": 602,
    "target": 603
  },
  {
    "source": 603,
    "target": 604
  },
  {
    "source": 605,
    "target": 606
  },
  {
    "source": 607,
    "target": 608
  },
  {
    "source": 608,
    "target": 609
  },
  {
    "source": 610,
    "target": 611
  },
  {
    "source": 611,
    "target": 612
  },
  {
    "source": 613,
    "target": 614
  },
  {
    "source": 616,
    "target": 617
  },
  {
    "source": 619,
    "target": 620
  },
  {
    "source": 622,
    "target": 623
  },
  {
    "source": 624,
    "target": 625
  },
  {
    "source": 627,
    "target": 628
  },
  {
    "source": 629,
    "target": 630
  },
  {
    "source": 633,
    "target": 634
  },
  {
    "source": 634,
    "target": 635
  },
  {
    "source": 636,
    "target": 637
  },
  {
    "source": 650,
    "target": 651
  },
  {
    "source": 651,
    "target": 652
  },
  {
    "source": 653,
    "target": 654
  },
  {
    "source": 654,
    "target": 655
  },
  {
    "source": 656,
    "target": 657
  },
  {
    "source": 657,
    "target": 658
  },
  {
    "source": 659,
    "target": 660
  },
  {
    "source": 661,
    "target": 662
  },
  {
    "source": 662,
    "target": 663
  },
  {
    "source": 664,
    "target": 665
  },
  {
    "source": 665,
    "target": 666
  },
  {
    "source": 667,
    "target": 668
  },
  {
    "source": 669,
    "target": 670
  },
  {
    "source": 670,
    "target": 671
  },
  {
    "source": 672,
    "target": 673
  },
  {
    "source": 674,
    "target": 675
  },
  {
    "source": 677,
    "target": 678
  },
  {
    "source": 679,
    "target": 680
  },
  {
    "source": 680,
    "target": 681
  },
  {
    "source": 682,
    "target": 683
  },
  {
    "source": 684,
    "target": 685
  },
  {
    "source": 686,
    "target": 687
  },
  {
    "source": 688,
    "target": 689
  },
  {
    "source": 690,
    "target": 691
  },
  {
    "source": 692,
    "target": 693
  },
  {
    "source": 694,
    "target": 695
  },
  {
    "source": 696,
    "target": 697
  },
  {
    "source": 698,
    "target": 699
  },
  {
    "source": 704,
    "target": 705
  },
  {
    "source": 705,
    "target": 706
  },
  {
    "source": 708,
    "target": 709
  },
  {
    "source": 710,
    "target": 711
  },
  {
    "source": 712,
    "target": 713
  },
  {
    "source": 714,
    "target": 715
  }

]


// pad a string with `padString` until il reaches length `length`
// e.g. "3".lpad("0", 5) --> "00003"
String.prototype.lpad = function (padString, length) {
  var str = this;
  while (str.length < length)
    str = padString + str;
  return str;
}

function addressMake(p, size) {
  let base = `data/pictures/${size}x${size}/`;
  let ext = ".png";
  var id = p.Id;
  if (id.includes("-")) {
    let s = id.split("-");
    id = s[0].lpad("0", 3) + "-" + s[1];
    if (s.length > 2) {
      id = id + "-" + s[2];
    }
  } else {
    id = id.lpad("0", 3);
  }
  return base + id + ext;
}

d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

// Scroll to a particular anchor
function scrollTo(h) {
  var url = location.href;
  location.href = "#" + h;
  history.replaceState(null, null, url);
}