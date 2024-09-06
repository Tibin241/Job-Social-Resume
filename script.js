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
            const isOptimized = file.name.toLowerCase().includes('optimized');
            const simulatedAnalysis = generateAnalysis(isOptimized);
            displayAnalysisResult(simulatedAnalysis, isOptimized);
            analyzeButton.textContent = 'Analysis Complete';
            analyzeButton.disabled = true;
            hasAnalyzed = true;
        }, 2000);
    }
  
    function generateAnalysis(isOptimized) {
        const score = isOptimized ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 31) + 40;
        const optimizationIssues = [
            'Complex formatting may hinder automatic parsing',
            'Lacking essential industry-specific terms',
            'Non-standard section headers',
            'Use of multi-column layouts or tables',
            'Inconsistent date formats across the document'
        ];
        const optimizationStrengths = [
            'Clean, parsing-friendly format',
            'Good use of industry-specific terminology',
            'Clear, standard section headings',
            'Single-column layout for easy scanning',
            'Consistent date formatting throughout'
        ];
        const selectedItems = isOptimized ? optimizationStrengths : optimizationIssues;
  
        return {
            score: score,
            items: selectedItems
        };
    }
  
    function displayAnalysisResult(result, isOptimized) {
        const itemsHtml = result.items.map(item => `<li>${isOptimized ? item : `<span style="color: #FF4136;">${item}</span>`}</li>`).join('');
  
        analysisResult.innerHTML = `
            <h3>Resume Optimization Analysis</h3>
            <p> ATS compatibility score: <strong>${result.score}/100</strong>.</p>
            ${isOptimized ? 
                `<p style="color: #2ECC40;"><strong>Great news!</strong> Your resume is well-formatted for automatic screening systems.</p>` : 
                `<p style="color: #FF4136;"><strong>Caution:</strong> Your resume may face challenges with automatic screening systems.</p>`
            }
            <p>${isOptimized ? 'Optimization strengths:' : 'Areas for improvement:'}</p>
            <ul>
                ${itemsHtml}
            </ul>
            ${isOptimized ? 
                `<p>Your resume is well-positioned to pass through digital screening processes.</p>` :
                `<p style="color: #FF4136;"><strong>These issues may prevent you from getting shortlisted for interviews.</strong></p>`
            }
            <p><strong>Contact our resume experts on WhatsApp!</strong> We'll help you ${isOptimized ? 'further enhance' : 'optimize'} your resume for better results in your job search.</p>
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