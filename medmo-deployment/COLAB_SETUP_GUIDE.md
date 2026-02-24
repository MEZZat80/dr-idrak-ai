# MedMO-4B on Google Colab - Setup Guide

## الخطوات:

### 1. افتح Google Colab
- روح على: https://colab.research.google.com
- اختار "Upload notebook"
- ارفع ملف `MedMO_Colab.ipynb`

### 2. جهز الـ GPU
- من القائمة: Runtime → Change runtime type
- اختار "GPU" من الـ Hardware accelerator
- اضغط Save

### 3. شغل الـ Cells
- اضغط على كل cell واختار Run (أو Ctrl+Enter)
- Cell 1: هيثبت المكتبات (2-3 دقايق)
- Cell 2: هيحمل النموذج (5-10 دقايق في أول مرة)
- Cell 3: هيجهز الـ API
- Cell 4: هيشغل الـ server ويعطيك URL

### 4. خد الـ URL
لما يخلص، هتشوف رسالة زي دي:
```
🌐 Public URL: https://xxxx.ngrok-free.app
📊 Health check: https://xxxx.ngrok-free.app/health
```

انسخ الـ URL ده.

### 5. ربطه بـ Dr. Idrak
في الـ frontend، ضيف الـ URL في ملف `.env`:
```
VITE_MEDMO_API_URL=https://xxxx.ngrok-free.app
```

أو عدل في `medmoClient.ts`:
```typescript
const COLAB_API_URL = 'https://xxxx.ngrok-free.app';
```

### 6. اختبار
افتح Dr. Idrak وارفع صورة طبية، هيتم تحليلها بـ MedMO-4B!

---

## ملاحظات مهمة:

### الـ Session بيفصل
- Google Colab بيفصل بعد 12 ساعة
- لو سكت الـ notebook، لازم تشغله تاني
- الـ URL هيتغير كل مرة

### عشان تخلي الـ URL ثابت
1. سجل في ngrok: https://ngrok.com
2. خد auth token
3. في الـ notebook، غير:
```python
ngrok.set_auth_token("YOUR_TOKEN_HERE")
```
4. استخدم static domain من ngrok

### لو عايز تشغل 24/7
- استخدم ngrok paid plan ($5/شهر)
- أو استخدم VPS صغير يفضل شغال

---

## تكلفة:
- **Google Colab**: مجاني (12 ساعة يومياً)
- **ngrok**: مجاني (URL متغير) أو $5/شهر (ثابت)

---

## API Endpoints:

### Health Check
```bash
curl https://xxxx.ngrok-free.app/health
```

### Analyze Image
```bash
curl -X POST "https://xxxx.ngrok-free.app/analyze" \
  -F "file=@image.jpg" \
  -F "prompt=Analyze this X-ray" \
  -F "language=ar"
```

### Analyze Base64
```bash
curl -X POST "https://xxxx.ngrok-free.app/analyze/base64" \
  -H "Content-Type: application/json" \
  -d '{
    "image_base64": "data:image/jpeg;base64,/9j/4AAQ...",
    "prompt": "What do you see?",
    "language": "ar"
  }'
```