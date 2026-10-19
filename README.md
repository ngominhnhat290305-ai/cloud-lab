# Cloud Lab
Student Name: Ngo Minh Nhat Student ID : 234876 class:DH23TIN05

## Deploy API on Render

1. In Render, choose **New** > **Blueprint** and connect this GitHub repository.
2. Render reads `render.yaml` and creates the `cloud-lab-api` web service.
3. Set the service's `MONGODB_URI` environment variable to the MongoDB Atlas connection string in the Render dashboard. Do not commit the password or connection string.
4. Deploy the service. Once its status is **Live**, its API URL is shown in Render, usually `https://cloud-lab-api.onrender.com`. Verify it at `/health`; student endpoints are under `/api/students`.
