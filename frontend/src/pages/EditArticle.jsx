import { useContext } from "react";
import {
  redirect,
  useParams,
  useSubmit,
  useNavigation,
  useActionData,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchArticle, queryClient, updateArticle } from "../util/http";
import { UserContext } from "../context/UserContext";

import ArticleForm from "../components/features/articles/ArticleForm";
import FluidContainer from "../components/layout/FluidContainer";
import classes from "./AddNewArticle.module.css";

export default function AddNewArticle() {
  const { state } = useNavigation();
  const submit = useSubmit();
  const params = useParams();
  const actionData = useActionData();
  console.log("params from edit article", params);

  const { isAdmin, user } = useContext(UserContext);

  const { data, isError, error } = useQuery({
    queryKey: ["articles", params.articleId],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.articleId }),
    staleTime: 100000,
  });

  function handleSubmit(formData) {
    submit(formData, { method: "PUT" });
  }

  if (!user || !isAdmin) {
    return <p>Nie masz uprawnień do edytowania artykułów.</p>;
  }

  let content;

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
    console.log("data editArtcile", data);
    content = (
      <>
        <ArticleForm onSubmit={handleSubmit} inputData={data} />
        {state === "submitting" && <p>Wysyłanie...</p>}
        {actionData?.message && <p>{actionData.message}</p>}
        {actionData?.errors && (
          <ul>
            {Object.entries(actionData.errors).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <FluidContainer
      sectionId="section-edit-article"
      addedClasses={classes.addArticleContainer}
    >
      <h1>Edytuj artykuł</h1>

      {content}
    </FluidContainer>
  );
}

export function loader({ params }) {
  console.log("edit article Loader id:", params.articleId);
  return queryClient.fetchQuery({
    queryKey: ["articles", params.articleId],
    queryFn: ({ signal }) => fetchArticle({ signal, id: params.articleId }),
  });
}

export async function action({ request, params }) {
  console.log("edit article Action");
  const formData = await request.formData();
  console.log("formData", formData);
  const updatedArticleData = Object.fromEntries(formData);
  console.log("updatedArticleData", updatedArticleData);

  try {
    await updateArticle({ id: params.articleId, article: updatedArticleData });

    await queryClient.invalidateQueries(["articles"]);
    return redirect("/articles");
  } catch (error) {
    console.error("Error updating article:", error);
    console.error("Error updating article:", error.info.errors);
    return new Response(
      JSON.stringify({
        message: "Nie udało się zaktualizować artykułu.",
        errors: error.info?.errors || null,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
