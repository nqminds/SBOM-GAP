FROM python:3.9-slim

# working directory for the container
WORKDIR /usr/src/app

# Install git and other dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

# clone CCScanner repository
RUN git clone https://github.com/lkpsg/ccscanner.git && \
    git clone https://github.com/WOOSEUNGHOON/Centris-public.git ccscanner/Centris

# Install any needed packages specified in requirements
RUN pip install --no-cache-dir json5 bs4 GitPython lxml requests

# Define environment variable
ENV NAME ccscanner

# Set the entrypoint
ENTRYPOINT ["python", "./ccscanner/ccscanner/scanner.py"]
