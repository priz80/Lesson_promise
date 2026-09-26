// 1) Функция для получения данных (GET-запрос)
function getData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        });
}

// 2) Функция для отправки данных (POST-запрос)
function sendData(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        });
}

// 3) При загрузке страницы: получаем данные из db.json
// 4) После получения — отправляем их на jsonplaceholder
getData('./db.json')
    .then(localData => {
        console.log('Получено из db.json:', localData);

        // Преобразуем данные в формат поста для jsonplaceholder
        const postData = {
            title: `Пост пользователя ${localData.user}`,
            body: `Возраст: ${localData.age}, Роль: ${localData.role}`,
            userId: localData.age
        };

        console.log('Подготовленные данные для отправки:', postData);

        // Отправляем преобразованные данные на jsonplaceholder
        return sendData('https://jsonplaceholder.typicode.com/posts', postData);
    })
    .then(sentData => {
    console.log('Отправлено на jsonplaceholder:', sentData);
    
    // Показать ID на странице
    const info = document.createElement('p');
    info.textContent = `Пост создан с ID: ${sentData.id}`;
    document.body.appendChild(info);
})
    .catch(error => {
        console.error('Произошла ошибка:', error.message);
    });