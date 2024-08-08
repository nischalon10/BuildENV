# BuildENV - Visual Studio Code Extension

## Overview

BuildENV simplifies the creation of `.env` files for different environments (dev, stg, prod) based on a single `env.json` file.

## Features

- Reads `env.json` from your workspace.
- Generates `.env.dev`, `.env.stg`, and `.env.prod` files.
- Automatically opens the first generated `.env` file.
- Shows error messages for missing files or issues.

## Usage

1. Create `env.json` in your workspace root:

    ```json
    {
        "Section": [
            { "Name": "Variable1", "dev": "value1_dev", "stg": "value1_stg", "prod": "value1_prod" },
            { "Name": "Variable2", "dev": "value2_dev", "stg": "value2_stg", "prod": "value2_prod" }
        ]
    }
    ```

2. Open Command Palette (`Ctrl+Shift+P`), type `BuildENV`.

3. The extension generates `.env` files and opens the first one.

## Example

Given `env.json`:

```json
{
    "DatabaseConfig": [
        { "Name": "DB_HOST", "dev": "localhost", "stg": "staging.db.example.com", "prod": "prod.db.example.com" },
        { "Name": "DB_PORT", "dev": "5432", "stg": "5432", "prod": "5432" }
    ]
}
```
Generates .env.dev, .env.stg, and .env.prod files.