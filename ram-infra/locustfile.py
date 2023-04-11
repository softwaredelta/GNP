from locust import HttpUser, task


class BasicUser(HttpUser):
    @task
    def static_site(self):
        self.client.get("/site")

    @task
    def backend(self):
        self.client.get("/api/health")

    @task
    def backend_db(self):
        self.client.get("/api/time")

    @task
    def backend_s3(self):
        self.client.get("/api/objects")
