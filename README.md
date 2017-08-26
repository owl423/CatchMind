# CatchMind

> Nuxt.js + Express + socket.io Project
> 주소 [CatchMind](http://13.124.142.223)

## Game Play Tip
1. 한번 사용했던 닉네임의 경우 서버가 재시작 될 때까지 사용 불가
2. 방을 만든 사람이 문제의 수를 지정할 수 있음
3. 한 문제당 주어진 시간은 180초
4. 180초가 지나면 자동으로 턴이 넘어감
5. 문제가 주어지고 60초가 지나면 턴을 넘길 수 있음
6. 게임이 시작되고 나면 그림판에는 출제자만 그림을 그릴 수 있음
7. 창의 크기를 변경할 경우 내 클라이언트에 그려진 그림이 전부 지워짐(다른 클라이언트의 그림은 남아있음)
8. 다른 클라이언트의 그림을 지우기 위해선 전체지우기 버튼을 클릭

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm start
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## Backpack

We use [backpack](https://github.com/palmerhq/backpack) to watch and build the application, so you can use the latest ES6 features (module syntax, async/await, etc.).
