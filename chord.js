/**
 * Created by youfu on 16/10/11.
 */

var chords = {
    "C": {"positions": "x32010", "fingers": "-32-1-"},
    "D": {"positions": "xx0232", "fingers": "---132"},
    "D7": {"positions": "xx0212", "fingers": "---213"},
    "A": {"positions": "x02220", "fingers": "--123-"},
    "Gmaj7/d": {"positions": "320002", "fingers": "32---1"},
    "Gsus2": {"positions": "300233", "fingers": "2--134"},
    "A7sus4": {"positions": "002233", "fingers": "--1123"},
    "Csus2": {"positions": "035533", "fingers": "-13411"},
    "#Cm": {"positions": "x46654", "fingers": "-13421"},
    "Em7": {"positions": "002433", "fingers": "--1423"},
    "Em7(7)": {"positions": "x79787", "fingers": "-13121"}
}


ChordBox = function (paper, x, y, width, height) {
    this.paper = paper;
    this.x = x;
    this.y = y;

    this.width = (!width) ? 60 : width;
    this.height = (!height) ? 70 : height;
    this.num_strings = 6;
    this.num_frets = 5;

    this.string_spacing = this.width / (this.num_strings - 1);
    this.fret_spacing = this.height / this.num_frets;

    // Content
    this.name_size = 15
    this.chord_name = ""
    this.duration = 0
}

ChordBox.prototype.setChord = function (c, d) {
    this.chord_name = c
    this.duration = d
    return this
}

ChordBox.prototype.draw = function () {
    var string_spacing = this.string_spacing;
    var fret_spacing = this.fret_spacing;
    var chord_name = this.chord_name

    // Draw strings
    for (var i = 0; i < this.num_strings; i++) {
        this.paper.verLine(this.x + string_spacing * i, this.y, this.y + this.height - fret_spacing / 2)
    }

    // Draw frets
    for (var i = 0; i < this.num_frets; i++) {
        this.paper.horLine(this.x, this.y + fret_spacing * i, this.x + this.width)
    }

    // Draw chord name
    this.paper.text(this.x + this.width / 2, this.y - fret_spacing, chord_name).attr("font-size", this.name_size)
    if (!chords[chord_name]) {
        return
    }

    // Draw min_fret
    var max = 0
    for (var i = 0; i < this.num_strings; i++) {
        var fret = Math.floor(chords[chord_name]["positions"][i])
        if (fret > max) {
            max = fret
        }
    }
    var min = max
    for (var i = 0; i < this.num_strings; i++) {
        var fret = Math.floor(chords[chord_name]["positions"][i])
        if (fret != 0 && fret < min) {
            min = fret
        }
    }
    var capo = 1
    if (max < 5) {
        capo = 1
    } else if (max >= 5) {
        capo = min
    }
    if (capo != 1) {
        this.paper.text(this.x - string_spacing * 0.5, this.y + fret_spacing * 0.5, capo)
    }

    // Draw finger
    for (var i = 0; i < 6; i++) {
        var position = chords[chord_name]["positions"][i]
        var finger = chords[chord_name]["fingers"][i]
        if (position == 'x') {
            this.paper.text(this.x + string_spacing * i, this.y - fret_spacing / 4, "x")
        }
        else if (position == '0') {
            this.paper.text(this.x + string_spacing * i, this.y - fret_spacing / 4, "o")
        }
        else {
            var fret = Math.floor(position)
            this.paper.circle(this.x + string_spacing * i, this.y + fret_spacing * (fret - capo + 1) - fret_spacing / 2, fret_spacing / 3).attr("fill", "black")
            this.paper.text(this.x + string_spacing * i, this.y + fret_spacing * (fret - capo + 1) - fret_spacing / 2, finger).attr("fill", "white")
        }
    }
    return
}


Raphael.prototype.draw_chords = function (chord_list) {
    var x = tab_x0
    var y = tab_y0 - tab_y_width / 4.5
    var total_chord_duration = 0

    // 和弦
    for (var i = 0; i < chord_list.length; i++) {
        var chord = new ChordBox(this, x, y)
        var c = chord_list[i][0]
        var d = chord_list[i][1]
        chord.setChord(c, d)
        chord.draw()

        total_chord_duration += d

        x = x + d * (tab_x_width / bars_num_oneline)
        if (total_chord_duration % bars_num_oneline == 0) {
            x = tab_x0
            y = y + tab_y_width
        }
    }
}
