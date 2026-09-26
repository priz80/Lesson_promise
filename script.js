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

// 2) Функция для отправки данных (POST-запрос через fetch)
function sendData(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            // 204 - нет контента, но запрос успешен
            if (response.status === 204) {
                return { success: true, status: 204 };
            }
            return response.json();
        });
}

// 3) Функция для отправки данных (POST-запрос через XMLHttpRequest)
function sendDataXHR(url, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (xhr.status === 204) {
                        resolve({ success: true, status: 204 });
                    } else {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (e) {
                            reject(new Error('Ошибка парсинга ответа'));
                        }
                    }
                } else {
                    reject(new Error(`HTTP error: ${xhr.status}`));
                }
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Ошибка сети'));
        };
        
        xhr.send(JSON.stringify(data));
    });
}

// 4) При загрузке страницы: получаем данные из db.json
// 5) После получения — отправляем их на jsonplaceholder
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

        // Отправляем данные через XMLHttpRequest
        return sendDataXHR('https://jsonplaceholder.typicode.com/posts', postData);
    })
    .then(sentData => {
        console.log('Ответ сервера:', sentData);
        
        // Показать результат на странице
        const info = document.createElement('p');
        if (sentData.status === 204) {
            info.textContent = 'Данные отправлены (статус 204 - No Content)';
        } else {
            info.textContent = `Пост создан. ID: ${sentData.id}`;
        }
        document.body.appendChild(info);
    })
    .catch(error => {
        console.error('Произошла ошибка:', error.message);
    });
