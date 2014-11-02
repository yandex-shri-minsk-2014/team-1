#%Крутое название%

![David](https://david-dm.org/yandex-shri-minsk-2014/team-1.png)

## Как запустить:

 Из папки проекта:

* `npm install`  -- устанавливаем все зависимости из package.json
* `bower install` -- устанавливаем все зависимости из bower.json
* `npm run make` -- запускаем сборщик gulp
* `node server.js` -- запускаем сервер (http и websocket). Если нужен автоматический перезапуск сервера после изменения файлов проекта (предварительно устанавливаем): `npm install -g supervisor` и запускаем: `supervisor server.js`

## Структура проекта:

`blocks/` -- frontend-часть. Весь клиентский код (html, css, js) пишем в соответствующие блоки
`config/` -- основные настройки проекта (в данный момент -- номера http и websocket портов)
`server/` -- backend. Содержит описания сущностей (user, document) и логику обработки запросов.
