// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "prod";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

import { getToken } from "./index.js";

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  })
  .then((response) => {
    console.log(response);
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function likeListener(posts) {
    const likeElements = document.querySelectorAll(".like-button");
  
    for (let like of likeElements) {
      like.addEventListener("click", (event) => {

        console.log(`${like.dataset.postid}`);
        console.log(getToken());

        fetch(`${postsHost}/${like.dataset.postid}/like`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        .then((response) => {
          // Если статус ответа не 401, переводим ответ из формата json
          if (response.status === 401) {
            throw new Error("Для этого нужна авторизация");
          } else {
            return response.json();
          }
        })
        .then(() => {
          goToPage(POSTS_PAGE);
        })
        .catch((Error) => {
          alert(Error);
        });
      })
    }
}