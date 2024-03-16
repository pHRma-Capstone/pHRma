# <a href="http://35.153.163.209/" target="_blank">pHRma</a>

CS 4980 Capstone II Project

# Setup

Use Node.js 20.+

- Backend

  1. `cd backend && npm i` to install dependencies.
  2. Create `/backend/.env` file.
  3. Copy in these variables and supply the proper values (check Discord/AWS):

```
  DB_HOST=
  DB_PORT=
  DB_USER=
  DB_PASS=
  DB_DATABASE=
```

- Frontend

  1. `cd frontend && npm i` to install dependencies.
  2. For production, create a `/frontend/.env` file.
  3. Copy in these variables and supply the proper values:
 
```
  VITE_API_BASE_URL=
```

# Run the Application

- Backend

  1. `npm run dev` in backend directory

- Frontend

  1. `npm run dev` in frontend directory
 
# Deploy the Application

## Using GitHub Action

  1. In GitHub, navigate to `Actions`.
  2. Select `Build and Deploy to EC2`.
  3. Press the `Run Workflow` dropdown.
  4. Select the branch you would like to deploy.
  5. Press `Run Workflow`.

## Manually via SSH

  1. SSH to the EC2 instance.
      - If in the same directory as SSH key: `ssh -i "pHRma-security-key.pem" ec2-user@ec2-35-153-163-209.compute-1.amazonaws.com`
      - If not already done, clone the repository to the instance once logged in.
  3. Navigate to the project root: `cd pHRma`.
  4. Run `git pull` to update the project.
  5. Run `docker compose down` to stop any containers currently running.
  6. Run `docker compose up --build -d` to build and run the containers.
      - The `-d` flag returns you to the terminal upon completion instead of keeping you on the container output logs.
