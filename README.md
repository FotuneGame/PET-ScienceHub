# Краткий гайд, как сделать микросервисное приложение
> Предварительно установите Docker Desktop и wsl
> kubectl: https://kubernetes.io/ru/docs/tasks/tools/install-kubectl/ 
> minikube: https://kubernetes.io/ru/docs/tasks/tools/install-minikube/
>>Так же возможна настройка переменных окружения PATH для windows, (путь до minikube.exe): https://www.youtube.com/watch?v=TAM-DLPX9XA


### Запуск minicube 
```
minikube start --memory 2512 --cpus 3
```

### Установка секрета (пароля с именем для обращения)
```
kubectl create secret generic pgpassword --from-literal PGPASSWORD=1234
kubectl create secret generic mailpassword --from-literal MAILPASSWORD=key
kubectl create secret generic phonepassword --from-literal PHONEPASSWORD=key
kubectl create secret generic githubpassword --from-literal GITHUBPASSWORD=key
kubectl create secret generic googlepassword --from-literal GOOGLEPASSWORD=key
kubectl get secrets
```

### Подклюение Ingress-Inginx к Minikebe
```
minikube addons enable ingress
kubectl get pods -n ingress-nginx
```

### Подключение манифестов доп ПО 
```
kubectl apply -f k8s/ingress/
kubectl apply -f k8s/kafka/
kubectl apply -f k8s/postgree/
kubectl apply -f k8s/redis/
```

### Подключение манифестов собственного ПО 
После запуска доп ПО.
```
kubectl apply -f k8s/relationship/
kubectl apply -f k8s/scientist/
kubectl apply -f k8s/publisher/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/reserve/
kubectl apply -f k8s/article/
kubectl apply -f k8s/product/
kubectl apply -f k8s/basket/
kubectl apply -f k8s/chats/
kubectl apply -f k8s/logs/
kubectl apply -f k8s/user/
```


### Проверка
```
kubectl get pods
kubectl get deployments
kubectl get svc
kubectl get jobs 
kubectl logs <номер-контейнера>
```

### Проверка постоянных томов
```
kubectl get pvc
kubectl get pv
```

### Запуск туннелирования Minikube
```
minikube tunnel  
```
или
```
minikube service my-ingress --url
```

#### Для захода в Pod в интерактивном режиме
Если захотелось зайти в контейнер и выполнить, например тесты...
```
kubectl exec -it <pod_name> -- /bin/bash 
```

#### Важное
1) При развертке для кажого микросервиса настроить свою бд
2) Если pg-job-create-db : Error, то базы данных созданы