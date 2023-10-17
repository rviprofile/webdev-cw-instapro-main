import { goToPage, logout } from '../index.js';
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE, USER_POSTS_PAGE } from '../routes.js';
4;
import { getUserFromLocalStorage } from '../helpers.js';

export function renderHeaderComponent({ element }) {
  let user = getUserFromLocalStorage();
  element.innerHTML = `
  <a name="HighOfPage"></a>
  <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      ${
        user
          ? `<div title="Добавить пост" class="add-post-sign"></div>`
          : 'Войти'
      }
      </button>
      ${
        user
          ? `<button title="${
              user.user.login
            }" class="header-button logout-button">
          ${
            user
              ? `<img src="${user.user.imageUrl}" data-id="${user.user._id}" class="post-header__user-image your_page">`
              : ''
          }Выйти</button>`
          : ''
      }  
  </div>
  
`;

  element
    .querySelector('.add-or-login-button')
    .addEventListener('click', () => {
      if (user != null) {
        goToPage(ADD_POSTS_PAGE);
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  element.querySelector('.logo').addEventListener('click', () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector('.logout-button')?.addEventListener('click', logout);

  element.querySelector('.your_page')?.addEventListener('click', (event) => {
     event.stopPropagation();
     goToPage(USER_POSTS_PAGE, {
      userId: element.querySelector('.your_page').dataset.id,
    });
  })

  return element;
}
