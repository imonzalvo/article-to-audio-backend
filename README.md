# Article-to-Audio Backend

## Overview

This is the backend for the Article-to-Audio application, built with Nest.js. It provides functionality to scrape Substack articles, summarize them, convert the summaries to audio, and store the results.

## Features

- User authentication and management
- Article scraping from Substack URLs
- Text summarization using OpenAI
- Text-to-speech conversion using AWS Polly
- Audio file storage in AWS S3
- RESTful API for frontend integration
- Progress indicator for long-running operations

## Prerequisites

- Node.js (v14 or later recommended)
- npm
- AWS account with access to Polly and S3 services
- OpenAI API key
- Google credentials (for authentication)

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   DATABASE_URL=your_database_connection_string
   OPENAI_API_KEY=your_openai_api_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

## Running the Application

1. Start the development server:
   ```
   npm run start:dev
   ```

2. The API will be available at `http://localhost:3000` (or the port you've configured)

## Acknowledgements

This project was developed with significant assistance from AI, demonstrating the potential of AI-assisted development in creating functional applications with minimal manual coding.
