minikube start

# установка секрета (пароля с именем для обращения)
kubectl create secret generic pgpassword --from-literal PGPASSWORD=1234
kubectl get secrets

# Подклюение Ingress-Inginx к Minikebe
minikube addons enable ingress
kubectl get pods -n ingress-nginx

# Подключение всех манифестов
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress/
kubectl apply -f k8s/kafka/
kubectl apply -f k8s/postgree/
kubectl apply -f k8s/redis/
kubectl apply -f k8s/user/



# Проверка
kubectl get pod
kubectl logs <номер-контейнера>

# Проверка постоянных томов
kubectl get pvc
kubectl get pv

# Запуск туннелирования Minikube
minikube tunnel  


## Для захода в Pod
kubectl exec -it <pod_name> -- /bin/bash 