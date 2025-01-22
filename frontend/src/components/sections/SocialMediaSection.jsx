import FluidContainer from "../layout/FluidContainer";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { motion } from "framer-motion";
import classes from "./SocialMediaSection.module.css";

const SOCIAL_ICONS = [
  {
    id: 1,
    icon: FaFacebook,
    href: "https://www.facebook.com",
  },
  {
    id: 2,
    icon: FaInstagram,
    href: "https://www.instagram.com",
  },
  {
    id: 3,
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com",
  },
  {
    id: 4,
    icon: FaTwitter,
    href: "https://www.twitter.com",
  },
];

export default function SocialMediaSection({ titleText }) {
  return (
    <FluidContainer sectionId="section-social-media">
      <h2>{titleText}</h2>
      <div className={`row ${classes.socialIconsContainer}`}>
        {SOCIAL_ICONS.map(({ id, icon: Icon, href }) => {
          return (
            <motion.div
              className={`col-md-3 col-sm-6 ${classes.socialIconContainer}`}
              key={id}
              whileHover={{ scale: 1.2 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 10,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <a href={href} target="_blank" rel="noreferrer">
                <Icon className={classes.socialIcon} />
              </a>
            </motion.div>
          );
        })}
      </div>
    </FluidContainer>
  );
}
