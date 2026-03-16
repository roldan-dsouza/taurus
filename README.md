# Taurus - AI-Powered Code Review Platform

Taurus is an intelligent code review platform that leverages AI to help developers maintain high code quality, security, and performance standards. It integrates seamlessly into the development workflow, providing instant feedback, automated fixes, and comprehensive code analysis.

## Features

- **AI-Powered Code Review**: Uses advanced AI models to detect bugs, security vulnerabilities, and performance issues
- **Automated Fix Suggestions**: Provides one-click fixes for common code issues
- **Inline Commenting**: Reviewers can leave contextual comments directly on the code
- **Integration**: Seamless integration with GitHub, GitLab, and Bitbucket
- **Customizable Rules**: Configure rules based on your project's coding standards
- **Performance Analysis**: Identifies performance bottlenecks and suggests optimizations
- **Security Scanning**: Detects security vulnerabilities and suggests mitigation strategies

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd taurus
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # AI Provider Configuration
   AI_PROVIDER=openai
   OPENAI_API_KEY=your_openai_api_key

   # Database Configuration
   DATABASE_URL=postgresql://user:password@localhost:5432/taurus

   # Authentication
   JWT_SECRET=your_jwt_secret

   # GitHub Integration
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### GitHub Integration

1. Install the Taurus app from the GitHub Marketplace
2. Authorize the app for your repositories
3. Configure review settings in the Taurus dashboard

### Code Review Workflow

1. A pull request is opened in your repository
2. Taurus automatically analyzes the code changes
3. Reviewers can view AI-generated suggestions and comments
4. Reviewers can approve or request changes
5. Once approved, the PR can be merged

## Development

### Project Structure

```
taurus/
├── src/
│   ├── api/          # API routes and controllers
│   ├── services/     # Business logic and AI integrations
│   ├── models/       # Database models
│   ├── middleware/   # Express middleware
│   └── utils/        # Utility functions
├── prisma/           # Database schema and migrations
├── public/           # Static files
├── .env              # Environment variables
├── package.json      # Project dependencies
└── tsconfig.json     # TypeScript configuration
```

### Running Tests

```bash
# Run all tests
npm test

# Run with watch mode
npm run test:watch
```

### Building for Production

```bash
npm run build
```

### Running in Production

```bash
npm start
```

## Configuration

### Environment Variables

| Variable               | Description                | Example                               |
| ---------------------- | -------------------------- | ------------------------------------- |
| `AI_PROVIDER`          | AI provider to use         | `openai`, `anthropic`, `gemini`       |
| `OPENAI_API_KEY`       | OpenAI API key             | `sk-proj-...`                         |
| `DATABASE_URL`         | Database connection string | `postgresql://user:pass@host:port/db` |
| `JWT_SECRET`           | JWT signing secret         | `your-secret-key`                     |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID     | `your-client-id`                      |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `your-client-secret`                  |

### AI Provider Configuration

Taurus supports multiple AI providers. Configure the appropriate variables in your `.env` file:

**OpenAI**

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
```

**Anthropic**

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key
```

**Google Gemini**

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

Taurus uses Prettier for code formatting. Run the following command before committing:

```bash
npm run format
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue or contact the development team.
