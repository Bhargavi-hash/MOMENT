from .celery_app import celery

@celery.task
def test_job(x):
    return x * 2
