# Cloud Lab

## Run the application locally

From the repository root, start the full stack with Docker Compose:

```sh
docker compose up --build
```

Open the frontend at `http://localhost:3000`; the API is available at
`http://localhost:5000/api/students`. MongoDB runs locally in the Compose
network and its data persists in the `student-mongodb-data` volume.

To use MongoDB Atlas instead, set `MONGODB_URI` in the environment before
starting Compose. Keep the connection string private and do not commit it.

Stop the services with:

```sh
docker compose down
```

## Run published Docker Hub images

After publishing the `latest` tags for both images, start the Hub-based stack
with:

```sh
docker compose -f docker-compose.hub.yml up -d
```

The Hub compose file uses the MongoDB service on the Compose network by default.

The backend allows browser CORS requests from the Render frontend and the
local development frontend origins. The deployed frontend uses the `/api`
reverse proxy, so browser requests remain on the frontend origin.
