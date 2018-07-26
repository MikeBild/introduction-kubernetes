# Jobs / CronJjobs

- [Examples](examples/job-app/README)
- [Job](#job)
- [CronJob](#cronjob)

## Job

- `kubectl apply -f job.yaml`

_`job.yaml`_

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: simple-job
spec:
  backoffLimit: 3
  activeDeadlineSeconds: 100
  template:
    spec:
      containers:
        - name: simple-job
          image: gcr.io/workshops-mikebild/simple-job:v1.0.0
          command: ['npm', 'start']
      restartPolicy: Never
```

## CronJob

- `kubectl apply -f cronjob.yaml`

_`cronjob.yaml`_

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cron-job
spec:
  schedule: '*/1 * * * *'
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: simple-job
              image: gcr.io/workshops-mikebild/simple-job:v1.0.0
              command: ['npm', 'start']
          restartPolicy: OnFailure
```
