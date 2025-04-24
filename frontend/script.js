document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const resumeFile = document.getElementById('resume').files[0];
    const jdText = document.getElementById('jd').value;
  
    // File type validation: Check if the file is a PDF
    if (resumeFile && resumeFile.type !== 'application/pdf') {
      document.getElementById('result').innerHTML = '<p style="color:red;">Error: Please upload a PDF file only.</p>';
      return; // Stop further execution if the file is not a PDF
    }
  
    // Warn if JD is too long (optional UX improvement)
    const jdMaxLength = 2000; // Maximum characters for JD
    if (jdText.length > jdMaxLength) {
      document.getElementById('result').innerHTML = `<p style="color:orange;">Warning: Job description is too long (more than ${jdMaxLength} characters).</p>`;
    }
  
    // Show the loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';
  
    const formData = new FormData();
  
    formData.append('resume', resumeFile);
    formData.append('jd', jdText);
  
    try {
      const response = await fetch('http://localhost:5000/parse-resume', {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
  
      // Hide the loading spinner
      document.getElementById('loadingSpinner').style.display = 'none';
  
      if (response.ok) {
        document.getElementById('result').innerHTML = `
          <h2>Result</h2>
          <p><strong>Match %:</strong> ${data.match_percentage}</p>
          <p><strong>Missing Keywords:</strong> ${data.missing_keywords.join(', ')}</p>
          <p><strong>Profile Summary:</strong><br>${data.summary}</p>
        `;
      } else {
        document.getElementById('result').innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
      }
    } catch (err) {
      // Hide the loading spinner
      document.getElementById('loadingSpinner').style.display = 'none';
      document.getElementById('result').innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
  });
  