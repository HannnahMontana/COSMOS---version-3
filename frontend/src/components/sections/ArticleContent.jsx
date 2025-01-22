import parse from "html-react-parser";

import FluidContainer from "../layout/FluidContainer";
import classes from "./ArticleContent.module.css";

export default function ArticleContent({ content }) {
  return (
    <FluidContainer
      sectionId="section-article-content"
      addedClasses={classes.section}
    >
      {parse(content)}
    </FluidContainer>
  );
}
