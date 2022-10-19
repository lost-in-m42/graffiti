const std = @import("std");
const napigen = @import("napigen");
const lib = @import("root");
const platform = @import("platform.zig");
const Document = @import("document.zig").Document;
const Node = @import("document.zig").Node;
const Renderer = @import("renderer.zig").Renderer;
const Style = @import("style.zig").Style;
const css = @import("css.zig");

var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const allocator = gpa.allocator();

var window: *platform.Window = undefined;
var document: *Document = undefined;
var renderer: Renderer = undefined;

export fn napi_register_module_v1(env: napigen.napi_env, _: napigen.napi_value) napigen.napi_value {
    platform.init() catch @panic("err");

    window = platform.Window.init("Hello", 800, 600) catch @panic("err");
    document = Document.init(allocator);
    renderer = Renderer.init(allocator) catch @panic("err");

    var cx = napigen.Context{ .env = env };

    const exports = .{
        .document = document,
        .Document_createElement = &Document.createElement,
        .Document_createTextNode = &Document.createTextNode,
        .Document_elementFromPoint = &Document.elementFromPoint,

        .Node_appendChild = &Node.appendChild,
        .Node_parentNode = &getter(Node, .parent_node),
        .Node_firstChild = &getter(Node, .first_child),
        // .Node_previousSibling = &getter(Node, .previous_sibling),
        .Node_nextSibling = &getter(Node, .next_sibling),
        .Element_setStyle = &Element_setStyle,
        .Element_setStyleProp = &Element_setStyleProp,

        .tick = &tick,
    };

    return cx.write(exports) catch |e| return cx.throw(e);
}

fn getter(comptime T: type, comptime field: std.meta.FieldEnum(T)) fn (*T) std.meta.fieldInfo(T, field).field_type {
    const f = std.meta.fieldInfo(T, field);
    return (struct {
        fn get(ptr: *T) f.field_type {
            return @field(ptr, f.name);
        }
    }).get;
}

fn tick(cx: *napigen.Context, dispatch_fn: napigen.napi_value) !bool {
    // handle events in JS
    while (platform.nextEvent()) |ev| try cx.call(void, dispatch_fn, .{ev});

    // re-render
    renderer.render(document, window.size(), window.scale());
    window.swapBuffers();

    // wait for input
    platform.waitEvents();

    return !window.shouldClose();
}

fn Element_setStyle(node: *Node, style: []const u8) !void {
    if (node.as(.element)) |el| {
        var parser = css.Parser.init(allocator, style);
        el.style = try parser.parse(css.StyleDeclaration(Style));
        std.log.debug("style = {any}", .{el.style});
    }
}

fn Element_setStyleProp(node: *Node, prop_name: []const u8, prop_value: []const u8) !void {
    if (node.as(.element)) |el| {
        el.style.setProperty(prop_name, prop_value);
        std.log.debug("style = {any}", .{el.style});
    }
}
