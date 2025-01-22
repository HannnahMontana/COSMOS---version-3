import { useState, useContext } from "react";

import classes from "./ArticleForm.module.css";
import ClassicCKEditor from "../ClassicCKEditor.jsx";
import { UserContext } from "../../../context/UserContext";

export default function ArticleForm({ inputData = null, onSubmit }) {
  const [content, setContent] = useState(""); // CKEditor content
  const { user } = useContext(UserContext);

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.content = content;
    data.userId = user.id;

    onSubmit(data);
  }

  return (
    <form className={classes.addForm} onSubmit={handleSubmit}>
      <label htmlFor="title">Tytuł:</label>
      <input
        type="text"
        name="title"
        id="title"
        defaultValue={inputData?.title || ""}
        required
      />

      <label htmlFor="subtitle">Podtytuł:</label>
      <input
        type="text"
        name="subtitle"
        id="subtitle"
        defaultValue={inputData?.subtitle || ""}
        required
      />

      <label htmlFor="bannerUrl">Link Zdjęcia:</label>
      <input
        type="text"
        name="bannerUrl"
        id="bannerUrl"
        defaultValue={inputData?.banner_url || ""}
        required
      />

      <label htmlFor="content">Treść:</label>
      <ClassicCKEditor
        onChange={setContent}
        initialArticleContent={inputData?.content || ""}
      />

      <input
        type="submit"
        value="Dodaj"
        className={`btn btn-outline-light ${classes.submitBtn}`}
      />
    </form>
  );
}
