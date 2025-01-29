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

### 2. Create `credentials.json` file in project dir

**File with accounts credentials should be named as credentials.json and placed in project dir**  
**IT'S MUST HAVE**
Example of `credentials.json` content:

```json
[
  {
    "login": "carolann90113@bfr4.terriblecoffee.org",
    "password": "zd05455f9fb947a47d37c7853a511364486992625bad99x85fa4554b2472f81e"
  },
  {
    "login": "proffitt21121@g696.undeadbank.com",
    "password": "1d05455f9fb947a47d37c7853a511364486992625bad99z85fa4554b2472f81e"
  },
  {
    "login": "aaronson36532@zrhwl.underseagolf.com",
    "password": "7d05455f9fb947a47d37c7853a511364486992625bad99a85fa4554b2472f81e"
  }
]
```

### 3. Build and Run the Application

**Using Docker**
To build and run the application using Docker, follow these steps:

##### 1. Build the Docker Image:

```bash
docker build -t qwen-api .
```

##### 2. Run the Docker Container:

```bash
docker run -p 3000:3000 qwen-api
```

This command maps port `3000` of the container to port `3000` on your host machine.

**Using Docker Compose**
If you prefer using Docker Compose, create a `docker-compose.yml` file in the root directory:

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
