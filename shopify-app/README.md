# 🛍️ Dr. Idrak AI - Shopify App Extension

## 📖 What is this?

This is the **Shopify Theme App Extension** for Dr. Idrak AI. It allows your AI medical assistant to appear as a floating chat widget on all pages of your Shopify store.

---

## 🎯 Features

✅ **Floating Chat Widget** - Appears on all store pages  
✅ **Fully Customizable** - Colors, position, size via Theme Editor  
✅ **Mobile Responsive** - Adapts to mobile screens  
✅ **Customer Integration** - Automatically passes Shopify customer data  
✅ **App Embed Block** - Easy to enable/disable in Theme Editor  
✅ **No Code Required** - Merchants can customize without coding  

---

## 📁 Project Structure

```
shopify-app/
├── shopify.app.toml              # App configuration
├── package.json                  # Dependencies
├── extensions/                   # Theme app extensions
│   └── dr-idrak-embed/          # Main embed extension
│       ├── shopify.extension.toml  # Extension config
│       └── blocks/
│           └── app-embed.liquid    # Main widget code
├── SHOPIFY_SETUP.md             # Detailed setup guide
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites

1. Shopify Partners account
2. Shopify CLI installed
3. Dr. Idrak AI deployed on Vercel

### Installation

```bash
# 1. Navigate to shopify-app directory
cd /workspace/app/shopify-app

# 2. Install dependencies
npm install

# 3. Login to Shopify
shopify auth login

# 4. Deploy the extension
shopify app deploy
```

---

## 📋 Setup Steps

1. **Create Shopify App** in Partners Dashboard
2. **Update `shopify.app.toml`** with your Client ID
3. **Deploy extension** using `shopify app deploy`
4. **Install app** in your development store
5. **Enable App Embed** in Theme Editor
6. **Configure settings** (URL, colors, position)

**For detailed instructions, see [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md)**

---

## 🎨 Customization

Merchants can customize the widget from **Theme Editor → App embeds**:

- **App URL**: Your Vercel deployment URL
- **Colors**: Button and header colors
- **Position**: Bottom/right spacing
- **Size**: Chat window dimensions

---

## 🔒 Security

- **Origin Verification**: postMessage validates iframe origin
- **Customer Data**: Only sent when customer is logged in
- **HTTPS Required**: All URLs must use HTTPS

---

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🐛 Troubleshooting

**Widget not showing?**
- Check App Embed is enabled in Theme Editor
- Verify App URL is correct
- Clear browser cache

**Iframe not loading?**
- Check CORS settings in Vercel
- Verify URL matches deployment
- Check browser console for errors

---

## 📚 Documentation

- [Shopify Theme App Extensions](https://shopify.dev/docs/apps/online-store/theme-app-extensions)
- [App Embed Blocks](https://shopify.dev/docs/apps/online-store/theme-app-extensions/extensions-framework)
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)

---

## 🆘 Support

For issues or questions:
1. Check [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md)
2. Review Shopify CLI logs: `shopify app logs`
3. Contact Shopify Partner Support

---

## 📄 License

MIT License - See LICENSE file for details

---

**Made with ❤️ for Shopify merchants**