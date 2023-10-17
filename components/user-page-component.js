
import { renderHeaderComponent } from "./header-component.js";
import { posts, likeListener } from "../index.js";
import { isActive, mentionUsers, whoLikes, findMentionUsers, postsHelper } from "./posts-page-component.js";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from "date-fns/locale";

export function renderUserPageComponent({ appEl }) {
    const userPosts = posts.map((post) => {
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
                            ${findMentionUsers(post.description)}
                          </p>
                          <p class="post-date">
                          ${formatDistanceToNow(parseISO(post.createdAt), {locale: ru})} назад
                          </p>
                        </li>
        `
      }).join("");
    
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
                    <img src="${posts[0].user.imageUrl}" class="posts-user-header__user-image">
                    <p class="posts-user-header__user-name">${posts[0].user.name}</p>
        </div>
        <p style="padding-bottom: 15px">@ ${posts[0].user.login}</p>
        <p style="padding-bottom: 15px">Всего фотографий: ${posts.length}</p>
      <ul class="posts">
      ${userPosts}
    </div>
    <a href="#HighOfPage" class="button upper" style="text-align: center;
    text-decoration: none;
    margin: 30px;">Наверх</a>
`
appEl.innerHTML = appHtml;

likeListener();
mentionUsers(postsHelper);

renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}