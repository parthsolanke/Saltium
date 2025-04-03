### Run using Docker
1. **Build the Docker image**:
   ```bash
   docker build -t saltium-backend .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8080:<PORT> --env-file .env saltium-backend
   ```
   - `--env-file .env` will pass environment variables from your `.env` file into the container.

3. Run Docker container in detached mode and restart it automatically on failure:
   ```bash
   docker run -d --restart always -p 8080:8080 --env-file .env saltium-backend
   ```