(function () {
  "use strict";

  const CARD_IDS = Array.from({ length: 20 }, function (_, index) {
    return String(index + 1).padStart(2, "0");
  });

  function isValidDestination(value) {
    if (typeof value !== "string" || value.trim() === "") {
      return false;
    }

    try {
      const parsed = new URL(value.trim());
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch (_) {
      return false;
    }
  }

  function blankRedirects() {
    return CARD_IDS.reduce(function (result, id) {
      result[id] = "";
      return result;
    }, {});
  }

  function validateRedirects(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { valid: false, message: "JSON must contain one object." };
    }

    const keys = Object.keys(data);
    if (keys.length !== CARD_IDS.length || keys.some(function (key) { return !CARD_IDS.includes(key); })) {
      return { valid: false, message: "JSON must contain exactly cards 01 through 20." };
    }

    for (const id of CARD_IDS) {
      if (typeof data[id] !== "string") {
        return { valid: false, message: "Every card value must be text." };
      }
      if (data[id].trim() !== "" && !isValidDestination(data[id])) {
        return { valid: false, message: "Card " + id + " has an invalid URL." };
      }
    }

    const normalized = blankRedirects();
    CARD_IDS.forEach(function (id) {
      normalized[id] = data[id].trim();
    });
    return { valid: true, data: normalized };
  }

  function showRedirectMessage(title, message) {
    const titleElement = document.getElementById("card-title");
    const messageElement = document.getElementById("card-message");
    if (titleElement) titleElement.textContent = title;
    if (messageElement) messageElement.textContent = message;
    document.title = title + " | NFC Review Cards";
  }

  async function runRedirectPage() {
    const match = window.location.pathname.match(/\/(0[1-9]|1[0-9]|20)\/?$/);
    if (!match) {
      showRedirectMessage("Invalid card.", "");
      return;
    }

    const cardId = match[1];
    showRedirectMessage("Card " + cardId, "Loading...");

    try {
      const response = await fetch("../redirects.json?v=" + Date.now(), { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load redirects");
      const redirects = await response.json();
      const destination = redirects && redirects[cardId];

      if (typeof destination === "string" && destination.trim() === "") {
        showRedirectMessage("Card " + cardId, "Not configured yet.");
        return;
      }

      if (!isValidDestination(destination)) {
        showRedirectMessage("Card " + cardId, "Invalid destination URL.");
        return;
      }

      window.location.replace(destination.trim());
    } catch (_) {
      showRedirectMessage("Card " + cardId, "Unable to load redirect.");
    }
  }

  window.NfcManager = {
    cardIds: CARD_IDS,
    blankRedirects: blankRedirects,
    isValidDestination: isValidDestination,
    validateRedirects: validateRedirects
  };

  if (document.body && document.body.dataset.page === "redirect") {
    runRedirectPage();
  }
})();
