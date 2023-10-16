import { addNewPost, getPosts, uploadImage, fetchLike, fetchDisLike, getPostsUser} from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { idUserHelper, renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import { renderUserPageComponent } from "./components/user-page-component.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

export const getToken = () => {
  const token = user ? `Bearer ${user.user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // TODO: реализовать получение постов юзера из API
      page = LOADING_PAGE;
      console.log("Открываю страницу пользователя: ", data.userId);

      return getPostsUser({ token: getToken(), id: data.userId })
      .then((newPosts) => {
        page = USER_POSTS_PAGE;
        posts = newPosts;
        let id = data.userId
        renderApp(id);
      })
      .catch((error) => {
        console.error(error);
        goToPage(POSTS_PAGE);
      });

    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

export const renderApp = (data) => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        console.log("Добавляю пост...", { description, imageUrl });
        addNewPost({description, imageUrl})
        goToPage(POSTS_PAGE);
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    return renderUserPageComponent({
      appEl, 
      posts
    });
  }
};

export function likeListener() {
  // Находим лайки
  const likeElements = document.querySelectorAll(".like-button");
  // На каждый лайк 
  for (let like of likeElements) {
    // Вешаем слушатель клика
    like.addEventListener("click", (event) => {
      // Если лайк уже поставлен
      if (like.dataset.activelike === 'true') {
        // Делаем запрос к /dislike
        fetchDisLike(like.dataset.postid)
        .then(() => {
          // Если страница была POSTS_PAGE
          if (page === POSTS_PAGE) {
            // То обновляем страницу постов
            getPosts({ token: getToken() })
            .then((newPosts) => {
              posts = newPosts;
              renderApp();
            })
          // А если страница была USER_POSTS_PAGE
          } else {
            // То обновляем страницу пользователя
            getPostsUser({token: getToken(), id: idUserHelper})
            .then((newPosts) => {
              posts = newPosts;
              renderApp();
            })
          }
      })
      .catch((error) => {
        console.error(error);
      })
      // Если лайк еще не был поставлен
      } else {
        // Отправляем запрос к /like
        fetchLike(like.dataset.postid)
        .then(() => {
          // Если страница была POSTS_PAGE
          if (page === POSTS_PAGE) {
            // То обновляем страницу постов
            getPosts({ token: getToken() })
            .then((newPosts) => {
              posts = newPosts;
              renderApp();
            })
          // А если страница была USER_POSTS_PAGE
          } else {
            // То обновляем страницу пользователя 
            getPostsUser({token: getToken(), id: idUserHelper})
            .then((newPosts) => {
              posts = newPosts;
              renderApp();
            })
          }
        })
        .catch((Error) => {
          alert(Error);
        });
      }
    })
  }
}

goToPage(POSTS_PAGE);
