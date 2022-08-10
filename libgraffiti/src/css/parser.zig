const std = @import("std");
const Tokenizer = @import("tokenizer.zig").Tokenizer;
const Display = @import("values.zig").Display;
const Dimension = @import("values.zig").Dimension;
const Color = @import("values.zig").Color;

pub const Parser = struct {
    allocator: std.mem.Allocator,
    tokenizer: Tokenizer,

    const Self = @This();

    pub fn init(allocator: std.mem.Allocator, input: []const u8) Self {
        return .{
            .allocator = allocator,
            .tokenizer = Tokenizer.init(input),
        };
    }

    // pub fn parseStyleSheet(self: *Self) !StyleSheet {}
    // pub fn parseStyleRule(self: *Self) !StyleRule {}
    // pub fn parseSelector(self: *Self) !Selector {}
    // pub fn parseStyle(self: *Self) !Style {}
    // pub fn parseProp(self: *Self) !StyleProp {}

    // so it can be used from style.setProperty()
    // ? but what about shorthands?
    // pub fn parsePropValue(self: *Self, prop_name: []const u8) !Style {}

    fn parseValue(self: *Self, comptime T: type) T {
        if (@typeInfo(T) == .Enum) {
            return self.parseEnum(T);
        }

        return switch (T) {
            f32 => @panic("TODO"),
            // TODO: string
            // Color => self.parseColor()
            // Dimension => self.parseDimension()
            // ...
            else => @compileError("unknown value type"),
        };
    }

    fn parseEnum(self: *Self, comptime T: type) !T {
        const tok = try self.tokenizer.next();

        if (tok == .ident) {
            inline for (@typeInfo(T).Enum.fields) |f| {
                if (std.mem.eql(u8, cssName(f.name), tok.ident)) {
                    return @intToEnum(T, f.value);
                }
            }
        }

        return error.invalid;
    }

    fn parseDimension(self: *Self) !Dimension {
        const tok = try self.tokenizer.next();

        // https://github.com/ziglang/zig/issues/6749
        const D = Dimension;

        switch (tok) {
            .number => |n| if (n == 0) return D{ .px = 0 },
            .percentage => |p| return D{ .percent = p },
            .dimension => |d| {
                if (std.mem.eql(u8, "px", d.unit)) return D{ .px = d.value };
                if (std.mem.eql(u8, "em", d.unit)) return D{ .em = d.value };
                if (std.mem.eql(u8, "rem", d.unit)) return D{ .rem = d.value };
                if (std.mem.eql(u8, "vw", d.unit)) return D{ .vw = d.value };
                if (std.mem.eql(u8, "vh", d.unit)) return D{ .vh = d.value };
            },
            .ident => |k| {
                if (std.mem.eql(u8, "auto", k)) return D.auto;
                if (std.mem.eql(u8, "vmin", k)) return D.vmin;
                if (std.mem.eql(u8, "vmax", k)) return D.vmax;
            },
            else => {},
        }

        std.debug.print("{}\n", .{tok});
        return error.invalid;
    }

    fn parseColor(self: *Self) !Color {
        const tok = try self.tokenizer.next();

        switch (tok) {
            .ident => if (NAMED_COLORS.get(tok.ident)) |c| return c,
            .function => {
                if (std.mem.eql(u8, tok.function, "rgb")) {
                    @panic("TODO: rgb()");
                }

                if (std.mem.eql(u8, tok.function, "rgba")) {
                    @panic("TODO: rgba()");
                }
            },
            .hash => |s| {
                switch (s.len) {
                    8 => return rgba(
                        try std.fmt.parseInt(u8, s[0..2], 16),
                        try std.fmt.parseInt(u8, s[2..4], 16),
                        try std.fmt.parseInt(u8, s[4..6], 16),
                        try std.fmt.parseInt(u8, s[6..8], 16),
                    ),
                    6 => return rgb(
                        try std.fmt.parseInt(u8, s[0..2], 16),
                        try std.fmt.parseInt(u8, s[2..4], 16),
                        try std.fmt.parseInt(u8, s[4..6], 16),
                    ),
                    4 => return rgba(
                        (try std.fmt.parseInt(u8, s[0..1], 16)) * 17,
                        (try std.fmt.parseInt(u8, s[1..2], 16)) * 17,
                        (try std.fmt.parseInt(u8, s[2..3], 16)) * 17,
                        (try std.fmt.parseInt(u8, s[3..4], 16)) * 17,
                    ),
                    3 => return rgb(
                        (try std.fmt.parseInt(u8, s[0..1], 16)) * 17,
                        (try std.fmt.parseInt(u8, s[1..2], 16)) * 17,
                        (try std.fmt.parseInt(u8, s[2..3], 16)) * 17,
                    ),
                    else => {},
                }
            },
            else => {},
        }

        return error.invalid;
    }
};

fn cssName(comptime name: []const u8) []const u8 {
    comptime {
        var buf: [name.len:0]u8 = undefined;
        _ = std.mem.replace(u8, name, "_", "-", &buf);
        buf[buf.len] = 0;
        return &buf;
    }
}

const NAMED_COLORS = blk: {
    @setEvalBranchQuota(5000);
    break :blk std.ComptimeStringMap(Color, .{
        .{ "transparent", Color{} },

        // https://drafts.csswg.org/css-color/#named-colors
        .{ "aliceblue", rgb(240, 248, 255) },
        .{ "antiquewhite", rgb(250, 235, 215) },
        .{ "aqua", rgb(0, 255, 255) },
        .{ "aquamarine", rgb(127, 255, 212) },
        .{ "azure", rgb(240, 255, 255) },
        .{ "beige", rgb(245, 245, 220) },
        .{ "bisque", rgb(255, 228, 196) },
        .{ "black", rgb(0, 0, 0) },
        .{ "blanchedalmond", rgb(255, 235, 205) },
        .{ "blue", rgb(0, 0, 255) },
        .{ "blueviolet", rgb(138, 43, 226) },
        .{ "brown", rgb(165, 42, 42) },
        .{ "burlywood", rgb(222, 184, 135) },
        .{ "cadetblue", rgb(95, 158, 160) },
        .{ "chartreuse", rgb(127, 255, 0) },
        .{ "chocolate", rgb(210, 105, 30) },
        .{ "coral", rgb(255, 127, 80) },
        .{ "cornflowerblue", rgb(100, 149, 237) },
        .{ "cornsilk", rgb(255, 248, 220) },
        .{ "crimson", rgb(220, 20, 60) },
        .{ "cyan", rgb(0, 255, 255) },
        .{ "darkblue", rgb(0, 0, 139) },
        .{ "darkcyan", rgb(0, 139, 139) },
        .{ "darkgoldenrod", rgb(184, 134, 11) },
        .{ "darkgray", rgb(169, 169, 169) },
        .{ "darkgreen", rgb(0, 100, 0) },
        .{ "darkgrey", rgb(169, 169, 169) },
        .{ "darkkhaki", rgb(189, 183, 107) },
        .{ "darkmagenta", rgb(139, 0, 139) },
        .{ "darkolivegreen", rgb(85, 107, 47) },
        .{ "darkorange", rgb(255, 140, 0) },
        .{ "darkorchid", rgb(153, 50, 204) },
        .{ "darkred", rgb(139, 0, 0) },
        .{ "darksalmon", rgb(233, 150, 122) },
        .{ "darkseagreen", rgb(143, 188, 143) },
        .{ "darkslateblue", rgb(72, 61, 139) },
        .{ "darkslategray", rgb(47, 79, 79) },
        .{ "darkslategrey", rgb(47, 79, 79) },
        .{ "darkturquoise", rgb(0, 206, 209) },
        .{ "darkviolet", rgb(148, 0, 211) },
        .{ "deeppink", rgb(255, 20, 147) },
        .{ "deepskyblue", rgb(0, 191, 255) },
        .{ "dimgray", rgb(105, 105, 105) },
        .{ "dimgrey", rgb(105, 105, 105) },
        .{ "dodgerblue", rgb(30, 144, 255) },
        .{ "firebrick", rgb(178, 34, 34) },
        .{ "floralwhite", rgb(255, 250, 240) },
        .{ "forestgreen", rgb(34, 139, 34) },
        .{ "fuchsia", rgb(255, 0, 255) },
        .{ "gainsboro", rgb(220, 220, 220) },
        .{ "ghostwhite", rgb(248, 248, 255) },
        .{ "gold", rgb(255, 215, 0) },
        .{ "goldenrod", rgb(218, 165, 32) },
        .{ "gray", rgb(128, 128, 128) },
        .{ "green", rgb(0, 128, 0) },
        .{ "greenyellow", rgb(173, 255, 47) },
        .{ "grey", rgb(128, 128, 128) },
        .{ "honeydew", rgb(240, 255, 240) },
        .{ "hotpink", rgb(255, 105, 180) },
        .{ "indianred", rgb(205, 92, 92) },
        .{ "indigo", rgb(75, 0, 130) },
        .{ "ivory", rgb(255, 255, 240) },
        .{ "khaki", rgb(240, 230, 140) },
        .{ "lavender", rgb(230, 230, 250) },
        .{ "lavenderblush", rgb(255, 240, 245) },
        .{ "lawngreen", rgb(124, 252, 0) },
        .{ "lemonchiffon", rgb(255, 250, 205) },
        .{ "lightblue", rgb(173, 216, 230) },
        .{ "lightcoral", rgb(240, 128, 128) },
        .{ "lightcyan", rgb(224, 255, 255) },
        .{ "lightgoldenrodyellow", rgb(250, 250, 210) },
        .{ "lightgray", rgb(211, 211, 211) },
        .{ "lightgreen", rgb(144, 238, 144) },
        .{ "lightgrey", rgb(211, 211, 211) },
        .{ "lightpink", rgb(255, 182, 193) },
        .{ "lightsalmon", rgb(255, 160, 122) },
        .{ "lightseagreen", rgb(32, 178, 170) },
        .{ "lightskyblue", rgb(135, 206, 250) },
        .{ "lightslategray", rgb(119, 136, 153) },
        .{ "lightslategrey", rgb(119, 136, 153) },
        .{ "lightsteelblue", rgb(176, 196, 222) },
        .{ "lightyellow", rgb(255, 255, 224) },
        .{ "lime", rgb(0, 255, 0) },
        .{ "limegreen", rgb(50, 205, 50) },
        .{ "linen", rgb(250, 240, 230) },
        .{ "magenta", rgb(255, 0, 255) },
        .{ "maroon", rgb(128, 0, 0) },
        .{ "mediumaquamarine", rgb(102, 205, 170) },
        .{ "mediumblue", rgb(0, 0, 205) },
        .{ "mediumorchid", rgb(186, 85, 211) },
        .{ "mediumpurple", rgb(147, 112, 219) },
        .{ "mediumseagreen", rgb(60, 179, 113) },
        .{ "mediumslateblue", rgb(123, 104, 238) },
        .{ "mediumspringgreen", rgb(0, 250, 154) },
        .{ "mediumturquoise", rgb(72, 209, 204) },
        .{ "mediumvioletred", rgb(199, 21, 133) },
        .{ "midnightblue", rgb(25, 25, 112) },
        .{ "mintcream", rgb(245, 255, 250) },
        .{ "mistyrose", rgb(255, 228, 225) },
        .{ "moccasin", rgb(255, 228, 181) },
        .{ "navajowhite", rgb(255, 222, 173) },
        .{ "navy", rgb(0, 0, 128) },
        .{ "oldlace", rgb(253, 245, 230) },
        .{ "olive", rgb(128, 128, 0) },
        .{ "olivedrab", rgb(107, 142, 35) },
        .{ "orange", rgb(255, 165, 0) },
        .{ "orangered", rgb(255, 69, 0) },
        .{ "orchid", rgb(218, 112, 214) },
        .{ "palegoldenrod", rgb(238, 232, 170) },
        .{ "palegreen", rgb(152, 251, 152) },
        .{ "paleturquoise", rgb(175, 238, 238) },
        .{ "palevioletred", rgb(219, 112, 147) },
        .{ "papayawhip", rgb(255, 239, 213) },
        .{ "peachpuff", rgb(255, 218, 185) },
        .{ "peru", rgb(205, 133, 63) },
        .{ "pink", rgb(255, 192, 203) },
        .{ "plum", rgb(221, 160, 221) },
        .{ "powderblue", rgb(176, 224, 230) },
        .{ "purple", rgb(128, 0, 128) },
        .{ "rebeccapurple", rgb(102, 51, 153) },
        .{ "red", rgb(255, 0, 0) },
        .{ "rosybrown", rgb(188, 143, 143) },
        .{ "royalblue", rgb(65, 105, 225) },
        .{ "saddlebrown", rgb(139, 69, 19) },
        .{ "salmon", rgb(250, 128, 114) },
        .{ "sandybrown", rgb(244, 164, 96) },
        .{ "seagreen", rgb(46, 139, 87) },
        .{ "seashell", rgb(255, 245, 238) },
        .{ "sienna", rgb(160, 82, 45) },
        .{ "silver", rgb(192, 192, 192) },
        .{ "skyblue", rgb(135, 206, 235) },
        .{ "slateblue", rgb(106, 90, 205) },
        .{ "slategray", rgb(112, 128, 144) },
        .{ "slategrey", rgb(112, 128, 144) },
        .{ "snow", rgb(255, 250, 250) },
        .{ "springgreen", rgb(0, 255, 127) },
        .{ "steelblue", rgb(70, 130, 180) },
        .{ "tan", rgb(210, 180, 140) },
        .{ "teal", rgb(0, 128, 128) },
        .{ "thistle", rgb(216, 191, 216) },
        .{ "tomato", rgb(255, 99, 71) },
        .{ "turquoise", rgb(64, 224, 208) },
        .{ "violet", rgb(238, 130, 238) },
        .{ "wheat", rgb(245, 222, 179) },
        .{ "white", rgb(255, 255, 255) },
        .{ "whitesmoke", rgb(245, 245, 245) },
        .{ "yellow", rgb(255, 255, 0) },
        .{ "yellowgreen", rgb(154, 205, 50) },
    });
};

fn rgb(r: u8, g: u8, b: u8) Color {
    return rgba(r, g, b, 255);
}

fn rgba(r: u8, g: u8, b: u8, a: u8) Color {
    return .{ .r = r, .g = g, .b = b, .a = a };
}

fn testParser(input: []const u8) Parser {
    return Parser.init(std.testing.allocator, input);
}

test "enums" {
    try std.testing.expectEqual(Display.block, try testParser("block").parseEnum(Display));
    try std.testing.expectEqual(Display.table_row, try testParser("table-row").parseEnum(Display));
    try std.testing.expectError(error.invalid, testParser("err").parseEnum(Display));
}

test "dimension" {
    try std.testing.expectEqual(Dimension{ .px = 0 }, try testParser("0").parseDimension());
    try std.testing.expectEqual(Dimension{ .percent = 100 }, try testParser("100%").parseDimension());
    try std.testing.expectEqual(Dimension{ .px = 10 }, try testParser("10px").parseDimension());
    try std.testing.expectEqual(Dimension{ .em = 1.2 }, try testParser("1.2em").parseDimension());
    try std.testing.expectEqual(Dimension{ .rem = 2.1 }, try testParser("2.1rem").parseDimension());
    try std.testing.expectEqual(Dimension{ .vw = 100 }, try testParser("100vw").parseDimension());
    try std.testing.expectEqual(Dimension{ .vh = 100 }, try testParser("100vh").parseDimension());
    try std.testing.expectEqual(Dimension.auto, try testParser("auto").parseDimension());
    try std.testing.expectEqual(Dimension.vmin, try testParser("vmin").parseDimension());
    try std.testing.expectEqual(Dimension.vmax, try testParser("vmax").parseDimension());
}

test "color" {
    try std.testing.expectEqual(rgb(0, 0, 0), try testParser("#000000").parseColor());
    try std.testing.expectEqual(rgb(0xFF, 0, 0), try testParser("#ff0000").parseColor());
    try std.testing.expectEqual(rgb(0, 0xFF, 0), try testParser("#00ff00").parseColor());
    try std.testing.expectEqual(rgb(0, 0, 0xFF), try testParser("#0000ff").parseColor());

    try std.testing.expectEqual(rgba(0x80, 0x80, 0x80, 0x80), try testParser("#80808080").parseColor());
    try std.testing.expectEqual(rgba(0, 0, 0, 0x80), try testParser("#00000080").parseColor());

    try std.testing.expectEqual(rgb(0, 0, 0), try testParser("#000").parseColor());
    try std.testing.expectEqual(rgb(0xFF, 0, 0), try testParser("#f00").parseColor());
    try std.testing.expectEqual(rgb(0xFF, 0xFF, 0xFF), try testParser("#fff").parseColor());

    try std.testing.expectEqual(rgba(0, 0, 0, 0), try testParser("#0000").parseColor());
    try std.testing.expectEqual(rgb(0xFF, 0, 0), try testParser("#f00f").parseColor());

    // assert_eq!(Color::parse("rgb(0, 0, 0)"), Ok(Color::BLACK));
    // assert_eq!(Color::parse("rgba(0, 0, 0, 0)"), Ok(Color::TRANSPARENT));

    try std.testing.expectEqual(Color{}, try testParser("transparent").parseColor());
    try std.testing.expectEqual(Color{ .a = 255 }, try testParser("black").parseColor());
}
