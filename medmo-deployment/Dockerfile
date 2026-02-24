FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-venv \
    git \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create virtual environment
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

# Install Python packages
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir \
    torch \
    torchvision \
    torchaudio \
    transformers \
    accelerate \
    bitsandbytes \
    qwen-vl-utils \
    fastapi \
    uvicorn \
    python-multipart \
    pillow

# Copy application
COPY medmo_api.py /app/

# Create cache directory
RUN mkdir -p /app/cache

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run server
CMD ["uvicorn", "medmo_api:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]