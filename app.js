// Resume Parser and Portfolio Generator
let currentPortfolioHTML = '';
let currentName = '';

function initApp() {
  const uploadCard = document.getElementById('uploadCard');
  const resumeFile = document.getElementById('resumeFile');
  const previewSection = document.getElementById('previewSection');
  const previewContent = document.getElementById('previewContent');
  const downloadBtn = document.getElementById('downloadBtn');
  const openBtn = document.getElementById('openBtn');
  const statusMessage = document.getElementById('statusMessage');
  const generateBtn = document.getElementById('generateBtn');
  const pasteArea = document.getElementById('pasteArea');

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  function parseResume(text) {
    const data = { name: '', email: '', phone: '', summary: '', skills: [], experience: [], education: [] };
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // SECTION-BASED PARSING
    let currentSection = 'header';
    const sectionLabels = ['profile', 'summary', 'objective', 'skills', 'technical skills', 'soft skills', 'education', 'experience', 'work experience', 'work', 'employment', 'contact'];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();

      // Check if this line is a section label
      let isSection = false;
      for (const label of sectionLabels) {
        if (lower === label || lower === label.replace(' ', '')) {
          currentSection = label;
          isSection = true;
          break;
        }
      }
      if (isSection) continue;

      // Parse based on current section
      if (currentSection === 'header') {
        // First non-empty line that looks like a name
        const words = line.split(/\s+/);
        if (words.length >= 2 && words.length <= 4 && words.every(w => /^[A-Za-z]+$/.test(w) && w.length >= 2)) {
          // Exclude known institutions and roles
          const excluded = ['trinity', 'islington', 'galaxy', 'global', 'diamond', 'college', 'school', 'university', 'academy', 'institute', 'education', 'skills', 'experience', 'work', 'profile', 'summary', 'technical', 'soft', 'intern', 'freelancing', 'motion', 'graphic', 'designer', 'marketing', 'multimedia', 'secondary', 'bachelors'];
          let ok = true;
          for (const w of words) {
            if (excluded.includes(w.toLowerCase())) { ok = false; break; }
          }
          if (ok && !data.name) data.name = line;
        }
        // Email
        if (line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
          data.email = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)[0];
        }
        // Phone
        if (line.match(/^[+]?[0-9]{10,15}$/)) {
          data.phone = line;
        }
      }

      if (currentSection === 'profile' || currentSection === 'summary' || currentSection === 'objective') {
        if (!data.summary) data.summary = line.substring(0, 200);
        else if (data.summary.length < 200) data.summary += ' ' + line;
      }

      if (currentSection === 'skills' || currentSection === 'technical skills' || currentSection === 'soft skills') {
        const items = line.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 50);
        data.skills = data.skills.concat(items);
      }

      if (currentSection === 'education') {
        data.education.push(line);
      }

      if (currentSection === 'experience' || currentSection === 'work experience' || currentSection === 'work' || currentSection === 'employment') {
        data.experience.push(line);
      }

      if (currentSection === 'contact') {
        if (!data.email && line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
          data.email = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)[0];
        }
        if (!data.phone && line.match(/^[+]?[0-9]{10,15}$/)) {
          data.phone = line;
        }
      }
    }

    // Deduplicate skills
    data.skills = [...new Set(data.skills)];

    return data;
  }

  function generatePortfolioHTML(data) {
    const name = data.name || 'Professional';
    const skills = data.skills.length > 0 ? data.skills.slice(0, 12) : ['Not specified'];
    let skillsHTML = '';
    skills.forEach(function(skill) { skillsHTML += '<div class="skill-card"><h3>' + skill + '</h3><p>Professional skill</p></div>'; });
    let expHTML = '';
    if (data.experience.length > 0) { for (var i = 0; i < data.experience.length; i++) { expHTML += '<li>' + data.experience[i] + '</li>'; } }
    let eduHTML = '';
    if (data.education.length > 0) { for (var j = 0; j < data.education.length; j++) { eduHTML += '<li>' + data.education[j] + '</li>'; } }
    return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>' + name + ' | Portfolio</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Segoe UI,sans-serif;background:#0f172a;color:#f1f5f9;line-height:1.7}.container{max-width:900px;margin:0 auto;padding:0 24px}nav{position:fixed;top:0;width:100%;background:rgba(15,23,42,.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(37,99,235,.1);z-index:1000;padding:16px 0}nav .container{display:flex;justify-content:space-between;align-items:center}.logo{font-size:1.4rem;font-weight:700;color:#2563eb}.nav-links{display:flex;gap:24px;list-style:none}.nav-links a{color:#94a3b8;font-size:.9rem;font-weight:500;text-decoration:none;transition:color .3s}.nav-links a:hover{color:#2563eb}@media(max-width:768px){.nav-links{display:none}}section{padding:80px 0}.section-header{text-align:center;margin-bottom:40px}.section-header .label{color:#2563eb;font-size:.85rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}.section-header h2{font-size:2rem;font-weight:700}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding-top:60px}.hero h1{font-size:3rem;font-weight:800;line-height:1.2;margin-bottom:16px}.hero p{font-size:1.1rem;color:#94a3b8;max-width:600px;margin:0 auto 28px}.btn{padding:12px 28px;border-radius:8px;font-weight:600;font-size:1rem;display:inline-block;text-decoration:none;transition:all .3s}.btn-primary{background:#2563eb;color:#fff;border:none}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(37,99,235,.3)}.skill-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px}.skill-card{background:#1e293b;border-radius:12px;padding:20px;text-align:center;border:1px solid rgba(37,99,235,.1);transition:all .3s}.skill-card:hover{transform:translateY(-4px);border-color:#2563eb}.skill-card h3{font-size:1rem;margin-bottom:4px}.skill-card p{color:#94a3b8;font-size:.85rem}.experience-list,.education-list{list-style:none}.experience-list li,.education-list li{background:#1e293b;border-radius:8px;padding:16px;margin-bottom:12px;border-left:3px solid #2563eb}footer{background:rgba(30,41,59,.6);padding:30px 0;text-align:center;border-top:1px solid rgba(37,99,235,.1)}footer p{color:#94a3b8;font-size:.875rem}@media(max-width:768px){.hero h1{font-size:2rem}}</style></head><body><nav><div class="container"><div class="logo">' + name + '</div><ul class="nav-links"><li><a href="#about">About</a></li><li><a href="#skills">Skills</a></li><li><a href="#experience">Experience</a></li><li><a href="#education">Education</a></li><li><a href="#contact">Contact</a></li></ul></div></nav><section class="hero"><div class="container"><h1>' + name + '</h1><p>' + (data.summary || 'Professional ready for new opportunities') + '</p><a href="#contact" class="btn btn-primary">Get In Touch</a></div></section><section id="about"><div class="container"><div class="section-header"><p class="label">About</p><h2>Who I Am</h2></div><p style="text-align:center;max-width:600px;margin:0 auto;color:#94a3b8">' + (data.summary || 'Passionate professional dedicated to excellence.') + '</p></div></section><section id="skills"><div class="container"><div class="section-header"><p class="label">Skills</p><h2>Technical Expertise</h2></div><div class="skill-grid">' + skillsHTML + '</div></div></section><section id="experience"><div class="container"><div class="section-header"><p class="label">Experience</p><h2>Work History</h2></div><ul class="experience-list">' + (expHTML || '<li>No experience details found</li>') + '</ul></div></section><section id="education"><div class="container"><div class="section-header"><p class="label">Education</p><h2>Academic Background</h2></div><ul class="education-list">' + (eduHTML || '<li>No education details found</li>') + '</ul></div></section><section id="contact"><div class="container"><div class="section-header"><p class="label">Contact</p><h2>Get In Touch</h2></div><div style="text-align:center;color:#94a3b8">' + (data.email ? '<p>Email: ' + data.email + '</p>' : '') + (data.phone ? '<p>Phone: ' + data.phone + '</p>' : '') + '</div></div></section><footer><p>&copy; 2024 ' + name + ' | Generated by Resume-to-Portfolio Builder</p></footer></body></html>';
  }

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

  function showPreview(html) {
    previewContent.innerHTML = html;
    previewSection.classList.add('active');
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function openPortfolio(html) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  function processText(text) {
    statusMessage.textContent = 'Parsing...';
    previewSection.classList.remove('active');
    try {
      const resumeData = parseResume(text);
      currentName = resumeData.name || 'Professional';
      currentPortfolioHTML = generatePortfolioHTML(resumeData);
      showPreview(currentPortfolioHTML);
      statusMessage.textContent = 'Portfolio generated!';
      console.log('Parsed:', resumeData);
    } catch (e) {
      console.error(e);
      statusMessage.textContent = 'Error. Try again.';
    }
  }

  function generatePortfolio() {
    statusMessage.textContent = 'Parsing...';
    previewSection.classList.remove('active');
    try {
      const file = resumeFile.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const text = e.target.result;
        const resumeData = parseResume(text);
        currentName = resumeData.name || 'Professional';
        currentPortfolioHTML = generatePortfolioHTML(resumeData);
        showPreview(currentPortfolioHTML);
        statusMessage.textContent = 'Portfolio generated!';
        console.log('Parsed:', resumeData);
      };
      reader.readAsText(file);
    } catch (e) {
      console.error(e);
      statusMessage.textContent = 'Error. Try again.';
    }
  }

  downloadBtn.onclick = function() { if (currentPortfolioHTML) downloadPortfolio(currentPortfolioHTML, currentName); };
  openBtn.onclick = function() { if (currentPortfolioHTML) openPortfolio(currentPortfolioHTML); };
  generateBtn.onclick = function() {
    const text = pasteArea.value.trim();
    if (text) processText(text);
    else if (resumeFile.files.length > 0) generatePortfolio();
    else statusMessage.textContent = 'Upload a file or paste text.';
  };

  uploadCard.addEventListener('dragover', function(e) { e.preventDefault(); uploadCard.classList.add('dragover'); });
  uploadCard.addEventListener('dragleave', function() { uploadCard.classList.remove('dragover'); });
  uploadCard.addEventListener('drop', function(e) { e.preventDefault(); uploadCard.classList.remove('dragover'); if (e.dataTransfer.files.length > 0) { resumeFile.files = e.dataTransfer.files; generatePortfolio(); } });
  resumeFile.addEventListener('change', function() { if (resumeFile.files.length > 0) generatePortfolio(); });
  uploadCard.addEventListener('click', function(e) { if (e.target !== resumeFile && e.target !== pasteArea && e.target !== generateBtn) resumeFile.click(); });
}
document.addEventListener('DOMContentLoaded', initApp);
