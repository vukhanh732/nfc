(function () {
  "use strict";

  const requestTemplate = document.getElementById("request-template");
  const placeIdInput = document.getElementById("place-id");
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
    const placeId = placeIdInput.value.trim();
    const isValid = /^[A-Za-z0-9_-]{10,200}$/.test(placeId);
    reviewLinkOutput.value = isValid
      ? "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(placeId)
      : "";
    feedback.textContent = placeId && !isValid ? "Enter a valid Google Place ID." : "";
    feedback.classList.toggle("error", Boolean(placeId && !isValid));
    return isValid;
  }

  document.getElementById("copy-request").addEventListener("click", async function () {
    const copied = await copyText(requestTemplate.value);
    feedback.textContent = copied ? "Request copied." : "Could not copy the request.";
    feedback.classList.toggle("error", !copied);
  });

  placeIdInput.addEventListener("input", buildReviewLink);

  document.getElementById("copy-review-link").addEventListener("click", async function () {
    if (!buildReviewLink()) {
      feedback.textContent = "Enter a valid Google Place ID first.";
      feedback.classList.add("error");
      placeIdInput.focus();
      return;
    }

    const copied = await copyText(reviewLinkOutput.value);
    feedback.textContent = copied ? "Review link copied." : "Could not copy the review link.";
    feedback.classList.toggle("error", !copied);
  });
})();
