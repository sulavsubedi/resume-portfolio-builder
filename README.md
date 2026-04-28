# Resume-to-Portfolio Builder

> Transform your resume into a stunning, professional portfolio website with a single click.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-beta-orange.svg)]()

## What is Resume-to-Portfolio Builder?

Resume-to-Portfolio Builder is an AI-powered platform that automatically generates professional portfolio websites from user resumes. Similar to resumebuilder.io, but with a focus on creating live, shareable portfolio websites.

## How It Works

1. **Upload Resume** - Users upload their resume (PDF, DOCX, or TXT)
2. **AI Parsing** - Our system parses the resume to extract key information
3. **Auto-Generation** - A professional portfolio website is automatically generated
4. **Live URL** - Users receive a shareable live URL for their portfolio

## Features

- ✨ **Instant Generation** - Upload and generate in seconds
- 🎨 **Professional Design** - Modern, minimalistic portfolio templates
- 🔗 **Shareable URLs** - Live websites with unique URLs
- 📱 **Responsive Design** - Works perfectly on all devices
- 🌐 **Multiple Templates** - Choose from various portfolio styles
- 🔒 **Privacy Focused** - Secure resume processing

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **AI/ML**: Python, Natural Language Processing
- **Deployment**: GitHub Actions, GitHub Pages
- **Storage**: AWS S3, Firebase

## Architecture

```
User Upload → Resume Parser → Portfolio Generator → GitHub Pages Deployment → Live URL
```

## Project Structure

```
resume-portfolio-builder/
├── index.html          # Main upload interface
├── README.md          # Project documentation
├── .github/
│   └── workflows/
│       └── static.yml # GitHub Pages deployment
├── templates/
│   ├── modern.html    # Modern portfolio template
│   ├── classic.html   # Classic portfolio template
│   └── creative.html  # Creative portfolio template
├── scripts/
│   ├── parser.js      # Resume parsing logic
│   └── generator.js   # Portfolio generation
└── styles/
    └── main.css       # Main styles
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- GitHub account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/sulavsubedi/resume-portfolio-builder.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### For Users

1. Visit the website
2. Upload your resume (PDF, DOCX, or TXT)
3. Select a portfolio template
4. Click "Generate Portfolio"
5. Receive your live portfolio URL

### For Developers

```javascript
// Example: Parse resume and generate portfolio
import { parseResume } from './scripts/parser';
import { generatePortfolio } from './scripts/generator';

const resumeData = await parseResume(resumeFile);
const portfolioUrl = await generatePortfolio(resumeData);

console.log(`Portfolio generated at: ${portfolioUrl}`);
```

## AI Resume Parsing

Our AI-powered parser extracts:
- Personal Information (Name, Contact, Location)
- Professional Summary
- Work Experience
- Education
- Skills & Certifications
- Projects
- Languages

## Portfolio Templates

### Modern Template
- Clean, minimalistic design
- Dark theme with accent colors
- Hero section with professional introduction

### Classic Template  
- Traditional professional layout
- Light theme with structured sections
- Emphasis on content over design

### Creative Template
- Bold, unique design
- Custom animations
- Creative layout for designers/artists

## Deployment

### GitHub Pages
The platform uses GitHub Actions to automatically deploy generated portfolios to GitHub Pages:

```yaml
name: Deploy Portfolio
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Custom Domain Support
Users can optionally connect their custom domain to their portfolio.

## API Reference

### Resume Upload
```http
POST /api/upload
Content-Type: multipart/form-data

file: resume.pdf
```

### Portfolio Generation
```http
POST /api/generate
Content-Type: application/json

{
  "resumeData": {...},
  "template": "modern"
}
```

### Get Portfolio URL
```http
GET /api/portfolio/:id

Response:
{
  "url": "https://sulavsubedi.github.io/portfolio-{id}",
  "status": "ready"
}
```

## Roadmap

- [x] Basic resume upload interface
- [x] Minimalistic design
- [ ] AI-powered resume parsing
- [ ] Multiple portfolio templates
- [ ] Custom domain support
- [ ] Portfolio analytics
- [ ] Template customization
- [ ] Social media integration
- [ ] Print/PDF export
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by resumebuilder.io and similar platforms
- Built with ❤️ for job seekers and professionals
- Community contributions welcome

---

**Resume-to-Portfolio Builder** © 2024 Sulav Subedi

Made with passion for creating professional online presence.
