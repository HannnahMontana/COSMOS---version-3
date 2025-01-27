import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function fetchArticles({ signal, limit, offset }) {
  let url = "http://localhost:8080/Articles";

  if (limit && offset) {
    url += "?limit=" + limit + "&offset=" + offset;
  } else if (limit) {
    url += "?limit=" + limit;
  } else if (offset) {
    url += "?offset=" + offset;
  }

  const response = await fetch(url, { signal: signal });

  console.log("response", response);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching articles");
    error.code = response.status;
    error.info = await response.json();
    console.log("error", error);
    console.log("error.info", error.info);
    throw error;
  }

  return response.json();
}

export async function fetchArticle({ id, signal }) {
  console.log("fetching article id", id);

  const response = await fetch(`http://localhost:8080/Articles/${id}`, {
    signal,
  });

  console.log("response from fetchARticle", response);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the article");
    error.code = response.status;
    error.info = await response.json();
    console.log("error", error);
    console.log("errors in fetch article");
    throw error;
  }

  return response.json();
}

export async function createNewArticle(articleData) {
  console.log("articleData", articleData);

  const response = await fetch(`http://localhost:8080/Articles/add`, {
    method: "POST",
    body: JSON.stringify(articleData),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    const error = new Error(
      errorData.message || "Wystąpił błąd podczas dodawania artykułu."
    );
    error.code = response.status;
    error.info = errorData;
    console.log("error z http info", error.info);
    throw error;
  }

  const { article } = await response.json();

  return article;
}

export async function updateArticle({ id, article }) {
  console.log("updateArticle id", id, article);

  const response = await fetch(`http://localhost:8080/Articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(article),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  console.log("response from http.js updateArticle", response);

  if (!response.ok) {
    const errorData = await response.json();
    console.log("error data", errorData);
    const error = new Error(
      errorData.message || "Wystąpił błąd podczas edycji artykułu."
    );
    error.code = response.status;
    error.info = errorData;
    console.log("error z http info", error.info);
    throw error;
  }

  return response.json();
}

export async function deleteArticle(id) {
  console.log("deleting article id", id);

  const response = await fetch(`http://localhost:8080/Articles/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  console.log("response from http.js deleteArticle", response);

  if (!response.ok) {
    console.log("response from http.js delete not ok");
    const errorData = await response.json();
    console.log(errorData);
    const error = new Error(
      errorData.message || "Wystąpił błąd podczas usuwania artykułu."
    );
    error.code = response.status;
    error.info = errorData;
    console.log("error z http info", error.info);
    throw error;
  }

  console.log("response from http.js delete ok");

  return response.json();
}

export async function fetchSession() {
  try {
    console.log("fetching session");
    const response = await fetch("http://localhost:8080/Auth/check-auth", {
      method: "GET",
      credentials: "include",
    });

    console.log("response", response);
    if (response.ok) {
      console.log("Session valid");
      return true;
    } else {
      console.log("Session not valid");
      return false;
    }
  } catch (error) {
    console.error("Error during session check:", error);
    return false;
  }
}

export async function fetchUserData() {
  try {
    const response = await fetch("http://localhost:8080/User/current-user", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych użytkownika.");
    }

    const userData = await response.json();
    console.log("userData from fetchUserData", userData);
    return userData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function logout() {
  try {
    const response = await fetch("http://localhost:8080/Auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Błąd podczas wylogowywania.");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function fetchCountArticlesAboveAverage({ queryKey }) {
  const [, userId] = queryKey;
  try {
    console.log(
      `Fetching articles count above global average for user: ${userId}`
    );

    const response = await fetch(
      `http://localhost:8080/Articles/articles-above-average/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Response data:", data);
      return data.articleCount;
    } else {
      console.error(
        "Failed to fetch articles count:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error while fetching articles count:", error);
    return null;
  }
}
