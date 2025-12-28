# blt-webui

BLT Web UI - A web-based user interface for BLT.

## Repository Setup

### Creating a New GitHub Repository

If you want to create a **NEW** GitHub repository, follow these steps:

1. **Create new repo on GitHub** (e.g., `blt-webui`)
   - Go to GitHub and create a new repository
   - Do not initialize with README if you have existing code

2. **Set up local repository**
   ```bash
   # Navigate to your local project directory
   cd /path/to/your/project
   
   # Set the new remote URL (e.g., https://github.com/username/repository-name.git)
   git remote set-url origin <new-repo-url>
   
   # Push to the new repository
   git push -u origin main
   ```

3. **Optional: Rename local folder**
   ```bash
   cd ..
   mv old-folder-name blt-webui
   cd blt-webui
   ```

### Repository Options

When setting up a new repository, you have two options:

- **Keep existing history**: Maintain the current git history (useful if you want to preserve commits from `server/` and `web/` directories in the same repo)
- **Clean slate**: Start fresh with a new repository and no previous history

## Getting Started

### Prerequisites

(Add your project prerequisites here)

### Installation

```bash
# Clone the repository
git clone https://github.com/username/blt-webui.git
cd blt-webui

# Install dependencies
# (Add installation steps here)
```

### Development

```bash
# Start development server
# (Add development commands here)
```

## Project Structure

```
blt-webui/
├── server/          # Backend server code (if applicable)
├── web/             # Frontend web application (if applicable)
└── README.md        # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

(Add license information here)