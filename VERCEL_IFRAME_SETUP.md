# 🔧 Vercel iframe Configuration for Shopify Integration

## 📋 Overview

This guide explains how to configure Vercel to allow Dr. Idrak AI to be embedded in an iframe within Shopify stores.

---

## ⚠️ Common Issues

When embedding apps in Shopify, you may encounter:

1. **X-Frame-Options: DENY** - Browser blocks iframe loading
2. **CORS Errors** - Cross-origin requests blocked
3. **CSP Violations** - Content Security Policy prevents embedding
4. **Blank iframe** - App loads but doesn't display

---

## ✅ Solution: Configure Headers

### Files Created

1. **`frontend/vercel.json`** - Vercel-specific configuration
2. **`frontend/public/_headers`** - Fallback headers configuration

---

## 🔧 Configuration Details

### 1. X-Frame-Options

```json
"X-Frame-Options": "ALLOWALL"
```

**Purpose**: Allows the app to be embedded in any iframe  
**Alternative**: Use `SAMEORIGIN` if you only want same-domain embedding

---

### 2. Content-Security-Policy (CSP)

```json
"Content-Security-Policy": "frame-ancestors 'self' https://*.myshopify.com https://admin.shopify.com"
```

**Purpose**: Explicitly allows Shopify domains to embed your app  
**Domains Allowed**:
- `'self'` - Your own domain
- `https://*.myshopify.com` - All Shopify stores
- `https://admin.shopify.com` - Shopify Admin panel

**Security Note**: This is more secure than `ALLOWALL` as it restricts embedding to trusted domains only.

---

### 3. CORS Headers

```json
"Access-Control-Allow-Origin": "*"
"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
"Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"
```

**Purpose**: Allows cross-origin requests from Shopify  
**Methods**: All common HTTP methods  
**Headers**: Standard request headers

**Production Tip**: Replace `*` with specific Shopify domains for better security:
```json
"Access-Control-Allow-Origin": "https://your-store.myshopify.com"
```

---

### 4. Permissions-Policy

```json
"Permissions-Policy": "microphone=*, camera=*, clipboard-write=*"
```

**Purpose**: Grants permissions for browser features  
**Features Enabled**:
- `microphone=*` - Voice input (if needed for AI)
- `camera=*` - Camera access (if needed)
- `clipboard-write=*` - Copy/paste functionality

---

## 🚀 Deployment Steps

### Step 1: Verify Files

Check that these files exist:
```bash
cd /workspace/app/frontend
ls -la vercel.json
ls -la public/_headers
```

---

### Step 2: Commit Changes

```bash
cd /workspace/app
git add frontend/vercel.json frontend/public/_headers
git commit -m "Add Vercel iframe configuration for Shopify integration"
git push origin main
```

---

### Step 3: Redeploy on Vercel

**Option A: Automatic (Recommended)**
- Vercel will auto-deploy when you push to GitHub
- Wait 2-3 minutes for deployment to complete

**Option B: Manual**
1. Go to https://vercel.com/dashboard
2. Select your **dr-idrak-ai** project
3. Click **"Deployments"**
4. Click **"Redeploy"** on the latest deployment

---

### Step 4: Verify Configuration

After deployment, check headers:

```bash
curl -I https://your-vercel-app.vercel.app
```

You should see:
```
X-Frame-Options: ALLOWALL
Content-Security-Policy: frame-ancestors 'self' https://*.myshopify.com https://admin.shopify.com
Access-Control-Allow-Origin: *
```

---

## 🧪 Testing iframe Embedding

### Test 1: Simple HTML Test

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>iframe Test</title>
</head>
<body>
  <h1>Dr. Idrak AI iframe Test</h1>
  <iframe 
    src="https://your-vercel-app.vercel.app" 
    width="400" 
    height="600" 
    frameborder="0"
  ></iframe>
</body>
</html>
```

Open in browser - the app should load inside the iframe.

---

### Test 2: Browser Console

1. Open your Vercel app in a new tab
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Run:
```javascript
console.log(window.self === window.top);
```

- `true` = Not in iframe
- `false` = Inside iframe (correct for Shopify)

---

### Test 3: Shopify Theme Editor

1. Enable App Embed in Shopify Theme Editor
2. Check browser console for errors
3. Look for:
   - ❌ `Refused to display in a frame` - Headers not working
   - ✅ No errors - Configuration successful

---

## 🔒 Security Considerations

### Production Recommendations

1. **Restrict CSP to specific domains**:
```json
"Content-Security-Policy": "frame-ancestors https://your-store.myshopify.com"
```

2. **Limit CORS origins**:
```json
"Access-Control-Allow-Origin": "https://your-store.myshopify.com"
```

3. **Use HTTPS only**:
```json
"Strict-Transport-Security": "max-age=31536000; includeSubDomains"
```

---

## 🐛 Troubleshooting

### Issue 1: "Refused to display in a frame"

**Cause**: X-Frame-Options or CSP blocking  
**Solution**: 
- Verify `vercel.json` is in `frontend/` directory
- Check Vercel deployment logs
- Clear browser cache and test in incognito mode

---

### Issue 2: CORS errors in console

**Cause**: Missing CORS headers  
**Solution**:
- Verify headers in deployment
- Add `Access-Control-Allow-Credentials: true` if using cookies
- Check Network tab for actual response headers

---

### Issue 3: Blank iframe

**Cause**: JavaScript errors or routing issues  
**Solution**:
- Check browser console for errors
- Verify `rewrites` in `vercel.json` for SPA routing
- Test direct URL access first

---

### Issue 4: Headers not applied

**Cause**: Vercel not reading `vercel.json`  
**Solution**:
- Ensure `vercel.json` is in project root or `frontend/` directory
- Check Vercel build logs for errors
- Try manual redeploy
- Contact Vercel support if persistent

---

## 📊 Verification Checklist

Before testing in Shopify:

- [ ] `vercel.json` created in `frontend/` directory
- [ ] `_headers` created in `frontend/public/` directory
- [ ] Changes committed to GitHub
- [ ] Vercel redeployed successfully
- [ ] Headers verified with `curl -I`
- [ ] Tested in simple HTML iframe
- [ ] No console errors in browser
- [ ] App loads correctly in iframe

---

## 🆘 Need Help?

If issues persist:

1. **Check Vercel Logs**: https://vercel.com/dashboard → Project → Deployments → View Logs
2. **Browser DevTools**: Network tab → Check response headers
3. **Vercel Support**: https://vercel.com/support
4. **Shopify Forums**: https://community.shopify.com/

---

## 📚 Additional Resources

- **Vercel Headers**: https://vercel.com/docs/concepts/projects/project-configuration#headers
- **CSP Guide**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **X-Frame-Options**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
- **CORS**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**✅ Configuration Complete! Your app is now ready for Shopify iframe embedding.**