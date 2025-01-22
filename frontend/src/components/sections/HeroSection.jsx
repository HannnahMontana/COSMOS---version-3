import FluidContainer from "../layout/FluidContainer";
import arrowIcon from "./../../assets/arrow.svg";
import classes from "./HeroSection.module.css";

export default function HeroSection({ videoSrc, title, subtitle, linkTarget }) {
  return (
    <>
      <FluidContainer sectionId="section-title" addedClasses={classes.section}>
        <video autoPlay loop muted className={classes.titleVid}>
          <source src={videoSrc} type="video/mp4" />
          Twoja przeglądarka nie obsługuje odtwarzacza video.
        </video>

        <h1>{title}</h1>
        <h2>{subtitle}</h2>

        <a href={linkTarget}>
          <img src={arrowIcon} />
        </a>
      </FluidContainer>
    </>
  );
}
