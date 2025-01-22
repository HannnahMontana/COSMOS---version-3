import classes from "./FluidContainer.module.css";

export default function FluidContainer({
  sectionId,
  addedClasses = "",
  children,
}) {
  return (
    <section
      className={`container-fluid ${classes.fluidContainer} ${addedClasses}`}
      id={sectionId}
    >
      {children}
    </section>
  );
}
