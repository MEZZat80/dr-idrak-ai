# MedMO-4B VPS Deployment Guide

## Requirements

- VPS with NVIDIA GPU (A100, V100, RTX 3090/4090)
- 32GB+ RAM
- 50GB+ SSD storage
- Ubuntu 22.04

## Quick Start (Docker - Recommended)

```bash
# 1. Clone repository
git clone https://github.com/MBZUAI/MedMO-4B.git
cd MedMO-4B

# 2. Install Docker and NVIDIA Docker
sudo apt update
sudo apt install -y docker.io docker-compose

# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt update
sudo apt install -y nvidia-docker2
sudo systemctl restart docker

# 3. Start services
docker-compose up -d

# 4. Check logs
docker-compose logs -f medmo-api
```

## Manual Installation

```bash
# 1. Run setup script
chmod +x setup_vps.sh
sudo ./setup_vps.sh

# 2. Copy API files
cp medmo_api.py /opt/medmo-api/
cd /opt/medmo-api

# 3. Start server
source venv/bin/activate
uvicorn medmo_api:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check
```bash
curl http://YOUR_VPS_IP:8000/health
```

### Analyze Image
```bash
curl -X POST "http://YOUR_VPS_IP:8000/analyze" \
  -F "file=@/path/to/image.jpg" \
  -F "prompt=Analyze this medical image" \
  -F "language=en"
```

### Analyze Base64
```bash
curl -X POST "http://YOUR_VPS_IP:8000/analyze/base64" \
  -H "Content-Type: application/json" \
  -d '{
    "image_base64": "data:image/jpeg;base64,/9j/4AAQ...",
    "prompt": "What abnormalities do you see?",
    "language": "ar"
  }'
```

## Integration with Dr. Idrak

Add to Dr. Idrak's frontend:

```typescript
const MEDMO_API_URL = 'http://YOUR_VPS_IP:8000';

async function analyzeWithMedMO(imageBase64: string, prompt: string) {
  const response = await fetch(`${MEDMO_API_URL}/analyze/base64`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_base64: imageBase64,
      prompt: prompt,
      language: 'ar' // or 'en'
    })
  });
  return response.json();
}
```

## SSL/HTTPS Setup

```bash
# Install certbot
sudo apt install -y certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/
```

## Monitoring

```bash
# Check GPU usage
nvidia-smi

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Restart service
docker-compose restart medmo-api
```

## Troubleshooting

### Out of Memory
- Reduce batch size in medmo_api.py
- Use 4-bit quantization (already enabled)
- Add swap space

### Model Download Issues
```bash
# Pre-download model
huggingface-cli download MBZUAI/MedMO-4B --local-dir ./models/MedMO-4B
```

### Slow Performance
- Ensure GPU is being used: `nvidia-smi`
- Check CUDA version matches PyTorch
- Use SSD for model storage

## Security

- Use firewall (ufw) to restrict port access
- Set up reverse proxy with SSL
- Use API keys for authentication
- Monitor logs regularly

## Costs

Estimated monthly costs:
- VPS with GPU: $200-500/month
- Bandwidth: ~$50/month
- Storage: ~$20/month

## Support

- MedMO Paper: https://arxiv.org/abs/2602.06965
- HuggingFace: https://huggingface.co/MBZUAI/MedMO-4B
- Issues: Open GitHub issue