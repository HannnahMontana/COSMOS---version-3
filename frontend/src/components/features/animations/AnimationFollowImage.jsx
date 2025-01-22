import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import classes from "./AnimationFollowImage.module.css";

export default function AnimationFollowingImage({ imgUrl, imgSize }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.pageX, y: e.pageY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div className={classes.animationContainer}>
      <motion.img
        style={{ width: `${imgSize}px` }}
        src={imgUrl}
        animate={{
          x: mousePosition.x - imgSize / 2,
          y: mousePosition.y - imgSize / 2,
        }}
        transition={{ type: "spring", damping: 13, mass: 1.4, stiffness: 100 }}
      />
    </motion.div>
  );
}
