import { QueryClient } from "@tanstack/react-query";
import { getAuthToken } from "./auth";

export const queryClient = new QueryClient();

export async function fetchArticles({ signal, limit, offset }) {
  let url = "http://localhost:8080/articles";

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

  const response = await fetch(`http://localhost:8080/articles/${id}`, {
    signal,
  });

  console.log("response", response);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the article");
    error.code = response.status;
    error.info = await response.json();
    console.log("error", error);
    console.log("errors in fetch article");
    throw error;
  }

  const articleList = await response.json();

  return articleList[0];
}

export async function createNewArticle(articleData) {
  const token = getAuthToken();

  const response = await fetch(`http://localhost:8080/articles`, {
    method: "POST",
    body: JSON.stringify(articleData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
  const token = getAuthToken();

  console.log("updateArticle id", id, article);

  const response = await fetch(`http://localhost:8080/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify({ article }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("response from http.js updateArticle", response);

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
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
  const token = getAuthToken();

  console.log("deleting article id", id);

  const response = await fetch(`http://localhost:8080/articles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

export async function fetchUserData(token) {
  try {
    const response = await fetch("http://localhost:8080/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych użytkownika.");
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchUsernameById(id) {
  try {
    console.log("fetching username for id", id);

    const response = await fetch(`http://localhost:8080/users/${id}/username`);

    console.log("response", response);

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania nazwy użytkownika.");
    }

    const data = await response.json();

    console.log("data", data);
    return data.username;
  } catch (error) {
    console.error(error);
    return null;
  }
}
