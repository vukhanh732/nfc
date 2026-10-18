(function () {
  "use strict";

  const STORAGE_KEY = "nfc-review-card-redirects-v1";
  const manager = window.NfcManager;
  const cardSelect = document.getElementById("card-select");
  const destinationInput = document.getElementById("destination");
  const statusValue = document.getElementById("status-value");
  const feedback = document.getElementById("feedback");
  const importInput = document.getElementById("import-file");
  let redirects = manager.blankRedirects();

  function showFeedback(message, isError) {
    feedback.textContent = message;
    feedback.classList.toggle("error", Boolean(isError));
  }

  function updateStatus() {
    statusValue.textContent = destinationInput.value.trim() ? "Configured" : "Not configured";
  }

  function showSelectedCard() {
    destinationInput.value = redirects[cardSelect.value] || "";
    showFeedback("", false);
    updateStatus();
  }

  function generatedJson() {
    const ordered = manager.blankRedirects();
    manager.cardIds.forEach(function (id) {
      ordered[id] = redirects[id] || "";
    });
    return JSON.stringify(ordered, null, 2) + "\n";
  }

  function saveAllLocally() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(redirects));
  }

  async function loadRedirects() {
    let live = manager.blankRedirects();
    try {
      const response = await fetch("../redirects.json?v=" + Date.now(), { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load live JSON");
      const result = manager.validateRedirects(await response.json());
      if (!result.valid) throw new Error(result.message);
      live = result.data;
    } catch (_) {
      showFeedback("Could not load the live redirects.json. Local data is still available.", true);
    }

    let local = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const result = manager.validateRedirects(JSON.parse(stored));
        if (result.valid) local = result.data;
      }
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY);
    }

    redirects = local || live;
    showSelectedCard();
  }

  function saveCurrentCard() {
    const value = destinationInput.value.trim();
    if (value && !manager.isValidDestination(value)) {
      showFeedback("Enter a valid http:// or https:// URL.", true);
      return;
    }

    redirects[cardSelect.value] = value;
    destinationInput.value = value;
    saveAllLocally();
    updateStatus();
    showFeedback("Saved on this phone.", false);
  }

  function testCurrentUrl() {
    const value = destinationInput.value.trim();
    if (!manager.isValidDestination(value)) {
      showFeedback("Enter a valid http:// or https:// URL.", true);
      return;
    }
    showFeedback("Opening destination...", false);
    window.open(value, "_blank", "noopener,noreferrer");
  }

  async function copyJson() {
    const content = generatedJson();
    try {
      await navigator.clipboard.writeText(content);
    } catch (_) {
      const helper = document.createElement("textarea");
      helper.value = content;
      helper.setAttribute("readonly", "");
      helper.className = "visually-hidden";
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand("copy");
      helper.remove();
      if (!copied) {
        showFeedback("Could not copy JSON.", true);
        return;
      }
    }
    showFeedback("Copied", false);
  }

  async function importJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const result = manager.validateRedirects(parsed);
      if (!result.valid) throw new Error(result.message);
      redirects = result.data;
      saveAllLocally();
      showSelectedCard();
      showFeedback("Imported and saved on this phone.", false);
    } catch (error) {
      showFeedback(error instanceof SyntaxError ? "That file is not valid JSON." : error.message, true);
    } finally {
      importInput.value = "";
    }
  }

  manager.cardIds.forEach(function (id) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = id;
    cardSelect.appendChild(option);
  });

  cardSelect.addEventListener("change", showSelectedCard);
  destinationInput.addEventListener("input", function () {
    showFeedback("", false);
    updateStatus();
  });
  document.getElementById("save-button").addEventListener("click", saveCurrentCard);
  document.getElementById("test-button").addEventListener("click", testCurrentUrl);
  document.getElementById("copy-button").addEventListener("click", copyJson);
  document.getElementById("import-button").addEventListener("click", function () { importInput.click(); });
  importInput.addEventListener("change", importJson);

  loadRedirects();
})();
