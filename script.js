document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('resume-file');
  const fileNameDisplay = document.getElementById('file-name');
  const analyzeButton = document.getElementById('analyze-button');
  const analysisResult = document.getElementById('analysis');
  let hasAnalyzed = false;

  fileInput.addEventListener('change', (e) => {
      const fileName = e.target.files[0].name;
      fileNameDisplay.textContent = fileName;
      if (hasAnalyzed) {
          resetAnalysis();
      }
  });

  analyzeButton.addEventListener('click', analyzeResume);

  function analyzeResume() {
      const file = fileInput.files[0];
      if (!file) {
          alert('Please select a file first.');
          return;
      }

      if (hasAnalyzed) {
          alert('You have already analyzed a resume. Please upload a new file to analyze again.');
          return;
      }

      analyzeButton.textContent = 'Analyzing...';
      analyzeButton.disabled = true;

      setTimeout(() => {
          const isAtsOptimized = file.name.toLowerCase().includes('ats');
          const simulatedAnalysis = generateAnalysis(file, isAtsOptimized);
          displayAnalysisResult(simulatedAnalysis, isAtsOptimized);
          analyzeButton.textContent = 'Analysis Complete';
          analyzeButton.disabled = true;
          hasAnalyzed = true;
      }, 2000);
  }

  function generateAnalysis(file, isAtsOptimized) {
      const score = isAtsOptimized ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 31) + 40;
      const weaknesses = [
          'Lack of quantifiable achievements',
          'Missing important keywords for target job',
          'Unclear career progression',
          'Inconsistent formatting',
          'Too verbose in some sections'
      ];
      const strengths = [
          'Well-optimized for ATS systems',
          'Clear and concise formatting',
          'Strong use of industry-specific keywords',
          'Quantifiable achievements highlighted',
          'Tailored to target job requirements'
      ];
      const selectedItems = isAtsOptimized ? strengths : weaknesses;

      return {
          score: score,
          items: selectedItems,
          pages: Math.floor(Math.random() * 2) + 1,
          fileSize: (Math.random() * (5 - 0.5) + 0.5).toFixed(1)
      };
  }

  function displayAnalysisResult(result, isAtsOptimized) {
      const itemsHtml = result.items.map(item => `<li>${isAtsOptimized ? item : `<span style="color: #FF4136;">${item}</span>`}</li>`).join('');

      analysisResult.innerHTML = `
          <h3>Resume Analysis Result</h3>
          <p>Your resume is ${result.pages} page(s) long and ${result.fileSize} MB in size.</p>
          <p>Your resume score is <strong>${result.score}/100</strong>.</p>
          ${isAtsOptimized ? 
              `<p style="color: #2ECC40;"><strong>Great job!</strong> Your resume is well-optimized for ATS systems and likely to pass initial screenings.</p>` : 
              `<p style="color: #FF4136;"><strong>Warning:</strong> This resume is likely to be <strong>rejected</strong> by both recruiters and ATS systems.</p>`
          }
          <p>${isAtsOptimized ? 'Here are the strengths of your resume:' : '<strong>Critical issues</strong> holding your resume back:'}</p>
          <ul>
              ${itemsHtml}
          </ul>
          ${isAtsOptimized ? 
              `<p>Your resume is well-positioned to make a strong impression on recruiters and pass ATS screenings.</p>` :
              `<p style="color: #FF4136;"><strong>These issues significantly reduce your chances of getting interviews and landing your dream job.</strong></p>`
          }
          <h4>Need Expert Help?</h4>
          <p><strong>Contact us on WhatsApp now!</strong> Our resume experts will help you ${isAtsOptimized ? 'perfect' : 'transform'} your resume and boost your job search success.</p>
      `;

      document.getElementById('cta-container').style.display = 'block';
  }

  function resetAnalysis() {
      analysisResult.innerHTML = '';
      analyzeButton.textContent = 'Analyze Now';
      analyzeButton.disabled = false;
      hasAnalyzed = false;
      document.getElementById('cta-container').style.display = 'none';
  }
});

function contactWhatsApp() {
  window.open('https://wa.me/+918129917227', '_blank');
}


function adjustFooter() {
    const footer = document.querySelector('.footer-wrapper');
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(body.scrollHeight, body.offsetHeight, 
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    
    if (height > window.innerHeight) {
      footer.style.marginTop = '0';
    } else {
      footer.style.marginTop = `${window.innerHeight - height}px`;
    }
  }
  
  window.addEventListener('load', adjustFooter);
  window.addEventListener('resize', adjustFooter);