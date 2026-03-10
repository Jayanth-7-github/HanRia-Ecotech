# Backend (Contact Form API)

This backend provides a single contact endpoint used by the frontend Contact page.

## Setup

```bash
cd backend
npm install
```

Create `backend/.env` based on `.env.example`.

## Run

```bash
cd backend
npm run start
```

Backend default: `http://localhost:3001`

## Uploads (Local or Cloudinary)

By default, uploaded files are stored locally under `backend/uploads` and served from `GET /uploads/*`.

To store uploads in Cloudinary instead, set the following environment variables in `backend/.env`:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- `UPLOAD_PROVIDER=cloudinary` (recommended to enforce Cloudinary; uploads are kept in-memory and are not written to `backend/uploads`)
- `CLOUDINARY_FOLDER=hanria-ecotech`

## Endpoints

- `GET /api/health` → `{ ok: true }`
- `POST /api/contact` → sends an email via Nodemailer

### `POST /api/contact` body

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "message": "Hello..."
}
```
