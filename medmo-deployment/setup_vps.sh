#!/bin/bash
# MedMO-4B Deployment Script for VPS

set -e

echo "🚀 Setting up MedMO-4B on VPS..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install -y python3-pip python3-venv git wget

# Install CUDA (if NVIDIA GPU available)
if command -v nvidia-smi &> /dev/null; then
    echo "✅ NVIDIA GPU detected"
    # CUDA 12.1 installation
    wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin
    sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600
    wget https://developer.download.nvidia.com/compute/cuda/12.1.0/local_installers/cuda-repo-ubuntu2204-12-1-local_12.1.0-530.30.02-1_amd64.deb
    sudo dpkg -i cuda-repo-ubuntu2204-12-1-local_12.1.0-530.30.02-1_amd64.deb
    sudo cp /var/cuda-repo-ubuntu2204-12-1-local/cuda-*-keyring.gpg /usr/share/keyrings/
    sudo apt-get update
    sudo apt-get -y install cuda
else
    echo "⚠️ No NVIDIA GPU detected - will run on CPU (slower)"
fi

# Create project directory
mkdir -p /opt/medmo-api
cd /opt/medmo-api

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python packages
pip install --upgrade pip
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install transformers accelerate bitsandbytes qwen-vl-utils
pip install fastapi uvicorn python-multipart pillow

echo "✅ Dependencies installed"

# Download model (optional - can be done on first run)
# pip install huggingface-hub
# huggingface-cli download MBZUAI/MedMO-4B --local-dir ./models/MedMO-4B

echo "🎉 Setup complete!"