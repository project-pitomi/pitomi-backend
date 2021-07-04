# pitomi-backend

#### Sample k8s manifests

##### secret.yaml

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-pitomi-backend
  namespace: hitomi
type: Opaque
data:
  username: <<username>>
  password: <<password>>
  secret: <<secret>>
  mongodb: <<mongodb connection string>>
  azureStorageAccountEndpoint: <<azure storage account endpoint>>
  azureStorageAccountAccount: <<azure storage account account>>
  azureStorageAccountAccountKey: <<azure storage account accountkey>>
  azureStorageAccountSASToken: <<azure storage account SAS>>

```

`<<username>>` username to login

`<<password>>` password to login

`<<secret>>` random string

`<<mongodb connection string>>` something like `"mongodb://~"`

`<<azure storage account endpoint>>` something like `"https://blahblah.blob.core.windows.net"` 

`<<azure storage account SAS>>`something like `"?sv=2020-02-blah&foo=bar"`



##### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pitomi-backend
  labels:
    app: pitomi-backend
  namespace: hitomi
spec:
  replicas: 1
  selector:
    matchLabels:
      app: pitomi-backend
  template:
    metadata:
      labels:
        app: pitomi-backend
    spec:
      containers:
      - name: pitomi-backend
        image: <<Image>>
        ports:
        - containerPort: 4000
        env:
        - name: PITOMI_MONGO_CONNECTION_STRING
          valueFrom:
            secretKeyRef:
              name: secret-pitomi-backend
              key: mongodb
        - name: PITOMI_SECRET
          valueFrom:
            secretKeyRef:
              name: secret-pitomi-backend
              key: secret
        - name: PITOMI_AZURE_STORAGE_ACCOUNT_ENDPOINT
          valueFrom:
            secretKeyRef:
              name: secret-pitomi-backend
              key: azureStorageAccountEndpoint
        - name: PITOMI_AZURE_STORAGE_ACCOUNT_ACCOUNT
          valueFrom:
            secretKeyRef:
              name: secret-pitomi-backend
              key: azureStorageAccountAccount
        - name: PITOMI_AZURE_STORAGE_ACCOUNT_ACCOUNT_KEY
          valueFrom:
            secretKeyRef:
              name: secret-pitomi-backend
              key: azureStorageAccountAccountKey
        - name: PITOMI_AZURE_STORAGE_ACCOUNT_SAS_TOKEN
          valueFrom:
            secretKeyRef:
              name: secret-pitomi-backend
              key: azureStorageAccountSASToken
        - name: PITOMI_USERNAME
          valueFrom:
            secretKeyRef:
              name: secret-pitomi-backend
              key: username
        - name: PITOMI_PASSWORD
          valueFrom:
            secretKeyRef:
              name: secret-pitomi-backend
              key: password

```

`<<Image>>` name:tag of your image



##### service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: pitomi-backend
  labels:
    app: pitomi-backend
spec:
  ports:
  - port: 4000
    protocol: TCP
  selector:
    app: pitomi-backend

```

