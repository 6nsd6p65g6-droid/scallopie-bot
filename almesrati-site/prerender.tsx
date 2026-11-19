import { renderToString } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { App } from "./src/App";
import { branches, company, intlNumber, phones, socials } from "./src/site-data";

// رابط الموقع النهائي. غيّره عند نشر الموقع على عنوانه (مثل https://almesrati.github.io/ أو نطاق خاص).
const SITE_URL = "https://almesrati.github.io/";
const title = `${company.fullName} | سيراميك وبورسلين وكوطو ورخام`;
const description = `${company.fullName}: سيراميك وبورسلين وكوطو ورخام من الصناعة الليبية والهندية والتركية والمصرية والتونسية. شاهد تصاميم البيوت والحمامات وصور العيّنات الحقيقية من المعرض، احسب كمية البلاط، وجهّز طلبك.`;

// بيانات منظمة لمحركات البحث: فقط ما هو مؤكد. العناوين والهواتف تضاف تلقائياً عند تعبئتها في site-data.
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  name: company.fullName,
  url: SITE_URL,
  logo: SITE_URL + "icon-512.png",
  image: SITE_URL + "og.jpg",
  description,
  ...(socials.length ? { sameAs: socials.map((s) => s.url) } : {}),
  ...(phones.length ? { telephone: phones.map((p) => `+${intlNumber(p.number)}`) } : {}),
  // فرع واحد: عنوانه عنوان الشركة. أكثر من فرع: كل فرع قسم مستقل.
  ...(branches.length === 1
    ? {
        address: { "@type": "PostalAddress", streetAddress: branches[0].address, addressCountry: "LY" },
        ...(branches[0].mapUrl ? { hasMap: branches[0].mapUrl } : {}),
      }
    : {}),
  ...(branches.length > 1
    ? {
        department: branches.map((b) => ({
          "@type": "HomeGoodsStore",
          name: `${company.fullName}، ${b.name}`,
          address: { "@type": "PostalAddress", streetAddress: b.address, addressCountry: "LY" },
          ...(b.phones?.length ? { telephone: b.phones.map((p) => `+${intlNumber(p.number)}`) } : {}),
          ...(b.mapUrl ? { hasMap: b.mapUrl } : {}),
        })),
      }
    : {}),
});

const body = renderToString(<App />);
const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#FFFDF8">
<link rel="canonical" href="${SITE_URL}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${company.fullName}">
<meta property="og:locale" content="ar_LY">
<meta property="og:title" content="${company.fullName}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${SITE_URL}">
<meta property="og:image" content="${SITE_URL}og.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE_URL}og.jpg">
<link rel="icon" href="favicon.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preload" as="font" type="font/woff2" href="fonts/el-messiri-arabic-wght-normal.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="fonts/tajawal-arabic-400-normal.woff2" crossorigin>
<link rel="preload" as="image" href="assets/bg-navy.jpg">
<link rel="stylesheet" href="styles.css">
<script type="application/ld+json">${jsonLd}</script>
<script type="module" src="app.js"></script>
</head>
<body>
<div id="root">${body}</div>
</body>
</html>
`;
writeFileSync("dist/index.html", html);
writeFileSync(
  "dist/404.html",
  `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>الصفحة غير موجودة | ${company.fullName}</title><link rel="icon" href="${SITE_URL}favicon.png" type="image/png"><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0B1F33;color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:2rem}a{display:inline-block;margin-top:1.4rem;background:#BA945C;color:#0B1F33;padding:.7rem 1.4rem;border-radius:6px;font-weight:700;text-decoration:none}</style></head><body><div><h1>الصفحة غير موجودة</h1><p>ربما تغير الرابط أو حُذفت الصفحة.</p><a href="${SITE_URL}">العودة إلى الرئيسية</a></div></body></html>`,
);
writeFileSync(
  "dist/site.webmanifest",
  JSON.stringify(
    {
      name: company.fullName,
      short_name: company.name,
      lang: "ar",
      dir: "rtl",
      start_url: "./",
      display: "standalone",
      background_color: "#0B1F33",
      theme_color: "#0B1F33",
      icons: [
        { src: "icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2,
  ),
);
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`);
writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
);
writeFileSync("dist/.nojekyll", "");
console.log("prerendered", html.length);
