# web
```yaml
apiVersion: apps/v1  
kind: Deployment  
metadata:  
  name: xiaoyou-management
  namespace: xiaobei
  labels:
    app: xiaoyou-management
spec:  
  replicas: 1
  selector:  
    matchLabels:  
      app: xiaoyou-management 
  template:  
    metadata:  
      labels:  
        app: xiaoyou-management  
    spec:  
      containers:  
      - name: xiaoyou-management
        image: registry.iyunxin.management:1.0.0
        imagePullPolicy: Always 
        ports:  
        - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: xiaoyou-management
  namespace: xiaobei
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30007
  selector:
    app: xiaoyou-management


```
