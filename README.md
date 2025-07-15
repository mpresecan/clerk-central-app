# Centralized Authentication Monorepo

A monorepo containing a centralized authentication system using Clerk with multiple satellite applications.

## Architecture

This monorepo implements a centralized authentication pattern with:

- **clerk-center**: Primary authentication server using Clerk
- **pl1**: PayloadCMS satellite application with Clerk integration
- **pl2**: PayloadCMS satellite application with Clerk integration  
- **better-auth-center**: Alternative authentication implementation

## Getting Started

### Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm 9+ or 10+

### Installation

```bash
# Install all dependencies for all projects
pnpm install
```

### Development

```bash
# Run all projects in development mode
pnpm dev

# Run individual projects
pnpm dev:clerk      # Clerk auth center
pnpm dev:pl1        # PayloadCMS app 1
pnpm dev:pl2        # PayloadCMS app 2
pnpm dev:better-auth # Better-auth center
```

### Building

```bash
# Build all projects
pnpm build

# Build individual projects
pnpm build:clerk
pnpm build:pl1
pnpm build:pl2
pnpm build:better-auth
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific projects
pnpm test:pl1
pnpm test:pl2
```

## Project Structure

```
├── clerk-center/          # Primary Clerk authentication server
├── pl1/                   # PayloadCMS satellite app 1
├── pl2/                   # PayloadCMS satellite app 2
├── better-auth-center/    # Alternative auth implementation
├── docs/                  # Documentation
├── package.json           # Root package.json with workspace scripts
├── pnpm-workspace.yaml    # PNPM workspace configuration
└── README.md             # This file
```

## Authentication Flow

The centralized authentication system works as follows:

1. **clerk-center** serves as the primary authentication server
2. **pl1** and **pl2** are configured as satellite applications
3. Users authenticate through the central Clerk instance
4. Satellite applications validate sessions through the central auth server
5. PayloadCMS admin interfaces use their own authentication (separate from Clerk)

## Development Scripts

- `pnpm dev` - Start all projects in development mode
- `pnpm build` - Build all projects
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all projects
- `pnpm clean` - Clean all build artifacts and dependencies
- `pnpm typecheck` - Run TypeScript checks across all projects

## Environment Variables

Each project requires its own environment variables. See individual project README files for specific requirements.

## Contributing

1. Make changes in the appropriate project directory
2. Test your changes with `pnpm test`
3. Ensure all projects build successfully with `pnpm build`
4. Run linting with `pnpm lint`

## Documentation

Additional documentation can be found in the `docs/` directory.
