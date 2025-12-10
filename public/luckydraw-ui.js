
(function () {
  const tabs = document.querySelectorAll(".tab-btn[data-mode]");
  const modePanels = {
    number: document.getElementById("mode-number"),
    answer: document.getElementById("mode-answer"),
    list: document.getElementById("mode-list")
  };

  const footerHintEl = document.getElementById("footer-hint");

  // Number mode elements
  const numberResultEl = document.getElementById("number-result");
  const numberLastLabelEl = document.getElementById("number-last-label");
  const numberRangeLabelEl = document.getElementById("number-range-label");
  const minInputEl = document.getElementById("min-input");
  const maxInputEl = document.getElementById("max-input");
  const numberRollBtn = document.getElementById("number-roll-btn");
  const numberQuickBtn = document.getElementById("number-quick-btn");

  // Answer mode elements
  const answerResultEl = document.getElementById("answer-result");
  const answerLastLabelEl = document.getElementById("answer-last-label");
  const answerWeightLabelEl = document.getElementById("answer-weight-label");
  const answerSpinBtn = document.getElementById("answer-spin-btn");
  const answerBiasBtn = document.getElementById("answer-bias-btn");

  // List mode elements
  const listResultEl = document.getElementById("list-result");
  const listLastLabelEl = document.getElementById("list-last-label");
  const listCountLabelEl = document.getElementById("list-count-label");
  const listInputEl = document.getElementById("list-input");
  const listPickBtn = document.getElementById("list-pick-btn");
  const listShuffleBtn = document.getElementById("list-shuffle-btn");

  const answerBiasModes = ["neutral", "yes-heavy", "no-heavy"];
  let currentAnswerBiasIndex = 0;

  function switchMode(mode) {
    Object.keys(modePanels).forEach((key) => {
      if (!modePanels[key]) return;
      modePanels[key].classList.toggle("active", key === mode);
    });
    tabs.forEach((tab) => {
      const m = tab.getAttribute("data-mode");
      tab.classList.toggle("active", m === mode);
    });
  }

  function randomIntInclusive(min, max) {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    if (hi < lo) return lo;
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }

  function initNumberMode() {
    function updateRangeLabel() {
      const minVal = Number(minInputEl.value || "1");
      const maxVal = Number(maxInputEl.value || "100");
      if (numberRangeLabelEl) {
        numberRangeLabelEl.textContent = minVal + " – " + maxVal;
      }
    }

    function roll() {
      const minVal = Number(minInputEl.value || "1");
      const maxVal = Number(maxInputEl.value || "100");
      const min = isNaN(minVal) ? 1 : minVal;
      const max = isNaN(maxVal) ? 100 : maxVal;
      const safeMin = Math.min(min, max);
      const safeMax = Math.max(min, max);
      const value = randomIntInclusive(safeMin, safeMax);
      if (numberResultEl) numberResultEl.textContent = String(value);
      if (numberLastLabelEl) {
        numberLastLabelEl.textContent = "Last roll between " + safeMin + " and " + safeMax + ".";
      }
      if (numberRangeLabelEl) {
        numberRangeLabelEl.textContent = safeMin + " – " + safeMax;
      }
    }

    if (numberRollBtn) {
      numberRollBtn.addEventListener("click", roll);
    }
    if (numberQuickBtn) {
      numberQuickBtn.addEventListener("click", () => {
        if (minInputEl) minInputEl.value = "1";
        if (maxInputEl) maxInputEl.value = "10";
        updateRangeLabel();
        roll();
      });
    }
    if (minInputEl) minInputEl.addEventListener("change", updateRangeLabel);
    if (maxInputEl) maxInputEl.addEventListener("change", updateRangeLabel);

    updateRangeLabel();
  }

  function initAnswerMode() {
    function labelForBias(mode) {
      if (mode === "yes-heavy") return "Yes-leaning";
      if (mode === "no-heavy") return "No-leaning";
      return "Balanced";
    }

    function buttonLabelForBias(mode) {
      if (mode === "yes-heavy") return "Bias: Yes";
      if (mode === "no-heavy") return "Bias: No";
      return "Bias: Neutral";
    }

    function spin() {
      const bias = answerBiasModes[currentAnswerBiasIndex];
      let pool;
      if (bias === "yes-heavy") {
        pool = ["Yes", "Yes", "Yes", "Maybe", "No"];
      } else if (bias === "no-heavy") {
        pool = ["No", "No", "No", "Maybe", "Yes"];
      } else {
        pool = ["Yes", "No", "Maybe"];
      }
      const idx = Math.floor(Math.random() * pool.length);
      const result = pool[idx];
      if (answerResultEl) answerResultEl.textContent = result;
      if (answerLastLabelEl) {
        answerLastLabelEl.textContent = "Last spin: " + result + ".";
      }
    }

    function cycleBias() {
      currentAnswerBiasIndex = (currentAnswerBiasIndex + 1) % answerBiasModes.length;
      const mode = answerBiasModes[currentAnswerBiasIndex];
      if (answerWeightLabelEl) answerWeightLabelEl.textContent = labelForBias(mode);
      if (answerBiasBtn) answerBiasBtn.textContent = buttonLabelForBias(mode);
    }

    if (answerSpinBtn) {
      answerSpinBtn.addEventListener("click", spin);
    }
    if (answerBiasBtn) {
      answerBiasBtn.addEventListener("click", cycleBias);
    }

    // Initial label
    const mode = answerBiasModes[currentAnswerBiasIndex];
    if (answerWeightLabelEl) answerWeightLabelEl.textContent = labelForBias(mode);
    if (answerBiasBtn) answerBiasBtn.textContent = buttonLabelForBias(mode);
  }

  function parseListItems() {
    if (!listInputEl) return [];
    return listInputEl.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  function initListMode() {
    function updateCountLabel() {
      const items = parseListItems();
      if (listCountLabelEl) {
        listCountLabelEl.textContent = items.length + (items.length === 1 ? " item" : " items");
      }
    }

    function pick() {
      const items = parseListItems();
      if (!items.length) {
        if (listResultEl) listResultEl.textContent = "—";
        if (listLastLabelEl) listLastLabelEl.textContent = "Add at least one item first.";
        updateCountLabel();
        return;
      }
      const idx = Math.floor(Math.random() * items.length);
      const choice = items[idx];
      if (listResultEl) listResultEl.textContent = choice;
      if (listLastLabelEl) listLastLabelEl.textContent = "Picked from " + items.length + " items.";
      updateCountLabel();
    }

    function shuffleLines() {
      const items = parseListItems();
      if (!items.length) return;
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      if (listInputEl) {
        listInputEl.value = items.join("\n");
      }
      updateCountLabel();
      if (listLastLabelEl) listLastLabelEl.textContent = "List shuffled.";
    }

    if (listPickBtn) {
      listPickBtn.addEventListener("click", pick);
    }
    if (listShuffleBtn) {
      listShuffleBtn.addEventListener("click", shuffleLines);
    }
    if (listInputEl) {
      listInputEl.addEventListener("input", updateCountLabel);
    }

    updateCountLabel();
  }

  function initTabs() {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.getAttribute("data-mode");
        if (!mode) return;
        switchMode(mode);
      });
    });
  }

  function initFooterHint() {
    if (!footerHintEl) return;
    const hints = [
      "Tip: Use number mode for dice-style rolls.",
      "Tip: Answer mode is great for silly tiny decisions.",
      "Tip: List mode shines when choosing where to eat.",
      "Tip: Keep list items short and punchy.",
      "Tip: Use bias mode when you secretly want a yes or no."
    ];
    const idx = Math.floor(Math.random() * hints.length);
    footerHintEl.textContent = hints[idx];
  }

  function init() {
    initTabs();
    initNumberMode();
    initAnswerMode();
    initListMode();
    initFooterHint();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
