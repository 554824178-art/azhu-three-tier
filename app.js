(function () {
  "use strict";

  const toast = document.querySelector(".toast");
  const permanentUrl = "https://554824178-art.github.io/azhu-three-tier/";
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  async function copyText(text, message) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message || "已复制");
      return;
    } catch (error) {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
      showToast(message || "已复制");
    }
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      const card = button.closest(".copy-card");
      if (!card) return;
      const clone = card.cloneNode(true);
      clone.querySelectorAll("button").forEach(function (item) {
        item.remove();
      });
      copyText(clone.innerText.trim(), "文案已复制");
    });
  });

  document.querySelectorAll("[data-copy-link]").forEach(function (button) {
    button.addEventListener("click", function () {
      copyText(permanentUrl, "固定网址已复制，可直接发微信");
    });
  });

  const printState = new Map();

  function preparePrint() {
    document.querySelectorAll("details").forEach(function (detail) {
      printState.set(detail, detail.open);
      detail.open = true;
    });
  }

  function restoreAfterPrint() {
    printState.forEach(function (wasOpen, detail) {
      detail.open = wasOpen;
    });
    printState.clear();
  }

  window.addEventListener("beforeprint", preparePrint);
  window.addEventListener("afterprint", restoreAfterPrint);

  document.querySelectorAll("[data-print]").forEach(function (button) {
    button.addEventListener("click", function () {
      window.print();
    });
  });

  const classButtons = document.querySelectorAll("[data-class-filter]");
  const videoRows = document.querySelectorAll(
    "#video-list .video-row[data-class]"
  );

  classButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedClass = button.getAttribute("data-class-filter");
      classButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      videoRows.forEach(function (row) {
        row.hidden =
          selectedClass !== "all" &&
          row.getAttribute("data-class") !== selectedClass;
      });
    });
  });

  document.querySelectorAll("[data-check]").forEach(function (checkbox) {
    const key = "azhu-three-tier-v2-" + checkbox.getAttribute("data-check");
    try {
      checkbox.checked = window.localStorage.getItem(key) === "1";
    } catch (error) {
      // Local-file privacy settings may disable storage; checklist still works.
    }
    checkbox.addEventListener("change", function () {
      try {
        window.localStorage.setItem(key, checkbox.checked ? "1" : "0");
      } catch (error) {
        // Ignore storage restrictions.
      }
    });
  });

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".topnav a"));
  let activeFrame = null;

  function updateActiveNavigation() {
    activeFrame = null;
    const marker = window.scrollY + 120;
    let current = sections[0];

    sections.forEach(function (section) {
      if (section.offsetTop <= marker) current = section;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle(
        "active",
        current && link.getAttribute("href") === "#" + current.id
      );
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!activeFrame) {
        activeFrame = window.requestAnimationFrame(updateActiveNavigation);
      }
    },
    { passive: true }
  );
  updateActiveNavigation();

  const toTop = document.querySelector(".to-top");
  if (toTop) {
    function updateToTop() {
      toTop.classList.toggle("show", window.scrollY > 680);
    }
    window.addEventListener("scroll", updateToTop, { passive: true });
    updateToTop();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
