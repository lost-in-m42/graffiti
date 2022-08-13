// HTML parsing/serialization
// TODO: port htmlparser.js?

const std = @import("std");
const Document = @import("document.zig").Document;
const Node = @import("document.zig").Node;

const Token = union(enum) {
    comment,
    text: []const u8,
    tag_open: []const u8,
    attribute: [2][]const u8,
    tag_close,
};

const Tokenizer = struct {
    input: []const u8,
    pos: usize = 0,
    in_tag: bool = false,

    const Self = @This();

    fn next(self: *Self) ?Token {
        var ch = self.peek(0) orelse return null;

        if (self.in_tag) {
            while (std.ascii.isSpace(ch)) {
                self.pos += 1;
                ch = self.peek(0) orelse return null;
            }
        }

        if (ch == '>') {
            self.pos += 1;
            self.in_tag = false;
            return self.next() orelse return null;
        }

        if (ch == '<') {
            self.pos += 1;

            if ((self.peek(0) orelse return null) == '/') {
                self.pos += 1;
                _ = self.consume(std.ascii.isAlpha);
                return Token.tag_close;
            }

            if (self.consume(std.ascii.isAlpha)) |tag| {
                self.in_tag = true;
                return Token{ .tag_open = tag };
            }
        }

        if (self.in_tag) {
            if (self.consume(std.ascii.isAlpha)) |att| {
                if ((self.peek(0) orelse return null) == '=') {
                    self.pos += 2;
                    const s = self.pos;
                    while ((self.peek(0) orelse return null) != '"') self.pos += 1;
                    defer self.pos += 1;
                    return Token{ .attribute = .{ att, self.input[s..self.pos] } };
                }

                return Token{ .attribute = .{ att, "" } };
            }
        }

        // TODO: trim is wrong here!
        return Token{ .text = std.mem.trim(u8, self.consume(Self.notAngle) orelse return null, " \n\r\t") };
    }

    fn notAngle(ch: u8) bool {
        return ch != '<';
    }

    fn consume(self: *Self, fun: anytype) ?[]const u8 {
        const start = self.pos;
        while (fun(self.peek(0) orelse 0)) self.pos += 1;

        return if (self.pos > start) self.input[start..self.pos] else null;
    }

    fn peek(self: *Self, n: usize) ?u8 {
        const i = self.pos + n;
        return if (i < self.input.len) self.input[i] else null;
    }
};

pub const DOMParser = struct {
    allocator: std.mem.Allocator,

    const Self = @This();

    pub fn init(allocator: std.mem.Allocator) Self {
        return .{ .allocator = allocator };
    }

    pub fn parseFromString(self: *Self, html: []const u8) !Document {
        var doc = try Document.init(self.allocator);
        var tokenizer = Tokenizer{ .input = std.mem.trim(u8, html, " \n\r\t") };
        var stack = std.ArrayList(*Node).init(self.allocator);
        _ = try stack.append(doc.root);
        defer stack.deinit();

        while (tokenizer.next()) |t| {
            const parent = stack.items[stack.items.len - 1];

            switch (t) {
                .comment => {},
                .text => |text| parent.appendChild(try doc.createTextNode(text)),
                .tag_open => |local_name| {
                    const el = try doc.createElement(local_name);
                    parent.appendChild(el);
                    try stack.append(el);
                },
                .attribute => |att| try parent.element().setAttribute(att[0], att[1]),
                .tag_close => _ = stack.pop(),
            }
        }

        return doc;
    }
};

// TODO
pub const XMLSerializer = struct {};