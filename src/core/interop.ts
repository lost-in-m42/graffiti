// generated

    

export enum BorderStyle { 
    None,
    Solid, 
}
export enum EventKind { 
    MouseMove,
    MouseDown,
    MouseUp,
    Scroll,
    KeyDown,
    KeyPress,
    KeyUp,
    Focus,
    Blur,
    Resize,
    Close, 
}
export enum DimensionProp { 
    Width,
    Height,
    MinWidth,
    MinHeight,
    MaxWidth,
    MaxHeight,

    PaddingLeft,
    PaddingRight,
    PaddingTop,
    PaddingBottom,

    MarginLeft,
    MarginRight,
    MarginTop,
    MarginBottom,

    FlexGrow,
    FlexShrink,
    FlexBasis, 
}
export enum AlignProp { 
    AlignContent,
    AlignItems,
    AlignSelf,
    JustifyContent, 
}
export enum Align { 
    Auto,
    FlexStart,
    Center,
    FlexEnd,
    Stretch,
    Baseline,
    SpaceBetween,
    SpaceAround,
    SpaceEvenly, 
}
export enum FlexWrap { 
    NoWrap,
    Wrap,
    WrapReverse, 
}
export enum FlexDirection { 
    Column,
    ColumnReverse,
    Row,
    RowReverse, 
}
export enum TextAlign { 
    Left,
    Center,
    Right, 
}

    
export const Pos = (x,y) => [x,y]
export const Bounds = (a,b) => [a,b]
export const Color = (r,g,b,a) => [r,g,b,a]
export const BoxShadow = (color,offset,blur,spread) => [color,offset,blur,spread]
export const Border = (top,right,bottom,left) => [top,right,bottom,left]
export const BorderSide = (width,style,color) => [width,style,color]
export const BorderRadius = (top,right,bottom,left) => [top,right,bottom,left]
export const Image = (url) => [url]
export const Event = (kind,target,key) => [kind,target,key]
export const Text = (font_size,line_height,align,text) => [font_size,line_height,align,text]

    
export module ApiMsg {
        
    export const CreateWindow = (width,height) => [0, width,height]
    export const GetEvents = (poll) => [1, poll]
    export const UpdateScene = (window,changes) => [2, window,changes]
    export const GetBounds = (window,surface) => [3, window,surface]
      
}
    
export module ApiResponse {
        
    export const Events = (events) => [0, events]
    export const Nothing = () => [1, ]
    export const Bounds = (bounds) => [2, bounds]
      
}
    
export module SceneChange {
        
    export const Alloc = () => [0, ]
    export const InsertAt = (parent,child,index) => [1, parent,child,index]
    export const RemoveChild = (parent,child) => [2, parent,child]
    export const Dimension = (surface,prop,value) => [3, surface,prop,value]
    export const Align = (surface,prop,value) => [4, surface,prop,value]
    export const FlexWrap = (surface,value) => [5, surface,value]
    export const FlexDirection = (surface,value) => [6, surface,value]
    export const BackgroundColor = (surface,value) => [7, surface,value]
    export const Border = (surface,value) => [8, surface,value]
    export const BoxShadow = (surface,value) => [9, surface,value]
    export const TextColor = (surface,value) => [10, surface,value]
    export const BorderRadius = (surface,value) => [11, surface,value]
    export const Image = (surface,value) => [12, surface,value]
    export const Text = (surface,text) => [13, surface,text]
      
}
    
export module Dimension {
        
    export const Undefined = () => [0, ]
    export const Auto = () => [1, ]
    export const Points = (value) => [2, value]
    export const Percent = (value) => [3, value]
      
}
    
  