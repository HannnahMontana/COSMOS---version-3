import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNewArticle,
  fetchCountArticlesAboveAverage,
  queryClient,
} from "../util/http";
import { UserContext } from "../context/UserContext";

import FluidContainer from "../components/layout/FluidContainer";
import ArticleForm from "../components/features/articles/ArticleForm";
import classes from "./AddNewArticle.module.css";
import commonClasses from "./CommonStyles.module.css";

export default function AddNewArticle() {
  const navigate = useNavigate();
  const { isAdmin, user } = useContext(UserContext);

  // articles above average
  const {
    data: articleCount,
    isLoading,
    isError: isCountError,
    error: countError,
  } = useQuery({
    queryKey: ["articlesAboveAverage", user?.id],
    queryFn: fetchCountArticlesAboveAverage,
    enabled: !!user?.id,
  });

  // create new article
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/articles");
    },
  });

  function handleSubmit(formData) {
    mutate(formData);
  }

  if (!user || !isAdmin) {
    return <p>Nie masz uprawnień do dodawania artykułów.</p>;
  }

  return (
    <section>
      <h1 className={commonClasses.pageHeading}>Dodaj nowy artykuł</h1>
      <FluidContainer
        sectionId="section-add-article"
        addedClasses={classes.addArticleContainer}
      >
        <p>
          {isLoading && "Ładowanie liczby artykułów powyżej średniej..."}
          {isCountError && `Błąd: ${countError.message}`}
          {articleCount !== undefined &&
            `Liczba artykułów powyżej średniej długości: ${articleCount}`}
        </p>
        <ArticleForm onSubmit={handleSubmit} />
        {isPending && <p>Wysyłanie...</p>}
        {isError && (
          <>
            <p>{error.message}</p>
            {error.info.errors && (
              <ul>
                {Object.entries(error.info.errors).map(([key, value]) => (
                  <li key={key}>{value}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </FluidContainer>
    </section>
  );
}
