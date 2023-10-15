
import { renderHeaderComponent } from "./header-component.js";
import { posts, likeListener } from "../index.js";
import { isActive, whoLikes } from "./posts-page-component.js";

export function renderUserPageComponent({ appEl, data }) {

    const userPosts = posts.filter((post) => post.user.id === data);
    const userImage = userPosts[0].user.imageUrl;
    const userName = userPosts[0].user.name;
    const userLogin = userPosts[0].user.login;

    const ulPosts = userPosts.map((post, index) => {
        return `
                        <li class="post" id="${post.id}">
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
      <div class="posts-user-header">
                    <img src="${userImage}" class="posts-user-header__user-image">
                    <p class="posts-user-header__user-name">${userName}</p>
        </div>
        <p style="padding-bottom: 15px">@ ${userLogin}</p>
        <p style="padding-bottom: 15px">Всего фотографий: ${userPosts.length}</p>
      <ul class="posts">
      ${ulPosts}
    </div>
`
appEl.innerHTML = appHtml;

likeListener();

renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}