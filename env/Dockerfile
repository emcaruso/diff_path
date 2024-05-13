# Use an official Python runtime as a parent image with CUDA support
FROM nvidia/cuda:12.0.1-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive 

# Set the working directory in the container
WORKDIR /app

# Install Python and other dependencies
RUN apt-get update && apt-get install -y \
	git \
    python3-pip \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip3 install --upgrade pip

# Copy the requirements.txt file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of your application's source code from your host to your image filesystem
COPY . /app

# Make port 80 available to the world outside this container
EXPOSE 80

# Define any environment variables
ENV NAME World

# Run the application
CMD ["python3", "app.py"]
