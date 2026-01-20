# دليل ربط Dr. Idrak مع Shopify
# Dr. Idrak Shopify Integration Guide

## نظرة عامة | Overview

هذا الدليل يشرح كيفية دمج تطبيق Dr. Idrak (Clinical Guidance System) مع متجر Shopify الخاص بك.

This guide explains how to integrate the Dr. Idrak Clinical Guidance System with your Shopify store.

---

## الطريقة 1: استخدام Shopify App Embed (الأسهل)
## Method 1: Using Shopify App Embed (Easiest)

### الخطوات | Steps:

#### 1. نشر التطبيق | Deploy the App
```bash
# انشر التطبيق على Atoms أو أي خدمة استضافة
# Deploy the app to Atoms or any hosting service
pnpm run build
# سيتم إنشاء رابط مثل: https://your-app.atoms.dev
# You'll get a URL like: https://your-app.atoms.dev
```

#### 2. إنشاء App Embed في Shopify | Create App Embed in Shopify

**أ) في لوحة تحكم Shopify:**
1. اذهب إلى: **Online Store** → **Themes**
2. اضغط على **Customize** (تخصيص)
3. اضغط على **App embeds** في الشريط الجانبي الأيسر
4. اضغط على **Add app** → **Custom Liquid**

**ب) أضف الكود التالي:**
```liquid
<!-- Dr. Idrak Clinical Guidance System -->
<div id="dr-idrak-widget"></div>

<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://your-app.atoms.dev';
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    
    document.getElementById('dr-idrak-widget').appendChild(iframe);
  })();
</script>

<style>
  #dr-idrak-widget {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
  }
</style>
```

#### 3. حفظ وتفعيل | Save and Enable
- احفظ التغييرات
- فعّل App Embed من قائمة App embeds
- Save changes
- Enable the App Embed from the App embeds list

---

## الطريقة 2: صفحة مخصصة (أكثر تحكماً)
## Method 2: Custom Page (More Control)

### الخطوات | Steps:

#### 1. إنشاء صفحة جديدة | Create New Page
1. في Shopify Admin: **Online Store** → **Pages**
2. اضغط **Add page**
3. العنوان: "Clinical Guidance" أو "استشارة طبية"
4. في محرر المحتوى، اضغط **Show HTML**

#### 2. أضف الكود | Add Code
```html
<div class="dr-idrak-container">
  <iframe 
    src="https://your-app.atoms.dev" 
    id="dr-idrak-iframe"
    title="Dr. Idrak Clinical Guidance"
    allow="microphone; camera"
    style="width: 100%; height: 800px; border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  </iframe>
</div>

<style>
  .dr-idrak-container {
    max-width: 1400px;
    margin: 60px auto;
    padding: 0 20px;
  }
  
  @media (max-width: 768px) {
    #dr-idrak-iframe {
      height: 600px;
    }
  }
</style>

<script>
  // Auto-resize iframe based on content
  window.addEventListener('message', function(e) {
    if (e.data.type === 'resize') {
      document.getElementById('dr-idrak-iframe').style.height = e.data.height + 'px';
    }
  });
</script>
```

#### 3. إضافة رابط في القائمة | Add to Navigation
1. **Online Store** → **Navigation**
2. اختر **Main menu**
3. اضغط **Add menu item**
4. الاسم: "Clinical Guidance" أو "استشارة طبية"
5. الرابط: اختر الصفحة التي أنشأتها

---

## الطريقة 3: زر عائم (Floating Widget)
## Method 3: Floating Widget

### إضافة زر عائم في كل الصفحات | Add Floating Button on All Pages

#### 1. أضف في theme.liquid
في **Online Store** → **Themes** → **Edit code** → **Layout** → **theme.liquid**

أضف قبل `</body>`:

```html
<!-- Dr. Idrak Floating Widget -->
<div id="dr-idrak-floating-btn" onclick="toggleDrIdrak()">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
  <span>استشارة طبية</span>
</div>

<div id="dr-idrak-modal" style="display: none;">
  <div class="dr-idrak-overlay" onclick="toggleDrIdrak()"></div>
  <div class="dr-idrak-modal-content">
    <button class="dr-idrak-close" onclick="toggleDrIdrak()">×</button>
    <iframe 
      src="https://your-app.atoms.dev" 
      style="width: 100%; height: 100%; border: none;"
      allow="microphone; camera">
    </iframe>
  </div>
</div>

<style>
  #dr-idrak-floating-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 50px;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    z-index: 9998;
    transition: all 0.3s ease;
  }
  
  #dr-idrak-floating-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.5);
  }
  
  #dr-idrak-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
  
  .dr-idrak-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
  }
  
  .dr-idrak-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 1200px;
    height: 85%;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  
  .dr-idrak-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    color: #333;
    font-size: 32px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .dr-idrak-close:hover {
    background: rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    #dr-idrak-floating-btn span {
      display: none;
    }
    
    #dr-idrak-floating-btn {
      width: 56px;
      height: 56px;
      padding: 0;
      justify-content: center;
    }
    
    .dr-idrak-modal-content {
      width: 95%;
      height: 90%;
    }
  }
</style>

<script>
  function toggleDrIdrak() {
    var modal = document.getElementById('dr-idrak-modal');
    if (modal.style.display === 'none') {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    } else {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
</script>
```

---

## الطريقة 4: ربط المنتجات (Product Integration)
## Method 4: Product Integration

### ربط توصيات Dr. Idrak مع منتجات Shopify
### Connect Dr. Idrak Recommendations with Shopify Products

#### 1. تحديث protocolMap.ts
أضف معرفات منتجات Shopify:

```typescript
export const protocolMap = {
  focus: {
    name: 'Cognitive Enhancement Protocol',
    core: {
      name: 'NeuroBoost Complex',
      shopifyId: 'gid://shopify/Product/1234567890', // أضف معرف المنتج
      shopifyHandle: 'neuroboost-complex', // Handle من Shopify
    },
    // ... باقي المنتجات
  }
};
```

#### 2. إضافة زر "اشتري الآن" في ProtocolDisplay.tsx
```typescript
const addToCart = async (shopifyId: string) => {
  // استخدام Shopify Buy Button SDK
  window.location.href = `/cart/add?id=${shopifyId}&quantity=1`;
};
```

---

## الطريقة 5: Shopify App (متقدم)
## Method 5: Shopify App (Advanced)

### إنشاء تطبيق Shopify رسمي | Create Official Shopify App

#### المتطلبات | Requirements:
- حساب Shopify Partners
- معرفة بـ Node.js و React
- خادم للاستضافة

#### الخطوات الأساسية | Basic Steps:

1. **إنشاء تطبيق في Shopify Partners:**
   - زر https://partners.shopify.com
   - Apps → Create app → Custom app

2. **تكوين OAuth:**
```javascript
// في backend
const scopes = [
  'read_products',
  'write_products',
  'read_orders',
  'write_orders',
  'read_customers',
  'write_customers'
];
```

3. **استخدام Shopify API:**
```typescript
// مثال: إضافة منتج للسلة
const addToCart = async (variantId: string) => {
  const response = await fetch('/api/shopify/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variantId, quantity: 1 })
  });
  return response.json();
};
```

---

## الإعدادات الإضافية | Additional Settings

### 1. تفعيل الميكروفون في Shopify
في iframe، أضف:
```html
allow="microphone; camera"
```

### 2. تتبع التحويلات | Conversion Tracking
```javascript
// في ChatInterface.tsx
const trackConversion = () => {
  if (window.gtag) {
    window.gtag('event', 'protocol_recommended', {
      'event_category': 'clinical_guidance',
      'event_label': protocolRecommendation?.protocol?.name
    });
  }
};
```

### 3. تخصيص الألوان لتتناسب مع متجرك
في `index.css`:
```css
:root {
  --primary-color: #4F46E5; /* غيّر للون متجرك */
  --secondary-color: #6366F1;
}
```

---

## الأمان | Security

### 1. تقييد النطاقات المسموحة
في `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "frame-ancestors 'self' https://*.myshopify.com"
    }
  }
});
```

### 2. التحقق من المصدر
```javascript
// في ChatInterface.tsx
useEffect(() => {
  const allowedOrigins = ['https://your-store.myshopify.com'];
  window.addEventListener('message', (e) => {
    if (allowedOrigins.includes(e.origin)) {
      // معالجة الرسالة
    }
  });
}, []);
```

---

## الاختبار | Testing

### 1. اختبار محلي
```bash
pnpm run dev
# افتح في iframe: http://localhost:3000
```

### 2. اختبار على Shopify
- استخدم Theme Preview قبل النشر
- اختبر على أجهزة مختلفة (موبايل، تابلت، ديسكتوب)
- تحقق من عمل الميكروفون

---

## الدعم الفني | Technical Support

### المشاكل الشائعة | Common Issues:

**1. الميكروفون لا يعمل:**
- تأكد من إضافة `allow="microphone"` في iframe
- تحقق من أذونات المتصفح

**2. iframe لا يظهر:**
- تحقق من Content Security Policy
- تأكد من الرابط صحيح

**3. بطء في التحميل:**
- استخدم CDN
- فعّل التخزين المؤقت

---

## الخلاصة | Summary

**الطريقة الموصى بها:**
- للبداية: **الطريقة 1** (App Embed) - الأسهل
- للتخصيص: **الطريقة 3** (Floating Widget) - الأفضل
- للاحتراف: **الطريقة 5** (Shopify App) - الأقوى

**Recommended Method:**
- For beginners: **Method 1** (App Embed) - Easiest
- For customization: **Method 3** (Floating Widget) - Best UX
- For professionals: **Method 5** (Shopify App) - Most powerful

---

## روابط مفيدة | Useful Links

- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Shopify App Development](https://shopify.dev/apps)
- [Shopify Buy Button SDK](https://shopify.dev/custom-storefronts/tools/buy-button)
- [Atoms Deployment Guide](https://help.atoms.dev)

---

**تم إنشاء هذا الدليل بواسطة Alex @ Atoms**
**Created by Alex @ Atoms**