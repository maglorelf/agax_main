# FTP Deployment Setup

This repository uses GitHub Actions to automatically deploy to your FTP server.

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### How to Add Secrets:
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

### Required Secrets:

- **`FTP_SERVER`** - Your FTP server hostname (e.g., `ftp.yourdomain.com` or `192.168.1.1`)
- **`FTP_USERNAME`** - Your FTP username
- **`FTP_PASSWORD`** - Your FTP password

### Optional Secrets (with defaults):

- **`FTP_PORT`** - FTP port (default: `21`)
- **`FTP_PROTOCOL`** - Protocol to use: `ftp`, `ftps`, or `ftps-legacy` (default: `ftp`)

## Deployment Triggers

The deployment will run automatically when:

1. **Manual Trigger**: Go to Actions → Deploy to FTP Server → Run workflow
2. **On Merge to Main**: Automatically deploys when code is pushed/merged to the `main` branch

## What Gets Deployed

- **Source Directory**: `./src/` folder contents
- **Excluded Files**: Git files, README files, node_modules, IDE configs

## Deployment Behavior

- **Sync Mode**: The FTP action will:
  - Upload new files
  - Update modified files
  - Remove files that no longer exist in the repository
  - Keep the server in sync with your repository

## Testing the Deployment

1. Add the secrets to your repository
2. Go to **Actions** tab
3. Select **Deploy to FTP Server** workflow
4. Click **Run workflow** → **Run workflow** button
5. Monitor the deployment progress

## Troubleshooting

If deployment fails:
- Check that all secrets are correctly set
- Verify FTP credentials by testing with an FTP client
- Check the Actions logs for specific error messages
- Ensure the FTP server allows connections from GitHub's IP ranges
- Try setting `FTP_PROTOCOL` to `ftps` or `ftps-legacy` if using secure FTP

## Server Directory Structure

The files from `./src/` will be deployed to the root directory specified in the workflow. Make sure:
- The FTP user has write permissions
- The server directory path is correct (currently set to `/`)

## Notes

- **index.html** is now the main entry point (not index.htm)
- Old files from the `modern/` folder have been moved to the root `src/` directory
- The deployment excludes development files automatically
