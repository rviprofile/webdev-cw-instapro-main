import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, likeListener } from "../index.js";

export function isActive (post) {
  if (post.isLiked === true) {
      return `like-active.svg`
  } else {
    return `like-not-active.svg`
  }
}

export function whoLikes (post) {
  if (post.likes.length === 1) {
    return `${post.likes[0].name}`
  }
  return post.likes.length > 0 ? 
  `${post.likes[0].name} и еще ${post.likes.length - 1}` :
   '0';
}

export let idUserHelper = ''

export function renderPostsPageComponent({ appEl }) {

  console.log("Актуальный список постов:", posts);
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

const ulPosts = posts.map((post, index) => {
  return `
                  <li class="post" id="${post.id}">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${post.user.imageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-postid="${post.id}" data-activelike="${post.isLiked}" class="like-button">
                        <img src="./assets/images/${isActive(post)}">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${whoLikes(post)}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      19 минут назад
                    </p>
                  </li>
  `
}).join("");

  const appHtml = `
                <div class="page-container">
                  <div class="header-container"></div>
                  <ul class="posts">
                  ${ulPosts}
                </div>
                <a href="#HighOfPage" class="button upper" style="text-align: center;
                text-decoration: none;
                margin: 30px;">Наверх</a>
    `
  appEl.innerHTML = appHtml;

  likeListener();

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      idUserHelper = userEl.dataset.userId
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
