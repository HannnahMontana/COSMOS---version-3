import FluidContainer from "../layout/FluidContainer";
import classes from "./ArticleTitleSection.module.css";

export default function ArticleTitleSection({
  title,
  subtitle,
  image,
  altText,
  author,
  date,
}) {
  return (
    <>
      <FluidContainer
        sectionId="section-article-title"
        addedClasses={classes.section}
      >
        {/* <div className={classes.articleTitleBg}></div> */}
        <img src={image} alt={altText} className={classes.articleBanner} />

        <h1>{title}</h1>
        <h2>{subtitle}</h2>
      </FluidContainer>

      <div className={classes.metadata}>
        <div className={classes.author}>{author}</div>
        <div className={classes.date}>{date}</div>
      </div>
    </>
  );
}
