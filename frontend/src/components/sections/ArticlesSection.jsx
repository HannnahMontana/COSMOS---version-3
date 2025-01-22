import { useInfiniteQuery } from "@tanstack/react-query";
import ArticleItem from "../features/articles/ArticleItem";
import FluidContainer from "../layout/FluidContainer";
import { fetchArticles } from "../../util/http";

import classes from "./ArticlesSection.module.css";

export default function ArticlesSection() {
  const LIMIT = 6;

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["articles"],
    queryFn: ({ pageParam = 0 }) =>
      fetchArticles({ offset: pageParam, limit: LIMIT }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length * LIMIT : undefined;
    },
    staleTime: 1000 * 60 * 2,
  });

  const articles = data?.pages.flatMap((page) => page.articles) || [];

  let content;

  if (isLoading) {
    content = <p>Ładowanie...</p>;
  }

  if (isError) {
    content = <p>{error.info?.message || "Failed to fetch articles."}</p>;
  }

  if (articles.length > 0) {
    content = (
      <div className="row">
        {articles.map((article) => (
          <ArticleItem key={article.id} article={article} />
        ))}
      </div>
    );
  } else {
    content = <p>Brak artykułów do wyświetlenia.</p>;
  }

  return (
    <FluidContainer sectionId="section-articles" addedClasses={classes.section}>
      {content}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className={classes.moreBtn}
        >
          {isFetchingNextPage ? "Ładowanie..." : "Więcej"}
        </button>
      )}
    </FluidContainer>
  );
}
