import AboutSection from "../components/sections/AboutSection";
import SocialMediaSection from "../components/sections/SocialMediaSection";
import classes from "./CommonStyles.module.css";

export default function About() {
  return (
    <>
      <h1 className={classes.pageHeading}>Poznaj nas lepiej</h1>
      <AboutSection title="O nas" />
      <SocialMediaSection titleText="Znajdź nas na mediach społecznościowych" />
    </>
  );
}
