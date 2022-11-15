## 선행 설치 필요
1. Go: https://go.dev/doc/install
2. Ignite: https://docs.ignite.com/guide/install

## 컨트랙트 스크립트 실행 전 할 것
1. ysipd-chain 레포에서 ignite chain serve -> 로컬에 체인 실행
2. 해당 레포의 init.sh에 chmod +x ./init.sh로 실행권한 부여
3. bash ./init.sh로 키 생성 및 컨트랙트 store

## 실행 방법
1. main.js 실행: 컨트랙트 3개(token, ico, pair) 순서대로 instantiate 후 genesis account에 mint