const items = document.querySelectorAll(".accordion-item");

items.forEach((item) => {
  const trigger = item.querySelector(".accordion-trigger");

  trigger.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    items.forEach((otherItem) => {
      otherItem.classList.remove("is-open");
      otherItem
        .querySelector(".accordion-trigger")
        .setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});
