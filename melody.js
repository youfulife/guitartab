/**
 * Created by youfu on 16/10/12.
 */

function isString(str) {
    return (typeof str == 'string') && str.constructor == String;
}

var lyric_offset = 0
var slur_flag = 0

function draw_melody(p, x, y, melody) {
    var note_x_spacing = 20
    var tab_y_spacing = 10
    var font_size = 15
    var gap = (tab_x_width / bars_num_oneline - note_x_spacing) / 32
    x = x + note_x_spacing

    for (var i = 0; i < melody.length; i++) {
        var note = melody[i][0] // 音符
        var pitch = melody[i][1] // 音高
        var d = melody[i][2] // 时值
        var grace = melody[i][3] //装饰音

        var t = p.text(x, y, note).attr("font-weight", "bold").attr("font-size", font_size)
        if (note != 0 && slur_flag == 0) {
            p.text(x, y + tab_y_spacing * 4, lyrics[lyric_offset]).attr("font-weight", "bold").attr("font-size", font_size)
            lyric_offset += 1
        }
        if (isString(note) && (grace || pitch < 0)) {
            t.attr("text-anchor", "start")
        }
        if (grace == 's') {
            slur_flag = 1
        } else if (slur_flag == 1) {
            slur_flag = 0
        }

        switch (grace) {
            case undefined:
                break
            case 's':
                p.arcLine(
                    x,
                    y - tab_y_spacing * 2,
                    //x + note_x_spacing * 0.5 * (1 + Math.floor(i / (melody.length - 1))),
                    x + 1 / 2 * (gap * d / (1 / 32) + note_x_spacing * Math.floor(i / (melody.length - 1))),
                    y - tab_y_spacing * 3,
                    //x + note_x_spacing * (1 + Math.floor(i / (melody.length - 1))),
                    x + gap * d / (1 / 32) + note_x_spacing * Math.floor(i / (melody.length - 1)),
                    y - tab_y_spacing * 2
                ).attr("stroke-width", 1.2)
                break
            default:
                p.text(x - gap, y - tab_y_spacing * 1.5, grace)
                p.text(x - gap, y - tab_y_spacing * 0.8, "⍑").attr("font-size", font_size)
        }


        switch (pitch) {
            case 0:
                break
            case -8:
                t = p.text(x + 1, y + tab_y_spacing * 1.3, '•').attr("font-size", font_size)
                if (isString(note) && (grace || pitch < 0)) {
                    t.attr("text-anchor", "start")
                }

        }
        switch (d) {
            case 0:
                //休止符
                break
            case 0.0625:
                // 十六分音符
                p.text(x, y, '_').attr("font-weight", "bold").attr("font-size", font_size)
                p.text(x, y + tab_y_spacing * 0.3, '_').attr("font-weight", "bold").attr("font-size", font_size)
                break
            case 0.125:
                // 八分音符
                t = p.text(x, y, '_').attr("font-weight", "bold").attr("font-size", font_size)
                if (isString(note) && (grace || pitch < 0)) {
                    t.attr("text-anchor", "start")
                }
                break
            case 0.1875:
                // 附点八分音符
                t = p.text(x, y, '_').attr("font-weight", "bold").attr("font-size", font_size)
                if (isString(note) && (grace || pitch < 0)) {
                    t.attr("text-anchor", "start")
                }
            case 0.25:
                // 四分音符
                break
            case 0.5:
                p.text(x + 1 / 2 * gap * d / (1 / 32), y, '—').attr("font-weight", "bold")
                break
            case 0.75:
                p.text(x + 1 / 3 * gap * d / (1 / 32), y, '—').attr("font-weight", "bold")
                p.text(x + 2 / 3 * gap * d / (1 / 32), y, '—').attr("font-weight", "bold")
                break
            case 1:
                p.text(x + 1 / 4 * gap * d / (1 / 32), y, '—').attr("font-weight", "bold")
                p.text(x + 2 / 4 * gap * d / (1 / 32), y, '—').attr("font-weight", "bold")
                p.text(x + 3 / 4 * gap * d / (1 / 32), y, '—').attr("font-weight", "bold")
                break
        }
        x = x + gap * d / (1 / 32)
    }
}

// 旋律
Raphael.prototype.draw_melodies = function(melody_list) {
    for (var i = 0; i < melody_list.length; i++) {

        var bar_x_start = tab_x0 + Math.floor(tab_x_width / bars_num_oneline) * (i % bars_num_oneline)
        var bar_y_start = tab_y0 + tab_y_width * Math.floor(i / bars_num_oneline) + tab_y_width * 0.25
        var bar_x_end = bar_x_start + Math.floor(tab_x_width / bars_num_oneline)
        var bar_y_end = bar_y_start + tab_y_spacing * 3
        var melody_x_start = bar_x_start
        var melody_y_start = bar_y_end - tab_y_spacing
        // 每个小节的小节线
        this.verLine(bar_x_start, bar_y_start, bar_y_end)

        draw_melody(this, melody_x_start, melody_y_start, melody_list[i])

        this.verLine(bar_x_end, bar_y_start, bar_y_end)

    }
}