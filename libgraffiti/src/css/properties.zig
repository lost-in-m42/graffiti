// supported CSS props (longhand)

const BoxShadow = @import("values/BoxShadow.zig").BoxShadow;
const Color = @import("values/Color.zig").Color;
const Dimension = @import("values/Dimension.zig").Dimension;
const enums = @import("values/enums.zig");
const Px = @import("values/Px.zig").Px;
const Transform = @import("values/Transform.zig").Transform;

pub const StyleProp = union(enum) {
    // size
    @"width": Dimension,
    @"height": Dimension,
    @"min-width": Dimension,
    @"min-height": Dimension,
    @"max-width": Dimension,
    @"max-height": Dimension,

    // padding
    @"padding-top": Dimension,
    @"padding-right": Dimension,
    @"padding-bottom": Dimension,
    @"padding-left": Dimension,

    // margin
    @"margin-top": Dimension,
    @"margin-right": Dimension,
    @"margin-bottom": Dimension,
    @"margin-left": Dimension,

    // background
    @"background-color": Color,

    // border-radius
    @"border-top-left-radius": Px,
    @"border-top-right-radius": Px,
    @"border-bottom-right-radius": Px,
    @"border-bottom-left-radius": Px,

    // border
    @"border-top-width": Px,
    @"border-top-style": enums.BorderStyle,
    @"border-top-color": Color,
    @"border-right-width": Px,
    @"border-right-style": enums.BorderStyle,
    @"border-right-color": Color,
    @"border-bottom-width": Px,
    @"border-bottom-style": enums.BorderStyle,
    @"border-bottom-color": Color,
    @"border-left-width": Px,
    @"border-left-style": enums.BorderStyle,
    @"border-left-color": Color,

    // shadow
    @"box-shadow": BoxShadow,

    // flex
    @"flex-grow": f32,
    @"flex-shrink": f32,
    @"flex-basis": Dimension,
    @"flex-direction": enums.FlexDirection,
    @"flex-wrap": enums.FlexWrap,
    @"align-content": enums.Align,
    @"align-items": enums.Align,
    @"align-self": enums.Align,
    @"justify-content": enums.Justify,

    // text
    // @"font-family": []const u8,
    @"font-size": Dimension,
    @"line-height": Dimension,
    @"text-align": enums.TextAlign,
    @"color": Color,

    // outline
    @"outline-color": Color,
    @"outline-style": enums.BorderStyle,
    @"outline-width": Px,

    // overflow
    @"overflow-x": enums.Overflow,
    @"overflow-y": enums.Overflow,

    // position
    @"position": enums.Position,
    @"top": Dimension,
    @"right": Dimension,
    @"bottom": Dimension,
    @"left": Dimension,

    // other
    @"display": enums.Display,
    @"opacity": f32,
    @"visibility": enums.Visibility,
    @"transform": Transform,

};

