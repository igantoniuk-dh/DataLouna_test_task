# pro-skin

![logo](logo.jpeg "Title")

# Установка и запуск

## Установка 

```sh
git clone https://github.com/igantoniuk-dh/pro-skin.git
cd pro-skin
npm i
```
## Запуск

```sh
npm run migration:run
npm run build
npm run start
```

### Переменные окружения

[пример](https://github.com/igantoniuk-dh/DataLouna_test_task/blob/main/.env-sample)

с некорректно заданными переменными окружения приложение не запустится

## Тесты
### на данный момент обеспечен пакет базовых e2e-тестов
```sh
npm run test:e2e
```
## linter

заданые 2 строгих правила:
* длинна функций не должна превышать 30 строк
* грубина вложенности управляющих структур не должна превышать 2

## husky

* настроен на pre-push
* запускает  линтер
* прогоняет prettier, генерирует документацию и делает автокоммит

## Документация

### Проектная документация

#### диаграммы в mermaid

* [база данных](https://github.com/igantoniuk-dh/DataLouna_test_task/blob/main/doc/dbSchema.md)
* [получение и передача товаров](https://github.com/igantoniuk-dh/DataLouna_test_task/blob/main/doc/fetchItemsSchema.md)

* Для просмотра диаграмм рекомендуется установить расширение для  [vscode](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) или аналогичное для [jbrains IDE](https://plugins.jetbrains.com/plugin/20146-mermaid)

* также можно использовать [mermaid online](https://mermaid-js.github.io/mermaid-live-editor/)


### Автоматическая документация

* [swagger](http://localhost:3005/api)
* [typedoc](https://github.com/igantoniuk-dh/DataLouna_test_task/tree/main/doc)

* swagger,по умолчанию, запускается в dev режиме на порту 3005 
* документация typedoc может быть просмотрена через [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)







