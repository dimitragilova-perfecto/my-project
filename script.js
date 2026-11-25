// Accordion for the service list
const items = document.querySelectorAll(".accordion-item");

items.forEach((item) => {
  const trigger = item.querySelector(".accordion-trigger");
  if (!trigger) return;

  trigger.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    items.forEach((otherItem) => {
      otherItem.classList.remove("is-open");
      otherItem
        .querySelector(".accordion-trigger")
        ?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

// Light and night theme toggle
const themeButton = document.querySelector("#theme-toggle");

if (themeButton) {
  const storageKey = "nexora-theme";
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch (error) {
    console.warn("Темата няма да се запомни в този браузър.", error);
  }

  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;

  function applyTheme(isLight) {
    document.body.classList.toggle("dark-theme", !isLight);
    themeButton.setAttribute("aria-pressed", String(isLight));
    themeButton.textContent = isLight ? "☾ Нощна версия" : "☀ Светла версия";
  }

  applyTheme(savedTheme ? savedTheme === "light" : prefersLight);

  themeButton.addEventListener("click", () => {
    const isLight = !document.body.classList.contains("dark-theme");
    applyTheme(isLight);

    try {
      localStorage.setItem(storageKey, isLight ? "light" : "dark");
    } catch (error) {
      console.warn("Изборът на тема няма да се запомни в този браузър.", error);
    }
  });
}

// Project image preview gallery
const previewDialog = document.querySelector("#preview-dialog");

if (previewDialog) {
  const previewImage = previewDialog.querySelector("#preview-image");
  const previewTitle = previewDialog.querySelector("#preview-title");
  const previewCaption = previewDialog.querySelector("#preview-caption");
  const previewCount = previewDialog.querySelector("#preview-count");
  const previousButton = previewDialog.querySelector("#preview-previous");
  const nextButton = previewDialog.querySelector("#preview-next");
  const closeButton = previewDialog.querySelector("#preview-close");
  const demoLink = previewDialog.querySelector("#preview-demo");
  let gallery = [];
  let galleryIndex = 0;

  function showPreview(index) {
    if (!gallery.length || !previewImage) return;

    galleryIndex = (index + gallery.length) % gallery.length;
    previewImage.src = gallery[galleryIndex];
    previewImage.alt = `${previewTitle?.textContent || "Проект"}, снимка ${galleryIndex + 1}`;

    if (previewCount) {
      previewCount.textContent = `${galleryIndex + 1} / ${gallery.length}`;
    }

    if (previousButton) previousButton.disabled = gallery.length < 2;
    if (nextButton) nextButton.disabled = gallery.length < 2;
  }

  document.querySelectorAll(".preview-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const imageList = link.dataset.images || link.getAttribute("href");
      gallery = (imageList || "")
        .split(",")
        .map((path) => path.trim())
        .filter(Boolean)
        .map((path) => new URL(path, document.baseURI).href);

      if (!gallery.length) return;

      const caption = link.dataset.caption || link.textContent.trim();
      if (previewTitle) previewTitle.textContent = caption;
      if (previewCaption) previewCaption.textContent = "Примерен изглед на проекта";

      showPreview(0);

      const demoUrl = link.dataset.demo;
      if (demoLink) {
        demoLink.hidden = !demoUrl;
        if (demoUrl) {
          demoLink.href = demoUrl;
        } else {
          demoLink.removeAttribute("href");
        }
      }

      if (typeof previewDialog.showModal === "function") {
        previewDialog.showModal();
      }
    });
  });

  previousButton?.addEventListener("click", () => showPreview(galleryIndex - 1));
  nextButton?.addEventListener("click", () => showPreview(galleryIndex + 1));
  closeButton?.addEventListener("click", () => previewDialog.close());

  previewDialog.addEventListener("click", (event) => {
    if (event.target === previewDialog) previewDialog.close();
  });

  previewDialog.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    event.stopPropagation();
    showPreview(galleryIndex + (event.key === "ArrowRight" ? 1 : -1));
  });

  previewDialog.addEventListener("close", () => {
    previewImage?.removeAttribute("src");
    if (demoLink) {
      demoLink.hidden = true;
      demoLink.removeAttribute("href");
    }
  });
}
