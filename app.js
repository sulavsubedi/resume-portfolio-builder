// Resume Parser and Portfolio Generator

function initApp() {
  const uploadCard = document.getElementById('uploadCard');
  const resumeFile = document.getElementById('resumeFile');
  const previewSection = document.getElementById('previewSection');
  const previewContent = document.getElementById('previewContent');
  const downloadBtn = document.getElementById('downloadBtn');
  const statusMessage = document.getElementById('statusMessage');

  // File reading
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  // Parse resume text
  function parseResume(text) {
    const data = {
      name: '',
      email: '',
      phone: '',
      summary: '',
      skills: [],
      experience: [],
      education: []
    };

    // Extract name
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && trimmed.match(/[A-Z][a-z]+ [A-Z][a-z]+/)) {
        if (trimmed.length < 50 && !trimmed.includes('@') && !trimmed.includes('.')) {
          data.name = trimmed;
          break;
        }
      }
    }

    // Extract email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) data.email = emailMatch[0];

    // Extract phone
    const phoneMatch = text.match(/\+?[0-9][0-9 ()-]{8,20}[0-9]/);
    if (phoneMatch) data.phone = phoneMatch[0];

    // Extract summary
    const summaryMatch = text.match(/(?:summary|objective|profile)[\s:]+([^\n]+)/i);
    if (summaryMatch) data.summary = summaryMatch[1].trim();

    // Extract skills
    const skillsMatch = text.match(/(?:skills|technical|expertise)[\s:]+([^\n]+)/i);
    if (skillsMatch) {
      data.skills = skillsMatch[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
    }

    // Extract experience entries
    const expMatches = text.match(/(?:experience|work|employment)[\s\S]{0,500}/i);
    if (expMatches) {
      const expLines = expMatches[0].split('\n').slice(1, 5);
      data.experience = expLines.map(l => l.trim()).filter(l => l.length > 2);
    }

    // Extract education
    const eduMatch = text.match(/(?:education|degree)[\s:]+([^\n]+)/i);
    if (eduMatch) {
      data.education = eduMatch[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
    }

    return data;
  }

  // Generate portfolio HTML
  function generatePortfolioHTML(data) {
    const name = data.name || 'Professional';
    const skills = data.skills.length > 0 ? data.skills : ['Not specified'];

    let skillsHTML = '';
    skills.forEach(skill => {
      skillsHTML += `<div class="skill-card"><h3>${skill}</h3><p>Professional skill</p></div>`;
    });

    let expHTML = '';
    if (data.experience.length > 0) {
      data.experience.forEach(exp => {
        expHTML += `<li>${exp}</li>`;
      });
    }

    let eduHTML = '';
    if (data.education.length > 0) {
      data.education.forEach(edu => {
        eduHTML += `<li>${edu}</li>`;
      });
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} | Professional Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #f1f5f9; line-height: 1.7; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
    nav { position: fixed; top: 0; width: 100%; background: rgba(15,23,42,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(37,99,235,0.1); z-index: 1000; padding: 16px 0; }
    nav .container { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 1.4rem; font-weight: 700; color: #2563eb; }
    .nav-links { display: flex; gap: 24px; list-style: none; }
    .nav-links a { color: #94a3b8; font-size: 0.9rem; font-weight: 500; text-decoration: none; transition: color 0.3s; }
    .nav-links a:hover { color: #2563eb; }
    @media(max-width: 768px) { .nav-links { display: none; } }
    section { padding: 80px 0; }
    .section-header { text-align: center; margin-bottom: 40px; }
    .section-header .label { color: #2563eb; font-size: 0.85rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
    .section-header h2 { font-size: 2rem; font-weight: 700; }
    .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding-top: 60px; }
    .hero h1 { font-size: 3rem; font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
    .hero p { font-size: 1.1rem; color: #94a3b8; max-width: 600px; margin: 0 auto 28px; }
    .btn { padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 1rem; display: inline-block; text-decoration: none; transition: all 0.3s; }
    .btn-primary { background: #2563eb; color: white; border: none; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,99,235,0.3); }
    .skill-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
    .skill-card { background: #1e293b; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(37,99,235,0.1); transition: all 0.3s; }
    .skill-card:hover { transform: translateY(-4px); border-color: #2563eb; }
    .skill-card h3 { font-size: 1rem; margin-bottom: 4px; }
    .skill-card p { color: #94a3b8; font-size: 0.85rem; }
    .experience-list, .education-list { list-style: none; }
    .experience-list li, .education-list li { background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 12px; border-left: 3px solid #2563eb; }
    footer { background: rgba(30,41,59,0.6); padding: 30px 0; text-align: center; border-top: 1px solid rgba(37,99,235,0.1); }
    footer p { color: #94a3b8; font-size: 0.875rem; }
    @media(max-width: 768px) { .hero h1 { font-size: 2rem; } }
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <div class="logo">${name}</div>
      <ul class="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <h1>${name}</h1>
      <p>${data.summary || 'Professional ready for new opportunities'}</p>
      <a href="#contact" class="btn btn-primary">Get In Touch</a>
    </div>
  </section>

  <section id="about">
    <div class="container">
      <div class="section-header">
        <p class="label">About</p>
        <h2>Who I Am</h2>
      </div>
      <p style="text-align: center; max-width: 600px; margin: 0 auto; color: #94a3b8;">${data.summary || 'Passionate professional dedicated to excellence and continuous growth.'}</p>
    </div>
  </section>

  <section id="skills">
    <div class="container">
      <div class="section-header">
        <p class="label">Skills</p>
        <h2>Technical Expertise</h2>
      </div>
      <div class="skill-grid">${skillsHTML}</div>
    </div>
  </section>

  <section id="experience">
    <div class="container">
      <div class="section-header">
        <p class="label">Experience</p>
        <h2>Work History</h2>
      </div>
      <ul class="experience-list">${expHTML || '<li>No experience details found</li>'}</ul>
    </div>
  </section>

  <section id="education">
    <div class="container">
      <div class="section-header">
        <p class="label">Education</p>
        <h2>Academic Background</h2>
      </div>
      <ul class="education-list">${eduHTML || '<li>No education details found</li>'}</ul>
    </div>
  </section>

  <section id="contact">
    <div class="container">
      <div class="section-header">
        <p class="label">Contact</p>
        <h2>Get In Touch</h2>
      </div>
      <div style="text-align: center; color: #94a3b8;">
        ${data.email ? '<p>Email: ' + data.email + '</p>' : ''}
        ${data.phone ? '<p>Phone: ' + data.phone + '</p>' : ''}
      </div>
    </div>
  </section>

  <footer>
    <p>&copy; 2024 ${name} | Generated by Resume-to-Portfolio Builder</p>
  </footer>
</body>
</html>`;
  }

  // Download portfolio HTML
  function downloadPortfolio(html, name) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.replace(/\s+/g, '-') + '-portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Show live preview
  function showPreview(html) {
    previewContent.innerHTML = html;
    previewSection.classList.add('active');
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Main generate function
  async function generatePortfolio() {
    statusMessage.textContent = 'Parsing your resume...';
    previewSection.classList.remove('active');

    try {
      const file = resumeFile.files[0];
      const text = await readFile(file);
      const resumeData = parseResume(text);
      const portfolioHTML = generatePortfolioHTML(resumeData);

      showPreview(portfolioHTML);

      // Setup download button
      downloadBtn.onclick = () => {
        downloadPortfolio(portfolioHTML, resumeData.name || 'portfolio');
      };

      statusMessage.textContent = 'Portfolio generated successfully!';
      console.log('Portfolio generated for:', resumeData.name);
      console.log('Resume data:', resumeData);
    } catch (error) {
      console.error('Error:', error);
      statusMessage.textContent = 'Error parsing resume. Please try again.';
    }
  }

  // Drag and drop
  uploadCard.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadCard.classList.add('dragover');
  });

  uploadCard.addEventListener('dragleave', () => {
    uploadCard.classList.remove('dragover');
  });

  uploadCard.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadCard.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      resumeFile.files = files;
      generatePortfolio();
    }
  });

  // File input
  resumeFile.addEventListener('change', () => {
    if (resumeFile.files.length > 0) {
      generatePortfolio();
    }
  });

  // Click on card
  uploadCard.addEventListener('click', (e) => {
    if (e.target !== resumeFile) {
      resumeFile.click();
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);
