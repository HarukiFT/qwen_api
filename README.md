# Qwen API

## Overview

This project is a Node.js application built with NestJS that provides an API endpoint for processing chat completions. The application can be built and run using Docker, ensuring a consistent environment across different systems.

## Prerequisites

Before you begin, ensure you have the following installed on your system:  
**Docker** : [Install Docker](https://docs.docker.com/get-docker/?spm=5aebb161.2f484c1b.0.0.7a037b95QWLwnO).  
**Docker Compose** (optional): If you want to use docker-compose, install it from [here](https://docs.docker.com/compose/install/).

## Getting Started

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/HarukiFT/qwen_api.git
cd qwen_api
```

### 2. Build and Run the Application

**Using Docker**
To build and run the application using Docker, follow these steps:

##### 1. Build the Docker Image:

```bash
docker build -t qwen-api .
```

#### 2. Create volume:

```bash
docker volume create qwen_volume
```

##### 3. Run the Docker Container:

```bash
docker run -p 3000:3000 --name qwen_container -v qwen_volume:/app/data qwen-api
```

This command maps port `3000` of the container to port `3000` on your host machine.

**Using Docker Compose**
If you prefer using Docker Compose, create a `docker-compose.yml` file in the root directory:
_(example content in progress)_

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
```

Then, run the following command to build and start the application:

```bash
docker-compose up --build
```

## API Documentation

## POST `/credentials/generate`

**`SHOULD BE CALLED AT LEAST ONCE`**
This endpoint processes generation of credentials that it needs to comfortable work.  
**More credentials, more possible requests per moment**

## GET `/credentials`

Returns all generated credentials with signature:

```json
[
  {
    "login": "ExampleLogin",
    "password": "SHA256Hash"
  }
]
```

## POST `/prompt/completions`

This endpoint processes chat completions based on the provided input.

**Request Example**

```json
{
  "stream": true,
  "chat_type": "t2t",
  "model": "qwen-max-latest",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    },
    {
      "role": "assistant",
      "content": "Hello, how can I assist you? 😊?"
    },
    {
      "role": "user",
      "content": "No way!"
    }
  ]
}
```
