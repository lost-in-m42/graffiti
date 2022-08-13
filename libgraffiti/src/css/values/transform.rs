use super::super::parsing::{sym, Parsable, Parser};
use std::fmt;

// TODO: other variants
#[derive(Debug, Clone, PartialEq)]
pub enum Transform {
    Translate(f32, f32),
    Scale(f32, f32),
    Rotate(f32),
}

impl Parsable for Transform {
    fn parser<'a>() -> Parser<'a, Self> {
        todo!()
        // let perc = || f32::parser() - sym("%");
        // let translate =
        //     (sym("translate") * sym("(") * perc() - sym(",") + perc() - sym(")")).map(|(x, y)| Self::Translate(x, y));
        // let scale = (sym("scale") * sym("(") * f32::parser() - sym(",") + f32::parser() - sym(")"))
        //     .map(|(x, y)| Self::Scale(x, y));
        // let rotate = sym("rotate") * sym("(") * f32::parser().map(Self::Rotate) - sym("deg") - sym(")");

        // translate | scale | rotate
    }
}

impl fmt::Display for Transform {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Translate(x, y) => write!(f, "translate({}, {})", x, y),
            Self::Scale(x, y) => write!(f, "scale({}, {})", x, y),
            Self::Rotate(deg) => write!(f, "rotate({}deg)", deg),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_transform() {
        // assert_eq!(
        //     Transform::parse("translate(10%, 20%)"),
        //     Ok(Transform::Translate(1., 2.))
        // );

        // assert_eq!(Transform::parse("scale(4, 3)"), Ok(Transform::Scale(4., 3.)));

        // assert_eq!(Transform::parse("rotate(90deg)"), Ok(Transform::Rotate(90.)));
    }
}