document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('uploadForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const resumeFile = document.getElementById('resume').files[0];
    const jdText = document.getElementById('jd').value;

    if (!resumeFile || !jdText.trim()) {
      resultDiv.innerHTML = `<p style="color:red;">Please upload a resume and enter the job description.</p>`;
      return;
    }

    formData.append('resume', resumeFile);
    formData.append('jd', jdText);

    try {
      const response = await fetch('/parse-resume', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        resultDiv.innerHTML = `
          <h2>Result</h2>
          <p><strong>Match %:</strong> ${data.match_percentage}</p>
          <p><strong>Missing Keywords:</strong> ${Array.isArray(data.missing_keywords) ? data.missing_keywords.join(', ') : 'N/A'}</p>
          <p><strong>Profile Summary:</strong><br>${data.summary}</p>
        `;
      } else {
        resultDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
      }
    } catch (err) {
      resultDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
  });
});
