const std = @import("std");
const Node = @import("node.zig").Node;
const Document = @import("document.zig").Document;
const StyleDeclaration = @import("../css/style_declaration.zig").StyleDeclaration;
const Style = @import("../style.zig").Style;

pub const Element = struct {
    node: Node,
    local_name: []const u8,
    attributes: std.BufMap,
    style: StyleDeclaration,
    resolved_style: Style,

    pub fn init(document: *Document, local_name: []const u8) !Element {
        return .{
            .node = .{ .owner_document = document, .node_type = .element },
            .local_name = try document.allocator.dupe(u8, local_name),
            .attributes = std.BufMap.init(document.allocator),
            .style = StyleDeclaration.init(document.allocator),
            .resolved_style = .{},
        };
    }

    pub fn deinit(self: *Element) void {
        self.node.owner_document.allocator.free(self.local_name);
        self.attributes.deinit();
        self.style.deinit();
    }

    pub fn children(self: *Element) Element.ChildrenIterator {
        return .{ .nodes = self.node.childNodes() };
    }

    pub fn hasAttributes(self: *Element) bool {
        return self.attributes.hash_map.count() > 0;
    }

    pub fn hasAttribute(self: *Element, name: []const u8) bool {
        return self.attributes.hash_map.contains(name);
    }

    pub fn getAttribute(self: *Element, name: []const u8) ?[]const u8 {
        return self.attributes.get(name);
    }

    pub fn setAttribute(self: *Element, name: []const u8, value: []const u8) !void {
        try self.attributes.put(name, value);
        self.node.markDirty();
    }

    pub fn removeAttribute(self: *Element, name: []const u8) void {
        self.attributes.remove(name);
        self.node.markDirty();
    }

    pub const ChildrenIterator = struct {
        nodes: Node.ChildNodesIterator,

        pub fn next(self: *ChildrenIterator) ?*Element {
            while (self.nodes.next()) |node| {
                if (node.node_type == .element) return node.cast(Element);
            }
            return null;
        }
    };
};
