// Interactive website analysis tool
document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const websiteUrl = document.getElementById('website-url');
    const analysisResults = document.getElementById('analysis-results');
    const speedScore = document.getElementById('speed-score');
    const speedScoreText = document.getElementById('speed-score-text');
    const mobileScore = document.getElementById('mobile-score');
    const mobileScoreText = document.getElementById('mobile-score-text');
    const seoScore = document.getElementById('seo-score');
    const seoScoreText = document.getElementById('seo-score-text');
    const resultSummary = document.getElementById('result-summary');

    // Simulate website analysis
    analyzeBtn.addEventListener('click', function() {
        const url = websiteUrl.value.trim();
        
        if (!url) {
            alert('Veuillez entrer une URL valide');
            return;
        }
        
        // Show loading state
        analyzeBtn.textContent = 'Analyse en cours...';
        analyzeBtn.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Generate random scores between 30-95
            const generateScore = () => Math.floor(Math.random() * (95 - 30 + 1)) + 30;
            
            const speedValue = generateScore();
            const mobileValue = generateScore();
            const seoValue = generateScore();
            
            // Calculate average score
            const avgScore = Math.floor((speedValue + mobileValue + seoValue) / 3);
            
            // Update UI with scores
            speedScore.style.width = `${speedValue}%`;
            speedScore.style.backgroundColor = getScoreColor(speedValue);
            speedScoreText.textContent = `${speedValue}%`;
            
            mobileScore.style.width = `${mobileValue}%`;
            mobileScore.style.backgroundColor = getScoreColor(mobileValue);
            mobileScoreText.textContent = `${mobileValue}%`;
            
            seoScore.style.width = `${seoValue}%`;
            seoScore.style.backgroundColor = getScoreColor(seoValue);
            seoScoreText.textContent = `${seoValue}%`;
            
            // Generate summary based on average score
            let summaryText = '';
            if (avgScore < 50) {
                summaryText = `Votre site présente des problèmes importants qui limitent probablement votre capacité à attirer et convertir des clients. Un audit complet vous permettrait d'identifier précisément les points à améliorer.`;
            } else if (avgScore < 70) {
                summaryText = `Votre site présente des performances moyennes. Des améliorations ciblées pourraient significativement augmenter votre taux de conversion et votre visibilité.`;
            } else if (avgScore < 85) {
                summaryText = `Votre site présente de bonnes performances, mais quelques optimisations pourraient encore améliorer vos résultats et vous démarquer de la concurrence.`;
            } else {
                summaryText = `Votre site présente d'excellentes performances techniques. Un audit complet pourrait néanmoins révéler des opportunités d'optimisation de conversion.`;
            }
            
            resultSummary.textContent = summaryText;
            
            // Show results
            analysisResults.classList.remove('hidden');
            
            // Reset button
            analyzeBtn.textContent = 'Analyser';
            analyzeBtn.disabled = false;
            
            // Scroll to results
            analysisResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Auto-fill website URL in the lead form
            const websiteInput = document.getElementById('website');
            if (websiteInput) {
                websiteInput.value = url;
            }
        }, 2000);
    });
    
    // Helper function to get color based on score
    function getScoreColor(score) {
        if (score < 50) return '#ef4444'; // Red
        if (score < 70) return '#f59e0b'; // Orange
        if (score < 85) return '#3b82f6'; // Blue
        return '#10b981'; // Green
    }
});

// KOMPOS V7 - Lead capture functionality
(function () {
  var root = document.documentElement;
  var apiBase = (root.getAttribute("data-leads-api-origin") || "").replace(/\/$/, "");
  var productSlug = root.getAttribute("data-product-slug") || "";
  var form = document.getElementById("lead-form");
  var statusEl = document.getElementById("lead-form-status");
  if (!form || !statusEl || !productSlug) return;
  function setStatus(msg, isError) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? "#f87171" : "#86efac";
    statusEl.style.marginTop = "0.75rem";
    statusEl.style.fontSize = "0.9rem";
    statusEl.setAttribute("role", "status");
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]');
    if (!input || !input.value) {
      setStatus("Merci d'indiquer une adresse email.", true);
      return;
    }
    var email = input.value.trim();
    setStatus("Envoi en cours…", false);
    var url = (apiBase || "") + "/api/leads";
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, product_slug: productSlug, source: "landing" })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, json: j }; }); })
      .then(function (res) {
        if (btn) btn.disabled = false;
        if (res.ok && res.json && res.json.ok !== false) {
          setStatus(res.json.message || "Merci — inscription enregistrée.", false);
          form.reset();
        } else {
          var err = (res.json && res.json.error) ? res.json.error : "Une erreur est survenue.";
          setStatus(err, true);
        }
      })
      .catch(function () {
        if (btn) btn.disabled = false;
        setStatus("Réseau indisponible. Réessaie dans un instant.", true);
      });
  });
})();