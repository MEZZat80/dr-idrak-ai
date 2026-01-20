# 🛍️ Dr. Idrak AI - Shopify App Extension Setup Guide

## 📋 Overview

This guide will help you deploy Dr. Idrak AI as a Shopify App Extension with a floating chat widget that appears on all pages of your Shopify store.

---

## 🎯 Prerequisites

1. **Shopify Partners Account**: https://partners.shopify.com/
2. **Shopify CLI**: Install from https://shopify.dev/docs/api/shopify-cli
3. **Node.js 18+**: Already installed
4. **Vercel Deployment**: Your Dr. Idrak AI app must be deployed on Vercel

---

## 🚀 Step 1: Create Shopify App in Partners Dashboard

1. Go to https://partners.shopify.com/
2. Click **"Apps"** → **"Create app"**
3. Choose **"Create app manually"**
4. Fill in:
   - **App name**: Dr. Idrak AI
   - **App URL**: `https://your-vercel-app.vercel.app`
   - **Allowed redirection URL(s)**: 
     - `https://your-vercel-app.vercel.app/auth/callback`
     - `https://your-vercel-app.vercel.app/auth/shopify/callback`

5. Click **"Create app"**
6. Copy your **Client ID** and **Client Secret**

---

## 🔧 Step 2: Configure shopify.app.toml

Update `/workspace/app/shopify-app/shopify.app.toml`:

```toml
client_id = "YOUR_CLIENT_ID_HERE"  # Paste your Client ID
application_url = "https://your-actual-vercel-url.vercel.app"  # Your Vercel URL
dev_store_url = "your-store.myshopify.com"  # Your test store
```

---

## 📦 Step 3: Install Shopify CLI

```bash
# Install Shopify CLI globally
npm install -g @shopify/cli @shopify/theme

# Verify installation
shopify version
```

---

## 🎨 Step 4: Deploy Theme App Extension

```bash
# Navigate to shopify-app directory
cd /workspace/app/shopify-app

# Login to Shopify
shopify auth login

# Deploy the extension
shopify app deploy

# Follow the prompts:
# - Select your app from the list
# - Confirm deployment
```

---

## 🔗 Step 5: Update App Embed URL

After deploying to Vercel, update the App URL in the Liquid template:

1. Open `extensions/dr-idrak-embed/blocks/app-embed.liquid`
2. Find line with `"default": "https://your-vercel-app.vercel.app"`
3. Replace with your actual Vercel URL

---

## 🏪 Step 6: Install App in Your Store

1. Go to Shopify Partners Dashboard
2. Click on your **Dr. Idrak AI** app
3. Click **"Test on development store"**
4. Select your store
5. Click **"Install app"**

---

## ✨ Step 7: Enable App Embed

1. Go to your Shopify Admin: `your-store.myshopify.com/admin`
2. Navigate to **Online Store** → **Themes**
3. Click **"Customize"** on your active theme
4. In the left sidebar, scroll down to **"App embeds"**
5. Find **"Dr. Idrak AI Chat"**
6. Toggle it **ON** ✅
7. Configure settings:
   - **App URL**: Your Vercel deployment URL
   - **Button Color**: #10b981 (or customize)
   - **Header Color**: #059669 (or customize)
   - **Position**: Adjust bottom/right spacing
   - **Size**: Adjust chat width/height

8. Click **"Save"**

---

## 🎉 Step 8: Test the Widget

1. Visit your store: `your-store.myshopify.com`
2. You should see a floating chat button in the bottom-right corner
3. Click it to open the Dr. Idrak AI chat interface
4. Test the chat functionality

---

## 🔒 Security: Customer Data Integration

The app automatically sends Shopify customer data to the iframe when available:

```javascript
{
  type: 'shopify-customer-data',
  customer: {
    id: 'customer_id',
    email: 'customer@example.com',
    firstName: 'First',
    lastName: 'Last'
  }
}
```

**To receive this data in your Dr. Idrak AI app**, add this listener in your frontend:

```typescript
// In your main app component
useEffect(() => {
  window.addEventListener('message', (event) => {
    if (event.data.type === 'shopify-customer-data') {
      const customer = event.data.customer;
      // Store customer data in your state
      console.log('Shopify customer:', customer);
    }
  });
}, []);
```

---

## 📱 Mobile Responsiveness

The widget is fully responsive:
- **Desktop**: Floating chat window (400x600px default)
- **Mobile**: Full-screen overlay for better UX

---

## 🎨 Customization Options

Available settings in Theme Editor:

| Setting | Default | Description |
|---------|---------|-------------|
| App URL | - | Your Vercel deployment URL |
| Button Color | #10b981 | Chat button background color |
| Header Color | #059669 | Chat header background color |
| Button Bottom | 20px | Distance from bottom edge |
| Button Right | 20px | Distance from right edge |
| Chat Width | 400px | Desktop chat window width |
| Chat Height | 600px | Desktop chat window height |

---

## 🐛 Troubleshooting

### Widget not appearing?

1. Check App Embed is enabled in Theme Editor
2. Verify App URL is correct in settings
3. Check browser console for errors
4. Ensure Vercel app is deployed and accessible

### Iframe not loading?

1. Check CORS settings in your Vercel app
2. Verify the URL in `app-embed.liquid` matches your deployment
3. Check browser console for CSP errors

### Customer data not received?

1. Ensure customer is logged in
2. Check postMessage origin verification
3. Add message listener in your app (see Security section)

---

## 📚 Additional Resources

- **Shopify CLI Docs**: https://shopify.dev/docs/api/shopify-cli
- **Theme App Extensions**: https://shopify.dev/docs/apps/online-store/theme-app-extensions
- **App Embed Blocks**: https://shopify.dev/docs/apps/online-store/theme-app-extensions/extensions-framework

---

## 🆘 Need Help?

If you encounter issues:

1. Check Shopify CLI logs: `shopify app logs`
2. Review Vercel deployment logs
3. Test in incognito mode to rule out cache issues
4. Contact Shopify Partner Support

---

## ✅ Checklist

- [ ] Created Shopify App in Partners Dashboard
- [ ] Copied Client ID and updated `shopify.app.toml`
- [ ] Installed Shopify CLI
- [ ] Deployed theme extension with `shopify app deploy`
- [ ] Updated App URL in Liquid template
- [ ] Installed app in development store
- [ ] Enabled App Embed in Theme Editor
- [ ] Configured widget settings
- [ ] Tested on desktop and mobile
- [ ] Verified customer data integration

---

**🎊 Congratulations! Dr. Idrak AI is now live as a Shopify App Extension!**