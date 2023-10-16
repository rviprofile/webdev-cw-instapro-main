// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
// const personalKey = "prod";
const personalKey = "vladimir-rychkov";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

import { getUserFromLocalStorage } from "./helpers.js";
import { getToken } from "./index.js";

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function getPostsUser({token, id}) {
  return fetch(`${postsHost}/user-posts/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
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
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    // console.log(response.json());
    return response.json();
  });
}

// Отправляет запрос в /dislike
 export function fetchDisLike(postid) {
  return fetch(`${postsHost}/${postid}/dislike`, {
    method: "POST",
    headers: {
      Authorization: getToken(),
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
}

// Отправляет запрос в /like
export function fetchLike(postid) {
  return fetch(`${postsHost}/${postid}/like`, {
    method: "POST",
    headers: {
      Authorization: getToken(),
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
}

// Отправляет новый пост
export function addNewPost({description, imageUrl}) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: getToken(),
    },
    body: JSON.stringify({
      description: description,
      imageUrl: imageUrl,
    })
  })
    .then((response) => {
      console.log(response);
    })
}
