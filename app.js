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

  function parseResume(text) {
    const data = {
      name: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
      skills: [],
      softSkills: [],
      experience: [],
      education: []
    };

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Define section headers
    const sectionHeaders = [
      'profile', 'summary', 'objective',
      'skills', 'technical skills', 'soft skills',
      'education', 'experience', 'work experience', 'work', 'employment',
      'contact'
    ];

    // Words that should NOT be treated as skills
    const skillExclusions = [
      'profile', 'summary', 'objective', 'skills', 'technical skills',
      'soft skills', 'education', 'experience', 'work experience', 'work',
      'employment', 'contact', 'work history', 'professional experience',
      'professional skills', 'key skills', 'core skills', 'career',
      'references', 'languages', 'certifications', 'achievements',
      'projects', 'publications', 'awards', 'honors', 'volunteer',
      'hobbies', 'interests', 'about', 'bio', 'introduction'
    ];

    let currentSection = 'header';
    let currentItem = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();

      // Check if this line is a section header
      let isSectionHeader = false;
      for (const header of sectionHeaders) {
        if (lower === header || lower === header.replace(/\s+/g, '')) {
          currentSection = header;
          isSectionHeader = true;
          currentItem = null;
          break;
        }
      }
      if (isSectionHeader) continue;

      // HEADER section - parse name, email, phone, address
      if (currentSection === 'header') {
        // Email
        const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          data.email = emailMatch[0];
          continue;
        }
        // Phone
        if (line.match(/^[+]?[0-9]{10,15}$/)) {
          data.phone = line;
          continue;
        }
        // Address (lines with common address words)
        if (line.match(/\b(street|road|lane|avenue|kol|kathmandu|pokhara|nepal|tokha|baneshwor|baluwatar|baniyatar|budhanilkantha|mandikhatar)\b/i) && !data.name) {
          data.address = line;
          continue;
        }
        // Name - first alphabetic line with 2-4 words
        if (!data.name) {
          const words = line.split(/\s+/);
          if (words.length >= 2 && words.length <= 5 &&
              words.every(w => /^[A-Za-z]+$/.test(w) && w.length >= 2)) {
            const excluded = ['trinity', 'islington', 'galaxy', 'global', 'diamond',
              'college', 'school', 'university', 'academy', 'institute', 'education',
              'skills', 'experience', 'work', 'profile', 'summary', 'technical',
              'soft', 'intern', 'freelancing', 'motion', 'graphic', 'designer',
              'marketing', 'multimedia', 'secondary', 'bachelors', 'davinci',
              'resolve', 'adobe', 'after', 'effects', 'photography', 'cinematography',
              'videography', 'research', 'documentation', 'communication', 'social',
              'media', 'upper', 'lower', 'international'];
            let ok = true;
            for (const w of words) {
              if (excluded.includes(w.toLowerCase())) { ok = false; break; }
            }
            if (ok) data.name = line;
          }
        }
        continue;
      }

      // PROFILE/SUMMARY/OBJECTIVE section
      if (currentSection === 'profile' || currentSection === 'summary' || currentSection === 'objective') {
        if (!data.summary) data.summary = line.substring(0, 300);
        else if (data.summary.length < 300) data.summary += ' ' + line;
        continue;
      }

      // SKILLS section - Technical skills
      if (currentSection === 'skills' || currentSection === 'technical skills') {
        const skillExcl = [...skillExclusions, 'davinci', 'resolve', 'adobe', 'after', 'effects',
          'graphic', 'design', 'photography', '3d', 'maya', 'cinematography', 'videography'];
        const lowerSkill = lower;
        let isExcluded = false;
        for (const ex of skillExcl) {
          if (lowerSkill === ex || lowerSkill.includes(ex)) {
            isExcluded = true; break;
          }
        }
        // Skip lines that look like dates, companies, or addresses
        if (!isExcluded && !line.match(/^(20\d{2}|19\d{2}|january|february|march|april|may|june|july|august|september|october|november|december)/i) &&
            line.length > 1 && line.length < 50) {
          data.skills.push(line);
        }
        continue;
      }

      // SOFT SKILLS section
      if (currentSection === 'soft skills') {
        const lowerSkill = lower;
        const isExcluded = skillExclusions.some(ex => lowerSkill === ex || lowerSkill.includes(ex));
        if (!isExcluded && line.length > 1 && line.length < 50) {
          data.softSkills.push(line);
        }
        continue;
      }

      // EDUCATION section
      if (currentSection === 'education') {
        // Check if this looks like a year line
        if (line.match(/^(20\d{2}|19\d{2})$/)) {
          if (currentItem) { currentItem.year = line; }
          continue;
        }
        // Check if it looks like an institution (has College, School, University, etc.)
        if (line.match(/\b(college|school|university|academy|institute)\b/i)) {
          if (!currentItem) {
            currentItem = { degree: '', institution: line, year: '' };
            data.education.push(currentItem);
          } else {
            currentItem.institution = line;
          }
          continue;
        }
        // Otherwise it's likely a degree/description
        if (!currentItem) {
          currentItem = { degree: line, institution: '', year: '' };
          data.education.push(currentItem);
        } else if (!currentItem.degree) {
          currentItem.degree = line;
        }
        continue;
      }

      // EXPERIENCE section
      if (currentSection === 'experience' || currentSection === 'work experience' || currentSection === 'work' || currentSection === 'employment') {
        // Check if this looks like a date line
        if (line.match(/^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}|\d{4}\s+-|\d{4}\s*-\s*\d{4}|ongoing/i)) {
          if (!currentItem) {
            currentItem = { role: '', company: '', date: line, description: '' };
            data.experience.push(currentItem);
          } else {
            currentItem.date = line;
          }
          continue;
        }
        // Check if it looks like a company (has address words or company indicators)
        if (line.match(/\b(group|fitness|academy|education|hospitality|college|school|ltd|ltd\.|inc|corp|company|nepal|kathmandu|baniyatar|budhanilkantha|mandikhatar|baluwatar)\b/i)) {
          if (!currentItem) {
            currentItem = { role: '', company: line, date: '', description: '' };
            data.experience.push(currentItem);
          } else if (!currentItem.company) {
            currentItem.company = line;
          } else {
            currentItem.description += ' ' + line;
          }
          continue;
        }
        // Otherwise it's a role or description
        if (!currentItem) {
          currentItem = { role: line, company: '', date: '', description: '' };
          data.experience.push(currentItem);
        } else if (!currentItem.role || currentItem.role === currentItem.company) {
          if (!currentItem.role) currentItem.role = line;
          else if (!currentItem.company) currentItem.company = line;
        } else {
          currentItem.description += ' ' + line;
        }
        continue;
      }

      // CONTACT section
      if (currentSection === 'contact') {
        if (!data.email && line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
          data.email = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)[0];
        }
        if (!data.phone && line.match(/^[+]?[0-9]{10,15}$/)) {
          data.phone = line;
        }
        if (!data.address && line.match(/\b(street|road|lane|kol)\b/i)) {
          data.address = line;
        }
        continue;
      }
    }

    // Deduplicate and filter skills
    data.skills = [...new Set(data.skills)];
    data.softSkills = [...new Set(data.softSkills)];

    return data;
  }
  function generatePortfolioHTML(data) {
    const name = data.name || 'Professional';
    const skills = data.skills.slice(0, 12);
    const softSkills = data.softSkills.slice(0, 8);

    // Build skills HTML
    let skillsHTML = '';
    skills.forEach(function(skill) {
      skillsHTML += '<div class="skill-card"><h3>' + skill + '</h3><p>Technical skill</p></div>';
    });
    softSkills.forEach(function(skill) {
      skillsHTML += '<div class="skill-card"><h3>' + skill + '</h3><p>Soft skill</p></div>';
    });
    if (!skillsHTML) skillsHTML = '<div class="skill-card"><h3>Not specified</h3><p>Skills not provided</p></div>';

    // Build experience HTML - grouped entries
    let expHTML = '';
    if (data.experience.length > 0) {
      data.experience.forEach(function(exp) {
        let roleText = exp.role ? '<strong>' + exp.role + '</strong>' : '';
        let companyText = exp.company ? ' at ' + exp.company : '';
        let dateText = exp.date ? ' (' + exp.date + ')' : '';
        let descText = exp.description ? '<br><small>' + exp.description + '</small>' : '';
        expHTML += '<li>' + roleText + companyText + dateText + descText + '</li>';
      });
    } else {
      expHTML = '<li>No experience details found</li>';
    }

    // Build education HTML - grouped entries
    let eduHTML = '';
    if (data.education.length > 0) {
      data.education.forEach(function(edu) {
        let degreeText = edu.degree ? '<strong>' + edu.degree + '</strong>' : '';
        let instText = edu.institution ? ' - ' + edu.institution : '';
        let yearText = edu.year ? ' (' + edu.year + ')' : '';
        eduHTML += '<li>' + degreeText + instText + yearText + '</li>';
      });
    } else {
      eduHTML = '<li>No education details found</li>';
    }

    return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>' + name + ' | Portfolio</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Segoe UI,sans-serif;background:#0f172a;color:#f1f5f9;line-height:1.7}.container{max-width:900px;margin:0 auto;padding:0 24px}nav{position:fixed;top:0;width:100%;background:rgba(15,23,42,.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(37,99,235,.1);z-index:1000;padding:16px 0}nav .container{display:flex;justify-content:space-between;align-items:center}.logo{font-size:1.4rem;font-weight:700;color:#2563eb}.nav-links{display:flex;gap:24px;list-style:none}.nav-links a{color:#94a3b8;font-size:.9rem;font-weight:500;text-decoration:none;transition:color .3s}.nav-links a:hover{color:#2563eb}@media(max-width:768px){.nav-links{display:none}}section{padding:80px 0}.section-header{text-align:center;margin-bottom:40px}.section-header .label{color:#2563eb;font-size:.85rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}.section-header h2{font-size:2rem;font-weight:700}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding-top:60px}.hero h1{font-size:3rem;font-weight:800;line-height:1.2;margin-bottom:16px}.hero p{font-size:1.1rem;color:#94a3b8;max-width:600px;margin:0 auto 28px}.btn{padding:12px 28px;border-radius:8px;font-weight:600;font-size:1rem;display:inline-block;text-decoration:none;transition:all .3s}.btn-primary{background:#2563eb;color:#fff;border:none}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(37,99,235,.3)}.skill-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px}.skill-card{background:#1e293b;border-radius:12px;padding:20px;text-align:center;border:1px solid rgba(37,99,235,.1);transition:all .3s}.skill-card:hover{transform:translateY(-4px);border-color:#2563eb}.skill-card h3{font-size:1rem;margin-bottom:4px}.skill-card p{color:#94a3b8;font-size:.85rem}.experience-list,.education-list{list-style:none}.experience-list li,.education-list li{background:#1e293b;border-radius:8px;padding:16px;margin-bottom:12px;border-left:3px solid #2563eb}footer{background:rgba(30,41,59,.6);padding:30px 0;text-align:center;border-top:1px solid rgba(37,99,235,.1)}footer p{color:#94a3b8;font-size:.875rem}@media(max-width:768px){.hero h1{font-size:2rem}}</style></head><body><nav><div class="container"><div class="logo">' + name + '</div><ul class="nav-links"><li><a href="#about">About</a></li><li><a href="#skills">Skills</a></li><li><a href="#experience">Experience</a></li><li><a href="#education">Education</a></li><li><a href="#contact">Contact</a></li></ul></div></nav><section class="hero"><div class="container"><h1>' + name + '</h1><p>' + (data.summary || 'Professional ready for new opportunities') + '</p><a href="#contact" class="btn btn-primary">Get In Touch</a></div></section><section id="about"><div class="container"><div class="section-header"><p class="label">About</p><h2>Who I Am</h2></div><p style="text-align:center;max-width:600px;margin:0 auto;color:#94a3b8">' + (data.summary || 'Passionate professional dedicated to excellence.') + '</p></div></section><section id="skills"><div class="container"><div class="section-header"><p class="label">Skills</p><h2>Technical Expertise</h2></div><div class="skill-grid">' + skillsHTML + '</div></div></section><section id="experience"><div class="container"><div class="section-header"><p class="label">Experience</p><h2>Work History</h2></div><ul class="experience-list">' + expHTML + '</ul></div></section><section id="education"><div class="container"><div class="section-header"><p class="label">Education</p><h2>Academic Background</h2></div><ul class="education-list">' + eduHTML + '</ul></div></section><section id="contact"><div class="container"><div class="section-header"><p class="label">Contact</p><h2>Get In Touch</h2></div><div style="text-align:center;color:#94a3b8">' + (data.email ? '<p>Email: ' + data.email + '</p>' : '') + (data.phone ? '<p>Phone: ' + data.phone + '</p>' : '') + (data.address ? '<p>Address: ' + data.address + '</p>' : '') + '</div></div></section><footer><p>&copy; 2024 ' + name + ' | Generated by Resume-to-Portfolio Builder</p></footer></body></html>';
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
