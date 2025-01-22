import FluidContainer from "../layout/FluidContainer";
import { ABOUT_SECTIONS } from "./../../data/aboutSections";
import classes from "./AboutSection.module.css";

export default function AboutSection({ title }) {
  return (
    <FluidContainer sectionId="section-about">
      <h2>{title}</h2>
      <div className="row">
        {ABOUT_SECTIONS.map((section) => (
          <div
            className={`col-lg-6 ${classes.aboutBoxContainer}`}
            key={section.id}
          >
            {section.image ? (
              <img
                src={section.image}
                alt={section.altText}
                className={classes.image}
              />
            ) : (
              <>
                <h3>{section.header}</h3>
                <p>{section.text}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </FluidContainer>
  );
}
