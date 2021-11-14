use super::{Ctx, LayoutResult, NodeId, Size};
use crate::util::SlotMap;

impl Ctx<'_> {
    pub(super) fn compute_flex(
        &self,
        results: &mut SlotMap<NodeId, LayoutResult>,
        node: NodeId,
        parent_size: Size<f32>,
    ) {
        self.compute_block(results, node, parent_size);
    }
}

#[cfg(test)]
mod tests {
    use super::super::*;

    use Dimension::Px;
    use Display::*;

    #[test]
    fn flex_row_grow() {
        let (mut tree, root) = layout_tree! {
            (node(display = Flex, width = Px(300.), height = Px(10.))
                (node(flex_grow = 1.))
                (node(flex_grow = 2.))
            )
        };

        tree.calculate(root, 0., 0.);

        assert_eq!(
            tree.debug(root),
            stringify!(
                Flex(300.0, 10.0) [
                    Block(100.0, 10.0) [],
                    Block(200.0, 10.0) []
                ]
            )
        );
    }
}
