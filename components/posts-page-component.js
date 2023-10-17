import { USER_POSTS_PAGE } from '../routes.js';
import { renderHeaderComponent } from './header-component.js';
import { posts, goToPage, likeListener } from '../index.js';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

// Функция проверяет, есть ли в тексте упоминание пользователя.
// Если есть, то заменяет это слово на ссылку
export function findMentionUsers(text) {
  if (text.includes('@')) {
    let start = text.indexOf('@');
    let end = () => {
      if (text.indexOf(' ', text.indexOf('@')) == -1) {
        return;
      } else {
        return text.indexOf(' ', text.indexOf('@'));
      }
    };

    let linkString = text.slice(start, end());

    return text.replace(
      linkString,
      `<a style="color: blue" class="mention">${linkString}</a>`,
    );
  } else {
    return text;
  }
}

// Слушатель клика по упоминанию другого пользователя
export function mentionUsers(arr) {
  for (let mention of document.querySelectorAll('.mention')) {
    mention.addEventListener('click', () => {
      // let token = getToken();
      // let newarr = []
      // getPosts({token})
      // .then((responce) => {console.log(responce); newarr = responce})
      let id = arr.find(
        (post) => post.user.login == mention.innerHTML.slice(1),
      ).user.id;
      if (id === undefined) {
        return;
      }
      goToPage(USER_POSTS_PAGE, {
        userId: id,
      });
    });
  }
}

// Функция проверят был ли поставлен лайк, от результата меняет цвет лайка
export function isActive(post) {
  if (post.isLiked === true) {
    return `like-active.svg`;
  } else {
    return `like-not-active.svg`;
  }
}

// Функция принмает пост и возвращает строку с количеством лайков:
// "0", "Имя первого" или "Имя первого и еще сколько-то"
export function whoLikes(post) {
  if (post.likes.length === 1) {
    return `${post.likes[0].name}`;
  }
  return post.likes.length > 0
    ? `${post.likes[0].name} и еще ${post.likes.length - 1}`
    : '0';
}

export let idUserHelper = '';
export let postsHelper = [];

export function renderPostsPageComponent({ appEl }) {
  console.log('Актуальный список постов:', posts);

  // Клонируем массив постов, чтобы обратится к нему на странице конкретного пользователя
  postsHelper = posts;

  // Рендер страницы постов
  const ulPosts = posts
    .map((post) => {
      return `
                  <li class="post" id="${post.id}">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${
                          post.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-postid="${post.id}" data-activelike="${
                        post.isLiked
                      }" class="like-button">
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
                    ${formatDistanceToNow(parseISO(post.createdAt), {
                      locale: ru,
                    })} назад
                    </p>
                  </li>
  `;
    })
    .join('');

  const appHtml = `
                <div class="page-container">
                  <div class="header-container"></div>
                  <ul class="posts">
                  ${ulPosts}
                </div>
                <a href="#HighOfPage" class="button upper" style="text-align: center;
                text-decoration: none;
                margin: 30px;">Наверх</a>
    `;
  
  appEl.innerHTML = appHtml;

  // Слушатель лайков
  likeListener();
  // Упоминания
  mentionUsers(posts);

  // Рендер шапки
  renderHeaderComponent({
    element: document.querySelector('.header-container'),
  });

  // Слушатель клика по фотографии пользователя для перехода на его страницу
  for (let userEl of document.querySelectorAll('.post-header')) {
    userEl.addEventListener('click', () => {
      idUserHelper = userEl.dataset.userId;
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
