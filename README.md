[![Tests for sprint 13](https://github.com/Kudenikov/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/Kudenikov/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests for sprint 14](https://github.com/Kudenikov/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/Kudenikov/express-mesto-gha/actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд

**Функционал:** создание базы данных пользователей и фотокарточек, обработка запросов, обработка возможных ошибок, авторизация пользователей.
Сайт разработан в качестве проектной работы в рамках изучения фреймворка ***Express.js***.

В проекте применяются следующие технологии. Для хранения данных пользователей и фотокарточек используется нереляционная база данных ***MongoDB***. После авторизации пользователю выдается ***токен***, действительный 1 неделю. По истечению срока необходимо снова авторизоваться. Пароль пользователя хранится в базе данных в зашифрованном виде. Реализована валидация данных перед их обработкой контроллером с использованием библиотеки ***Joi/celebrate***, организована централизованная обработка ошибок.
