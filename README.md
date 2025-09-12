# User Management REST API

## Описание

Этот проект — учебный REST API для управления пользователями. Реализован на TypeScript с использованием Express, TypeORM и PostgreSQL. Система поддерживает регистрацию, авторизацию, роли пользователей (админ/пользователь), смену статуса, а также защищённые маршруты.

## Возможности

- Регистрация нового пользователя
- Авторизация (JWT, cookie)
- Получение информации о пользователе
- Получение списка всех пользователей (только для админа)
- Смена статуса пользователя (active/blocked)
- Выход из системы

## Технологии

- Node.js, TypeScript
- Express
- TypeORM
- PostgreSQL
- JWT (jsonwebtoken)
- class-validator, class-transformer
- cookie-parser
- dotenv

## Быстрый старт

1. Установите зависимости:
   ```
   npm install
   ```

2. Настройте переменные окружения в `.env`:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=testDB
   JWT_SECRET=your_jwt_secret
   ```

3. Запустите сервер в режиме разработки:
   ```
   npm run dev
   ```

4. Сервер будет доступен на `http://localhost:3000`.

## Структура API

- `POST /api/users/signup` — регистрация
- `POST /api/users/login` — вход
- `POST /api/users/logout` — выход
- `GET /api/users/:id` — получить пользователя (требуется авторизация)
- `GET /api/users/` — получить всех пользователей (только админ)
- `PATCH /api/users/:id/toggle-status` — сменить статус пользователя

## Примечания

- Для доступа к защищённым маршрутам требуется авторизация (JWT в cookie).
- Только админ может видеть список всех пользователей и менять статус других пользователей.
- Пароли хранятся в базе в виде хеша.
