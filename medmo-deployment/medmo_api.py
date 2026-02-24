"""
MedMO-4B API Server
FastAPI backend for medical image analysis
"""

import os
import io
import base64
from typing import Optional
from contextlib import asynccontextmanager

import torch
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Model configuration
MODEL_ID = "MBZUAI/MedMO-4B"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Global model variables
model = None
processor = None

class AnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    prompt: str = "Analyze this medical image and describe any abnormalities."
    language: str = "en"  # en, ar

class AnalysisResponse(BaseModel):
    analysis: str
    confidence: float
    model_used: str
    processing_time: float

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup"""
    global model, processor
    
    print(f"🔄 Loading MedMO-4B model on {DEVICE}...")
    
    try:
        from transformers import Qwen3VLForConditionalGeneration, AutoProcessor
        
        # Load with optimizations
        load_kwargs = {
            "torch_dtype": torch.bfloat16 if DEVICE == "cuda" else torch.float32,
            "device_map": "auto" if DEVICE == "cuda" else None,
        }
        
        # Use quantization for GPU to save memory
        if DEVICE == "cuda":
            load_kwargs["load_in_4bit"] = True
            load_kwargs["bnb_4bit_compute_dtype"] = torch.bfloat16
        
        model = Qwen3VLForConditionalGeneration.from_pretrained(
            MODEL_ID,
            **load_kwargs
        )
        processor = AutoProcessor.from_pretrained(MODEL_ID)
        
        print(f"✅ Model loaded successfully on {DEVICE}")
        
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        raise
    
    yield
    
    # Cleanup on shutdown
    print("🧹 Cleaning up...")
    if model:
        del model
    if processor:
        del processor
    torch.cuda.empty_cache()

# Create FastAPI app
app = FastAPI(
    title="MedMO-4B API",
    description="Medical image analysis API using MedMO-4B",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": DEVICE,
        "gpu_available": torch.cuda.is_available(),
        "gpu_memory": torch.cuda.get_device_properties(0).total_memory / 1e9 if torch.cuda.is_available() else 0
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    prompt: str = "Analyze this medical image and describe any abnormalities.",
    language: str = "en"
):
    """Analyze a medical image"""
    
    import time
    start_time = time.time()
    
    if model is None or processor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Prepare prompt based on language
        if language == "ar":
            prompt = f"باللغة العربية: {prompt}"
        
        # Prepare messages
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "image", "image": image},
                    {"type": "text", "text": prompt},
                ],
            }
        ]
        
        # Process
        from qwen_vl_utils import process_vision_info
        
        text = processor.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )
        image_inputs, video_inputs = process_vision_info(messages)
        inputs = processor(
            text=[text],
            images=image_inputs,
            videos=video_inputs,
            padding=True,
            return_tensors="pt",
        )
        inputs = inputs.to(model.device)
        
        # Generate
        with torch.no_grad():
            generated_ids = model.generate(
                **inputs,
                max_new_tokens=512,
                do_sample=True,
                temperature=0.7,
                top_p=0.9
            )
        
        generated_ids_trimmed = [
            out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
        ]
        output_text = processor.batch_decode(
            generated_ids_trimmed,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=False
        )[0]
        
        processing_time = time.time() - start_time
        
        return AnalysisResponse(
            analysis=output_text,
            confidence=0.85,  # Can be calculated based on logits
            model_used=MODEL_ID,
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze/base64", response_model=AnalysisResponse)
async def analyze_base64(request: AnalysisRequest):
    """Analyze image from base64"""
    
    import time
    start_time = time.time()
    
    if model is None or processor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="No image provided")
    
    try:
        # Decode base64
        image_data = base64.b64decode(request.image_base64.split(",")[-1])
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Prepare prompt
        prompt = request.prompt
        if request.language == "ar":
            prompt = f"باللغة العربية: {prompt}"
        
        # Prepare messages
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "image", "image": image},
                    {"type": "text", "text": prompt},
                ],
            }
        ]
        
        # Process
        from qwen_vl_utils import process_vision_info
        
        text = processor.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )
        image_inputs, video_inputs = process_vision_info(messages)
        inputs = processor(
            text=[text],
            images=image_inputs,
            videos=video_inputs,
            padding=True,
            return_tensors="pt",
        )
        inputs = inputs.to(model.device)
        
        # Generate
        with torch.no_grad():
            generated_ids = model.generate(
                **inputs,
                max_new_tokens=512,
                do_sample=True,
                temperature=0.7,
                top_p=0.9
            )
        
        generated_ids_trimmed = [
            out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
        ]
        output_text = processor.batch_decode(
            generated_ids_trimmed,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=False
        )[0]
        
        processing_time = time.time() - start_time
        
        return AnalysisResponse(
            analysis=output_text,
            confidence=0.85,
            model_used=MODEL_ID,
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)