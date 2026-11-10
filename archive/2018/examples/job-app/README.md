# Simple Job

- [Simple Job](#job)
- [Cron Job](#cronjob)

## Job

### Prepare image

```bash
docker build -t gcr.io/workshops-mikebild/simple-job:v1.0.0 .
docker push gcr.io/workshops-mikebild/simple-job:v1.0.0
```

### Create a Job-YAML

_`job.yaml`_

```yaml
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

### Start a Job

- `kubectl create -f job.yaml` - Create Job
- `kubectl get jobs,pods` - List Jobs
- `kubectl delete -f job.yaml` - Create Job

### Options

- `backoffLimit: 3` - number of retries
- `activeDeadlineSeconds: 100` - max duration of the job
- `restartPolicy: Never` - Never or OnFailure

### Exercices

- Change the exit code to 1
- Rebuild Docker image version v1.1.0 and push the new image
- Update `job.yaml` using the v1.1.0 image
- Change the `restartPolicy` to `OnFailure`
- Delete and create the job

## CronJob

Starting jobs in [cron](https://en.wikipedia.org/wiki/Cron) format.

### Create Cron-Job-YAML

_`cronjob.yaml`_ - Start a job every ...

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

### Start a CronJob

- `kubectl create -f cronjob.yaml` - Create Job
- `kubectl get cronjobs,pods` - List Jobs
- `kubectl delete -f cronjob.yaml` - Create Job
