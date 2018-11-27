/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', () => {
  getAndRendersCookies();
});

const getAndRendersCookies = () => {
  const filterValue = filterNameInput.value;
  let cookies = [];

  if(!filterValue) {
    cookies = getCookies();
  } else {
    cookies = getFiltersCookies(filterValue);
  }

  renderCookies(cookies);
};

const addCookiesBrowser = (name, value) => {
  document.cookie = `${name}=${value}`;
};

const getCookies = () => {
  const cookieArrays = document.cookie.split('; ');

  return cookieArrays.reduce((prev, elem) => {
    const[name, value] = elem.split('=');
    
    if(name) prev.push({ name, value });
    return prev;
  }, []);
};

const deleteCookie = name => {
  const data = new Date(0);

  document.cookie = `${name}=;expires=${data.toUTCString()}`;
};

const getFiltersCookies = value => {
  const cookies = getCookies();

  return cookies.filter(cookie => isMatching(cookie.name, value) || isMatching(cookie.value, value));
};

const renderCookies = cookies => {
  listTable.innerHTML = '';

  cookies.forEach(cookie => {
    const row = document.createElement('tr');
    const cellName = document.createElement('td');
    const cellValue = document.createElement('td');
    const cellButton = document.createElement('td');
    const button = document.createElement('button');

    cellName.textContent = cookie.name;
    cellValue.textContent = cookie.value;
    button.textContent = 'удалить';
    button.setAttribute('data-name', cookie.name);
    
    cellButton.appendChild(button);
    row.appendChild(cellName);
    row.appendChild(cellValue);
    row.appendChild(cellButton);

    listTable.appendChild(row);
  });
};

addButton.addEventListener('click', () => {
  const name = addNameInput.value;
  const value = addValueInput.value;

  addCookiesBrowser(name, value);
  getAndRendersCookies();

  addNameInput.value = '';
  addValueInput.value = '';
});

function isMatching(full, chunk) {
  const string = full.toLowerCase();
  const subString = chunk.toLowerCase();

  if(string.indexOf(subString) != -1) {
    return true;
  }

  return false;
}

listTable.addEventListener('click', e => {
  if(e.target.tagName !== 'BUTTON') return;

  const name = e.target.getAttribute('data-name');
  deleteCookie(name);
  e.target.closest('tr').remove();
});
