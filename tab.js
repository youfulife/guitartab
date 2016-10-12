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
    this.font_size = 10
    this.note_spacing = 20
    this.string_spacing = this.height / (this.num_strings - 1);
    this.string = 0
    this.fret = 'X'
    this.duration = 0
    this.grace = undefined

    this.total_duration = 0
}

Tab.prototype.draw_six_line = function () {
    for (var i = 0; i < this.num_strings; i++) {
        this.paper.horLine(this.x, this.y + this.string_spacing * i, this.x + this.width)
    }
}

Tab.prototype.draw_bar_line = function() {
    var bar_width = Math.floor(this.width / this.num_bars)
    var spacing = this.height / (this.num_strings - 1);
    for (var i = 0; i <= this.num_bars; i++) {
        this.paper.verLine(this.x + bar_width * i, this.y, this.y + spacing * (this.num_strings - 1))
    }
}

Tab.prototype.draw_fret_note = function(x, y, f) {
    if (f == '⟿') {
        this.paper.text(x, y, f).attr("font-size", this.font_size * 2).rotate(-90).attr("text-anchor", "start")
    } else {
        this.paper.text(x, y, f).attr("font-size", this.font_size)
    }
}

Tab.prototype.draw_fingering = function () {
    var ss = this.string.toString()
    var x = this.x
    if (Math.floor(this.total_duration) == this.total_duration) {
        x += this.note_spacing
    }

    for(var i=0; i < ss.length; i++) {
        var s = parseInt(ss[i]) // string
        var f = this.fret.split('/')[i] // fret
        var d = this.duration
        var y = this.y + this.string_spacing * (s - 1)
        this.draw_fret_note(x, y, f)
    }
    this.total_duration += d
    this.x = x + d * (this.width / this.num_bars - this.note_spacing)
    if (this.total_duration % bars_num_oneline == 0) {
        this.x = tab_x0
        this.y = y + this.tab_spacing
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
    var tab = new Tab(this, tab_x0, tab_y0)
    for (var i = 0; i < fingering.length; i++) {
        tab.string = fingering[i][0]
        tab.fret = fingering[i][1]
        tab.duration = fingering[i][2]
        tab.grace = fingering[i][3]
        tab.draw_fingering()
    }
}