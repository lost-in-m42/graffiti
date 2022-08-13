use crate::{
    convert::{container_style, layout_style},
    css::{Style, StyleResolver, StyleSheet},
    document::NodeEdge,
    layout::{self, LayoutEngine, LayoutResult, LayoutStyle, LayoutTree, Size},
    renderer::{ContainerStyle, Rect, RenderContext, Renderable},
    Document, NodeId, NodeType,
};
use once_cell::sync::Lazy;
use skia_safe::{
    textlayout::{FontCollection, Paragraph, ParagraphBuilder, ParagraphStyle, TextStyle},
    FontMgr, Paint,
};
use std::{cell::RefCell, collections::HashMap, rc::Rc};

// TODO: wrap Paragraph somehow because it is not Sync
unsafe impl Sync for Viewport {}

// interactive HTML/CSS area without being anyhow dependent on a window
// (if we had a window with <iframe> in it, there would be 2 viewports needed)
// it's a bit like WebView but without JS and without any browsing capabilities
#[derive(Debug)]
pub struct Viewport {
    size: (f32, f32),
    document: Rc<RefCell<Document>>,
    state: RefCell<ViewState>,
}

// needs to be updated before using
#[derive(Debug, Default)]
struct ViewState {
    resolved_styles: HashMap<NodeId, Style>,
    paragraphs: HashMap<NodeId, RefCell<Paragraph>>,
    layout_styles: HashMap<NodeId, LayoutStyle>,
    layout_results: Vec<LayoutResult>,
}

impl Viewport {
    pub fn new(size: (f32, f32), document: Rc<RefCell<Document>>) -> Self {
        Self {
            size,
            document,
            state: RefCell::new(ViewState::default()),
        }
    }

    pub fn size(&self) -> (f32, f32) {
        self.size
    }

    pub fn resize(&mut self, size: (f32, f32)) {
        self.size = size;
    }

    pub fn element_from_point(&self, _pos: (f32, f32)) -> Option<NodeId> {
        self.update();
        todo!()
    }

    pub fn node_rect(&self, _node: NodeId) -> Option<Rect> {
        self.update();
        todo!()
    }

    // TODO: move/click/drag/selection/...
    // pub fn scroll(&mut self, _pos: (f32, f32), _delta: (f32, f32)) {
    //     todo!()
    // }

    fn update(&self) {
        let doc = &self.document.borrow();
        self.state.borrow_mut().update(doc, self.size);
    }
}

impl ViewState {
    fn update(&mut self, doc: &Document, size: (f32, f32) /*, dirty_nodes */) {
        let sheets = doc
            .query_selector_all(Document::ROOT, "style")
            .map(|s| doc.text_content(s))
            .filter_map(|s| StyleSheet::parse(&s).ok())
            .collect::<Vec<_>>();

        let resolver = StyleResolver::new(doc, &UA_SHEET, &sheets);

        self.layout_results = vec![LayoutResult::default(); 100];

        self.layout_styles
            .insert(Document::ROOT, layout_style(&Style::parse("display: block").unwrap()));

        for node in doc.descendants(Document::ROOT) {
            match doc.node_type(node) {
                NodeType::Element => {
                    self.resolved_styles
                        .insert(node, resolver.resolve_style(node, doc.style(node), None));
                    self.layout_styles
                        .insert(node, layout_style(&self.resolved_styles[&node]));
                }
                NodeType::Text => {
                    self.paragraphs.insert(node, RefCell::new(create_para(doc.text(node))));
                    self.layout_styles.insert(node, LayoutStyle::default());
                }
                _ => {}
            }
        }

        let tree = LayoutData {
            document: doc,
            styles: &self.layout_styles,
            paragraphs: &self.paragraphs,
        };
        LayoutEngine::new().calculate(Size::new(size.0, size.1), &tree, &mut self.layout_results);
    }
}

// mutable reference to Viewport can be rendered
impl Renderable for Viewport {
    fn render(&self, ctx: &mut RenderContext) {
        // update first
        self.update();

        let doc = &self.document.borrow();
        let state = &*self.state.borrow();

        doc.visit(&mut |edge| match edge {
            NodeEdge::Start(node) => {
                // TODO: let rect = viewport.node_rect();
                let LayoutResult { pos: (x, y), size } = state.layout_results[node];
                let rect = Rect::new(x, y, x + size.width, y + size.height);

                match doc.node_type(node) {
                    NodeType::Document => ctx.open_container(rect, &ContainerStyle::default()),
                    NodeType::Element => ctx.open_container(rect, &container_style(&state.resolved_styles[&node])),
                    NodeType::Text => {
                        ctx.draw_text(rect, &*state.paragraphs[&node].borrow());
                        false
                    }
                }
            }
            NodeEdge::End => {
                ctx.close_container();
                false
            }
        })
    }
}

fn create_para(s: &str) -> Paragraph {
    let mut font_collection = FontCollection::new();
    font_collection.set_default_font_manager(FontMgr::new(), None);
    let paragraph_style = ParagraphStyle::new();
    let mut paragraph_builder = ParagraphBuilder::new(&paragraph_style, font_collection);
    let mut ts = TextStyle::new();
    ts.set_foreground_color(Paint::default());
    paragraph_builder.push_style(&ts);
    paragraph_builder.add_text(s);

    paragraph_builder.build()
}

struct LayoutData<'a> {
    document: &'a Document,
    styles: &'a HashMap<NodeId, LayoutStyle>,
    paragraphs: &'a HashMap<NodeId, RefCell<Paragraph>>,
}

impl LayoutTree for LayoutData<'_> {
    type NodeRef = NodeId;
    type Paragraph = RefCell<Paragraph>;

    fn root(&self) -> NodeId {
        Document::ROOT
    }

    fn children(&self, parent: NodeId) -> &[NodeId] {
        self.document.children(parent)
    }

    fn style(&self, node: NodeId) -> &LayoutStyle {
        &self.styles[&node]
    }

    fn paragraph(&self, node: NodeId) -> Option<&RefCell<Paragraph>> {
        self.paragraphs.get(&node)
    }
}

impl layout::Paragraph for RefCell<Paragraph> {
    fn measure(&self, max_width: f32) -> (f32, f32) {
        let mut para = self.borrow_mut();

        para.layout(max_width);

        return (f32::min(para.max_intrinsic_width(), para.max_width()), para.height());
    }
}

static UA_SHEET: Lazy<StyleSheet> = Lazy::new(|| StyleSheet::parse(include_str!("../resources/ua.css")).unwrap());