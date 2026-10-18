(function () {
  "use strict";

  const requestTemplate = document.getElementById("request-template");
  const mapsUrlInput = document.getElementById("maps-url");
  const reviewLinkOutput = document.getElementById("review-link");
  const feedback = document.getElementById("guide-feedback");

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_) {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.className = "visually-hidden";
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand("copy");
      helper.remove();
      return copied;
    }
  }

  function buildReviewLink() {
    const value = mapsUrlInput.value.trim();
    let expandedUrl = value;
    try {
      expandedUrl = decodeURIComponent(value);
    } catch (_) {
      expandedUrl = value;
    }
    const match = expandedUrl.match(/0x[0-9a-f]+:0x[0-9a-f]+/i);
    reviewLinkOutput.value = match
      ? "https://www.google.com/maps/place//data=!4m3!3m2!1s" + match[0] + "!12e1"
      : "";
    feedback.textContent = value && !match
      ? "Open the short Maps link in Chrome, then copy the expanded google.com/maps URL."
      : "";
    feedback.classList.toggle("error", Boolean(value && !match));
    return Boolean(match);
  }

  document.getElementById("copy-request").addEventListener("click", async function () {
    const copied = await copyText(requestTemplate.value);
    feedback.textContent = copied ? "Request copied." : "Could not copy the request.";
    feedback.classList.toggle("error", !copied);
  });

  mapsUrlInput.addEventListener("input", buildReviewLink);

  document.getElementById("copy-review-link").addEventListener("click", async function () {
    if (!buildReviewLink()) {
      feedback.textContent = "Paste an expanded Google Maps URL first.";
      feedback.classList.add("error");
      mapsUrlInput.focus();
      return;
    }

    const copied = await copyText(reviewLinkOutput.value);
    feedback.textContent = copied ? "Review link copied." : "Could not copy the review link.";
    feedback.classList.toggle("error", !copied);
  });
})();
