import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import classes from "./ArticleItem.module.css";

export default function ArticleItem({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className={`col-lg-4 col-md-6 ${classes.boxContainer}`}
    >
      <div className={classes.boxImage}>
        <img
          className={classes.articleImage}
          src={article.banner_url}
          alt={article.title}
        />
      </div>
      <h3>{article.title}</h3>
    </Link>
  );
}
