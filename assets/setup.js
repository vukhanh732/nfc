(function () {
  "use strict";

  const list = document.getElementById("url-list");
  const feedback = document.getElementById("setup-feedback");

  async function copyText(value, button) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.className = "visually-hidden";
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand("copy");
      helper.remove();
      if (!copied) {
        feedback.textContent = "Could not copy the URL.";
        feedback.classList.add("error");
        return;
      }
    }

    feedback.textContent = "Copied " + value;
    feedback.classList.remove("error");
    const original = button.textContent;
    button.textContent = "Copied";
    setTimeout(function () { button.textContent = original; }, 1200);
  }

  window.NfcManager.cardIds.forEach(function (id) {
    const url = "https://vukhanh732.github.io/nfc/" + id + "/";
    const row = document.createElement("div");
    const text = document.createElement("div");
    const number = document.createElement("p");
    const address = document.createElement("p");
    const button = document.createElement("button");

    row.className = "url-row";
    number.className = "card-number";
    address.className = "card-url";
    button.className = "secondary";
    number.textContent = id;
    address.textContent = url;
    button.type = "button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy URL for card " + id);
    button.addEventListener("click", function () { copyText(url, button); });

    text.appendChild(number);
    text.appendChild(address);
    row.appendChild(text);
    row.appendChild(button);
    list.appendChild(row);
  });
})();
