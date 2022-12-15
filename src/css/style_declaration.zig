const std = @import("std");
const Parser = @import("parser.zig").Parser;
const cssName = @import("parser.zig").cssName;
const expectParse = @import("parser.zig").expectParse;
const expectFmt = std.testing.expectFmt;

pub fn StyleDeclaration(comptime T: type) type {
    return struct {
        style: T = .{},

        const Self = @This();

        pub fn format(self: Self, comptime _: []const u8, _: std.fmt.FormatOptions, writer: anytype) !void {
            var sep = false;
            inline for (std.meta.fields(T)) |f| {
                //if (self.flags[i] == 1) {
                if (true) {
                    if (sep) try writer.writeAll("; ");
                    sep = true;

                    try writer.print("{s}: ", .{cssName(f.name)});

                    const v = @field(self.style, f.name);

                    try switch (@typeInfo(f.field_type)) {
                        .Enum => writer.writeAll(@tagName(v)),
                        .Float => writer.print("{d}", .{v}),
                        // TODO: DimensionLike, ColorLike, ...
                        else => writer.print("{any}", .{v}),
                    };
                }
            }
        }

        pub fn parse(parser: *Parser) !Self {
            var res = Self{};

            while (parser.expect(.ident) catch null) |prop_name| {
                try parser.expect(.colon);

                const val_start = parser.tokenizer.pos;
                while (parser.tokenizer.next() catch null) |t2| if (t2 == .semi or t2 == .rcurly) break;

                std.debug.print("TODO: setProperty {s} {}\n", .{ prop_name, val_start });
                //res.setProperty(prop_name, parser.tokenizer.input[val_start..parser.tokenizer.pos]);
            }

            return res;
        }
    };
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// const std = @import("std");
// const Parser = @import("parser.zig").Parser;
// const expectParse = @import("parser.zig").expectParse;
// const cssName = @import("../css.zig").cssName;
// const expectFmt = std.testing.expectFmt;

// // declaration block represented as a wrapper over user-provided Style struct
// // setting property will immediately change the style and set a flag
// // removing will undo that (and restore the default value)
// //
// // Style is potentially big but all of this is alloc-free
// // and that should outweight any loss, if there is any at all
// //
// // this also implies that value types can't allocate
// // they have to be either fixed-size (with max., for example)
// // or they have to be interned (likely-forever)
// // IMHO this is good trade-off for the overall simplicity
// pub fn StyleDeclaration(comptime T: type) type {
//     const BITS = std.meta.fields(T).len;

//     return struct {
//         flags: [BITS]u1 = std.mem.zeroes([BITS]u1),
//         data: T = .{},

//         const Self = @This();

//         pub fn length(self: *Self) usize {
//             var len: usize = 0;
//             for (self.flags) |v| {
//                 if (v == 1) len += 1;
//             }
//             return len;
//         }

//         pub fn item(self: *Self, index: usize) []const u8 {
//             var i: usize = 0;

//             inline for (std.meta.fields(T)) |f, j| {
//                 if (self.flags[j] == 1) {
//                     if (i == index) return cssName(f.name) else i += 1;
//                 }
//             } else return "";
//         }

//         pub fn getProperty() void {
//             // TODO
//         }

//         pub fn setProperty(self: *Self, prop_name: []const u8, value: []const u8) void {
//             inline for (std.meta.fields(T)) |f, i| {
//                 if (propNameEql(f.name, prop_name)) {
//                     var parser = Parser.init(gpa.allocator(), value);
//                     @field(self.data, f.name) = parser.parse(f.field_type) catch {
//                         return std.log.debug("ignored invalid {s}: {s}\n", .{ prop_name, value });
//                     };
//                     self.flags[i] = 1;
//                 }
//             }
//         }

//         pub fn removeProperty(self: *Self, prop_name: []const u8) void {
//             inline for (std.meta.fields(T)) |f, i| {
//                 if (propNameEql(f.name, prop_name)) {
//                     const default = @ptrCast(*const f.field_type, @alignCast(f.alignment, f.default_value.?)).*;
//                     @field(self.data, f.name) = default;
//                     self.flags[i] = 0;
//                 }
//             }
//         }
// }

// // a.toLowerCase().replace(/-_/g, '') == ...(b)
// pub fn propNameEql(a: []const u8, b: []const u8) bool {
//     var j: usize = 0;
//     for (a) |c| {
//         if (c == '-' or c == '_') continue;
//         if (j >= b.len) return false;
//         if (b[j] == '-' or b[j] == '_') j += 1;
//         if (j >= b.len) return false;
//         if (std.ascii.toLower(c) != std.ascii.toLower(b[j])) return false;
//         j += 1;
//     }
//     return j == b.len;
// }

// test "propNameEql(a, b)" {
//     try std.testing.expect(propNameEql("background_color", "background-color"));
//     try std.testing.expect(propNameEql("background-color", "backgroundColor"));
//     try std.testing.expect(!propNameEql("background-color", "xxx"));
//     try std.testing.expect(!propNameEql("xxx", "background-color"));
//     try std.testing.expect(!propNameEql("foo", "bar"));
// }

// const Decl = StyleDeclaration(struct {
//     display: enum { none, block } = .block,
//     opacity: f32 = 1,
//     flex_grow: f32 = 0,
// });

// test "StyleDeclaration.length()" {
//     var s = Decl{};
//     try std.testing.expectEqual(s.length(), 0);

//     s.flags[0] = 1;
//     try std.testing.expectEqual(s.length(), 1);
// }

// test "StyleDeclaration.item()" {
//     var s = Decl{};
//     try std.testing.expectEqualStrings(s.item(0), "");

//     s.flags[0] = 1;
//     s.flags[2] = 1;
//     try std.testing.expectEqualStrings(s.item(0), "display");
//     try std.testing.expectEqualStrings(s.item(1), "flex-grow");
// }

// test "StyleDeclaration.format()" {
//     var s = Decl{};
//     try expectFmt("", "{}", .{s});

//     s.setProperty("display", "none");
//     try expectFmt("display: none", "{}", .{s});

//     s.setProperty("flex-grow", "1");
//     try expectFmt("display: none; flex-grow: 1", "{}", .{s});
// }

// test "StyleDeclaration.parse()" {
//     try expectParse(Decl, "", Decl{});
//     try expectParse(Decl, "display: block", Decl{ .flags = .{ 1, 0, 0 } });
//     try expectParse(Decl, "unknown: 0; opacity: 0", Decl{ .flags = .{ 0, 1, 0 }, .data = .{ .opacity = 0 } });
//     try expectParse(Decl, "opacity: 0; opacity: invalid", Decl{ .flags = .{ 0, 1, 0 }, .data = .{ .opacity = 0 } });
// }