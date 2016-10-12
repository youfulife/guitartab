/**
 * Created by youfu on 16/10/12.
 */

Tab = function (paper, x, y, width, height) {
    this.paper = paper;
    this.x = x;
    this.y = y;

    this.width = (!width) ? 900 : width;
    this.height = (!height) ? 60 : height;
    this.num_strings = 6;
    this.num_bars = 5

    this.tab_spacing = 360

    // Content
    this.note = []
}

Tab.prototype.draw_six_line = function () {
    var spacing = this.height / (this.num_strings - 1);
    for (var i = 0; i < this.num_strings; i++) {
        this.paper.horLine(this.x, this.y + spacing * i, this.x + this.width)
    }
}

Tab.prototype.draw_bar_line = function() {
    var bar_width = Math.floor(this.width / this.num_bars)
    var spacing = this.height / (this.num_strings - 1);
    for (var i = 0; i <= this.num_bars; i++) {
        this.paper.verLine(this.x + bar_width * i, this.y, this.y + spacing * (this.num_strings - 1))
    }
}


Raphael.prototype.draw_tabs = function (num_groups) {
    var x = tab_x0
    var y = tab_y0
    for (var i = 0; i < num_groups; i++) {
        var tab = new Tab(this, x, y)
        tab.draw_six_line()
        tab.draw_bar_line()
        y += tab.tab_spacing
    }
}