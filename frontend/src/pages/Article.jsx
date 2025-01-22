import { useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import ArticleTitleSection from "./../components/sections/ArticleTitleSection";
import ArticleContent from "../components/sections/ArticleContent";
import { fetchArticle, deleteArticle, queryClient } from "../util/http";
import { UserContext } from "../context/UserContext";

import classes from "./Article.module.css";

export default function Article() {
  const { isAdmin } = useContext(UserContext);

  const params = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["articles", params.id],
    queryFn: ({ signal }) => fetchArticle({ signal, id: params.articleId }),
  });

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      console.log("deleted article SUCCESS");
      queryClient.invalidateQueries({
        queryKey: ["articles"],
        refetchType: "none",
      });

      console.log("navigating to /articles");

      navigate("/articles");
    },
  });

  const handleDelete = () => {
    mutate(params.articleId);
  };

  let content;

  if (isPending) {
    content = <p>Fetching event data...</p>;
  }

  if (isError) {
    content = (
      <p>
        Error:{" "}
        {error.info?.message ||
          "Failed to fetch event data, please try again later."}
      </p>
    );
  }

  if (data) {
    console.log("data", data);
    const formattedDate = new Date(data.created_at).toLocaleDateString(
      "pl-PL",
      {
        dateStyle: "long",
      }
    );

    content = (
      <>
        <ArticleTitleSection
          title={data.title}
          subtitle={data.subtitle}
          image={data.banner_url}
          altText={data.title}
          author={data.author}
          date={formattedDate}
        />
        {isAdmin && (
          <div className={`d-flex justify-content-end ${classes.actions}`}>
            <button
              className="btn btn-outline-light my-3"
              onClick={handleDelete}
            >
              Delete
            </button>
            <Link to="edit" className="btn btn-outline-light my-3 mx-2">
              Edit
            </Link>
          </div>
        )}
        {isPendingDeletion && <p>Deleting article...</p>}
        {isErrorDeleting && (
          <>
            <p>
              Error:{" "}
              {deleteError.info?.message ||
                "Nie udało się usunąć artykułu, spróbuj ponownie później."}
            </p>
            {deleteError.info?.errors && (
              <ul>
                {Object.entries(deleteError.info.errors).map(([key, value]) => (
                  <li key={key}>{value}</li>
                ))}
              </ul>
            )}
          </>
        )}
        <ArticleContent content={data.content} />
      </>
    );
  }

  return <>{content}</>;
}
