
<!--
백엔드용 README 템플릿
-->
# 프로젝트명 + 용도 (작성 필요)
<!-- 이 저장소가 어느 프로젝트의 어떤 역할을 하는 저장소인지 적어주세요 -->
<!--
ex)
비트코인은행 백엔드 서버
--> 상상마루 백엔드 서버 - Play License
## 🎠️ Play License는 공연 저작물 라이센스 마켓입니다.
> 공연 저작물 중개를 통해 저작권을 보호함으로써 **건강한 산업 환경을 조성**하고, **다양한 콘텐츠 제작에 기여**하고자 합니다.
## 언어
<!-- 이 저장소의 코드의 언어와 그 버전, 패키지 매니저 정보를 적어주세요 -->
<!--
ex1)
Python 3.6 이상
pip 19.3.1 이상
-->
<!--
ex2)
nodejs 12.12 이상
TypeScript 3.5 이상
yarn 1.19.1 이상
-->
TypeScript 4.0 이상
## 구성
<!-- 이 저장소의 코드의 전체적인 구성을 적어주세요 -->
<!--
ex1)
Django와 django-rest-framework 기반으로 작성됨
`./bank` 디렉토리에 설정 및 `wsgi.py` 파일이 있음
테스트 케이스는 각 app의 `test.py` 파일에 있음
기동을 위해 uwsgi와 nginx를 필요로 함
-->
<!--
ex2)
nest.js 기반으로 작성됨
기동을 위해 pm2와 nginx를 필요로 함
-->
TS기반의 Nest.js로 작성이 됨. Express.js위에서 돌아감

## Database and cache
<!-- 이 저장소의 코드를 기동하기 위해 필요한 DB와 cache 서비스를 적어주세요 -->
<!--
ex) MySQL 5.0 이상
ex) PostgresSQL 11 이상
ex) RDS에서 PostgresSQL 10 호환
ex) 로컬 서버에 memcached를 구축해야 함
ex) AWS elasticache
-->
MySQL 5.0 이상
## 환경
<!-- 이 저장소의 코드를 기동하기 위해 필요한 환경을 적어주세요. -->
<!--
ex1)
Ubuntu 18.04 기반의 로컬 서버
nginx 세팅
-->
<!--
ex2)
Ubuntu 18.04 기반의 로컬 서버
Docker 세팅
docker-compose 세팅
만들어진 Docker image를 보관할 hub 필요
-->
<!--
ex3)
AWS EC2
AWS S3
AWS IAM
AWS CloudFront
-->

1. Ubuntu 18.04 기반의 로컬 서버
2. nginx 세팅
3. Docker 세팅
4. docker-compose 세팅
5. 만들어진 Docker image를 보관할 hub 필요


## 로컬 개발 방법
<!-- 개발자가 해당 소스를 로컬에서 테스트하기 위해 필요한 절차를 적어주세요 -->
<!--
ex1) Python
1. virtualenv를 하나 만듭니다
2. `pip install -r requirements.txt`
3. `bank/settings.py` 파일을 로컬 환경에 맞게 수정해주세요.
4. `python manage.py migrate`를 통해 DB를 생성합니다
5. `python manage.py runserver`를 하면 개발 서버가 기동됩니다
-->
<!--
ex2) nodejs
1. `yarn install`
2. `config.js` 파일을 로컬 환경에 맞게 수정해주세요.
3. 설정한 DBMS에 `schema.sql` 파일을 실행해주세요.
4. `yarn start`를 하면 개발 서버가 기동됩니다
-->
1. `yarn install or npm install`
2. development.env 환경변수 수정
3. `yarn start:dev or npm run start:dev`
## 배포 방법
<!-- 개발자가 이 소스를 실서비스에 적용하기 위해 필요한 절차를 적어주세요 -->
<!--
ex1)
1. `ssh ubuntu@aa.bbb.c.ddd` 로 서버에 접속합니다. (비밀번호: xxx)
2. `cd coinbank`
3. `git pull`
4. `sudo systemctl restart nginx`
-->
<!--
ex2)
1. 로컬에서 `docker build --tag xxx/yyy:latest` 해주세요
2. 로컬에서 `docker push xxx/yyy:latest` 해주세요 (비밀번호: xxx)
3. `ssh ubuntu@aa.bbb.c.ddd` 로 서버에 접속합니다. (비밀번호: xxx)
4. `cd coinbank`
3. `docker pull xxx/yyy:latest`
4. `docker-compose up -d`
-->
<!--
ex3)
1. 로컬에서 `docker build --tag xxx/yyy:latest` 해주세요
2. 로컬에서 `docker push xxx/yyy:latest` 해주세요 (비밀번호: xxx)
3. AWS 콘솔에서 ECS로 들어갑니다
4. 새 revisions을 생성합니다
5. 만들어진 revision을 현재 서비스에 반영합니다. (문제 발생시 force deploy에 체크)
-->
1. 로컬에서 `docker build -t wmc1415/sangsang_maru_server:version ./`
2. 로컬에서 `docker push wmc1415/sangsang_maru_server:version` 
3. ssh EC2 우분투 환경에 접속.
4. `cd sangsang_maru_server`
5. `docker pull wmc1415/sangsang_maru_server:version`
6. `docker-compose up -d`
## 배포 관련 계정 정보
<!-- 배포에 관련해서 필요한 계정 정보를 적어주세요 -->
<!--
ex1)
cafe24
ID: coinbank11
PW: xxxxx
-->
<!--
ex2)
AWS
ID: coinbank11
PW: xxxxx
-->
AWS로 배포
## 실서비스 확인용 계정 정보
<!-- 본 코드가 배포된 실서비스에서 장애가 있을 시 상황을 확인하기 위해서, 실서비스에 남아있는 테스트용 계정 정보를 적어주세요 -->
<!--
ex)
관리자계정
ID: admindev
PW: xxxxxxxx
-->
(작성 필요)
## 기타 관련 계정 정보
<!-- 기타, 본 서비스 관련해서 필요한 계정 정보를 적어주세요 -->
<!--
ex)
Sentry
ID: coinbank11
PW: xxxxx
-->
(작성 필요)
## 체크리스트
<!-- 아래 항목 중 확인이 완료된 부분은 `[x]`로 수정해주세요. -->
- [ ] GPL, AGPL등의 전염성 라이선스로 인해 소스코드를 공개해야하는지 확인이 끝났습니다.
- [x] `.editorconfig` 등의 협업 관련 설정을 정리해두었습니다.
- [ ] 추후 다른 개발자가 코드를 보게 되더라도 곤란하지 않게 적절한 주석과 문서화를 해두었습니다.
- [ ] 저장소의 코드를 띄우기 위해 필요한 DB Schema 내지는 Migration이 포함되어있습니다.
- [ ] 저장소의 코드를 띄우기 위해 필요한 최소한의 더미데이터 SQL이 포함되어 있습니다.
- [ ] 저장소의 코드를 배포하기 위한 키 파일 등의 보안 자료가 안전하게 공유되었습니다.

