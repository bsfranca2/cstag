#env /bin/bash

API_IMAGE=klinkbr/tempbruno:api2
ANALYZES_IMAGE=klinkbr/tempbruno:analyzes2
WEB_IMAGE=klinkbr/tempbruno:web2

./gradlew :api:bootBuildImage --imageName=$API_IMAGE
./gradlew :analyzes:bootBuildImage --imageName=$ANALYZES_IMAGE
cd frontend && npx yarn build && docker build -t $WEB_IMAGE .

docker push $API_IMAGE
docker push $ANALYZES_IMAGE
docker push $WEB_IMAGE