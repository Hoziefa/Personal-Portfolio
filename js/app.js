const elements = {
    mainContent: document.querySelector(".main-content"),
    toggleDisplayBtn: document.querySelector(".toggle-display"),
    colorsContainer: document.querySelector(".colors-container"),
    themesContainer: document.querySelector(".theme-modes"),
    asideSection: document.querySelector(".aside"),
    navTogglerBtn: document.querySelector(".nav-toggler"),
    navLinks: document.querySelector(".links-container"),
    categoriesNavigator: document.querySelector(".portfolio ul"),
    slidesContainer: document.querySelector(".categories"),
    currentSlideTitle: document.querySelector(".modal-title"),
    slidesLength: document.querySelector(".modal-info"),
    modalContainer: document.querySelector(".modal-overlay"),
    loader: document.querySelector(".loader"),
};

let currentSlide = 0;
let timeout;

const removeClassAttr = (list, ...[cls = "active", ...rest]) =>
    Array.from(list, item => item.classList.remove(cls, ...rest));

const changeSlidesDetails = (target, slide, slideTitle) => {
    slide.src = target.src;

    slide.alt = target.alt;

    slideTitle.textContent = target.parentElement.querySelector("h5").textContent.trim();
};

const handleColorsChange = ({ target = elements.colorsContainer.firstElementChild }) => {
    if (!target.matches("li, li *")) return;

    removeClassAttr(target.parentElement.querySelectorAll("li"));

    target.classList.add("active");

    document.documentElement.style.setProperty("--primary-color", getComputedStyle(target).backgroundColor);
};

const handleSliding = (direction, slides) => {
    const modal = elements.modalContainer.querySelector(".modal-content");

    if (direction === "prev") currentSlide === 0 ? (currentSlide = slides.length - 1) : currentSlide--;

    if (direction === "next") currentSlide === slides.length - 1 ? (currentSlide = 0) : currentSlide++;

    modal.classList.add(direction);

    timeout && clearTimeout(timeout);

    timeout = setTimeout(() => modal.classList.remove(direction), 300);

    changeSlidesDetails(slides[currentSlide], elements.modalContainer.querySelector("img"), elements.currentSlideTitle);

    elements.slidesLength.textContent = `${currentSlide + 1} OF ${slides.length}`;
};

window.onload = () => setTimeout(() => elements.loader.classList.add("active"), 1000);

elements.toggleDisplayBtn.addEventListener("click", ({ currentTarget }) => {
    currentTarget.firstElementChild.classList.toggle("fa-spin");

    currentTarget.parentElement.classList.toggle("show");
});

handleColorsChange({});
elements.colorsContainer.addEventListener("click", handleColorsChange);

elements.themesContainer.addEventListener("click", ({ target }) => {
    if (target.classList.contains("dark-theme")) {
        removeClassAttr(target.parentElement.children);

        target.classList.add("active");

        document.documentElement.classList.add("dark");
    } else {
        removeClassAttr(target.parentElement.children);

        target.classList.add("active");

        document.documentElement.classList.remove("dark");
    }
});

elements.navLinks.addEventListener("click", ({ target }) => {
    if (!target.matches("li")) return;

    const allLinks = Array.from(target.parentElement.querySelectorAll("li"));

    const activeSection = document.querySelector(target.dataset.section);

    const allSections = elements.mainContent.querySelectorAll(".section");

    removeClassAttr(allSections, "active", "prev-section");

    allLinks.forEach((li, idx) => {
        li.classList.contains("active") && allSections[idx].classList.add("prev-section");

        li.classList.remove("active");
    });

    [target, activeSection].forEach(domElm => domElm.classList.add("active"));
});

elements.navTogglerBtn.addEventListener("click", () => elements.asideSection.classList.toggle("show"));

elements.categoriesNavigator.addEventListener("click", ({ target }) => {
    if (!target.matches("li, li *")) return;

    const categories = document.querySelectorAll(".category");

    const { category } = target.dataset;

    removeClassAttr(target.parentElement.children);
    target.classList.add("active");

    if (category === "all") {
        return categories.forEach(domElm => {
            domElm.classList.remove("hide");
            domElm.classList.add("show");
        });
    }

    categories.forEach(domElm => domElm.classList.add("hide"));
    categories.forEach(domElm => domElm.classList.remove("show"));

    document.querySelectorAll(`.${category}`).forEach(domElm => {
        domElm.classList.remove("hide");
        domElm.classList.add("show");
    });
});

elements.slidesContainer.addEventListener("click", ({ target }) => {
    const slides = Array.from(elements.slidesContainer.querySelectorAll(".category:not(.hide) img"));

    if (!target.matches("img")) return;

    changeSlidesDetails(target, elements.modalContainer.querySelector("img"), elements.currentSlideTitle);

    elements.modalContainer.classList.add("show");

    currentSlide = slides.indexOf(target);

    elements.slidesLength.textContent = `${currentSlide + 1} OF ${slides.length}`;
});

elements.modalContainer.addEventListener("click", ({ currentTarget, target }) => {
    const slides = elements.slidesContainer.querySelectorAll(".category:not(.hide) img");

    if (target.matches(`.${currentTarget.classList[0]}, .close-btn`)) return currentTarget.classList.remove("show");

    target.matches(".prev") && handleSliding("prev", slides);

    target.matches(".next") && handleSliding("next", slides);
});
