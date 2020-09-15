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
    modalImg: document.querySelector(".modal-overlay img"),
};

let currentSlide = 0,
    timeout,
    lastIndexOf = 0;

const removeClassAttr = (list, ...[cls = "active", ...rest]) =>
    Array.from(list, item => item.classList.remove(cls, ...rest));

const changeSlidesDetails = (
    target,
    slide,
    anchor = elements.modalContainer.querySelector("a"),
    slideTitle = elements.currentSlideTitle,
) => {
    slide.src = target.src;

    slide.alt = target.alt;

    anchor.href = target.dataset.link;

    slideTitle.textContent = target.parentElement.querySelector("h5").textContent.trim();
};

const handleToggleDisplaySettingsBox = ({ currentTarget }) => {
    currentTarget.firstElementChild.classList.toggle("fa-spin");

    currentTarget.parentElement.classList.toggle("show");
};

const handleColorsChange = ({ target = elements.colorsContainer.firstElementChild }) => {
    if (!target.matches("li, li *")) return;

    removeClassAttr(target.parentElement.querySelectorAll("li"));

    target.classList.add("active");

    document.documentElement.style.setProperty("--primary-color", getComputedStyle(target).backgroundColor);
};

const handleThemeChange = ({ target }) => {
    removeClassAttr(target.parentElement.children);

    target.classList.add("active");

    target.classList.contains("dark-theme")
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
};

const slideNavigation = (direction, slides) => {
    const modal = elements.modalContainer.querySelector(".modal-content");

    if (direction === "prev") currentSlide === 0 ? (currentSlide = slides.length - 1) : currentSlide--;

    if (direction === "next") currentSlide === slides.length - 1 ? (currentSlide = 0) : currentSlide++;

    modal.classList.add(direction);

    timeout && clearTimeout(timeout);

    timeout = setTimeout(() => modal.classList.remove(direction), 300);

    changeSlidesDetails(slides[currentSlide], elements.modalImg);

    elements.slidesLength.textContent = `${currentSlide + 1} OF ${slides.length}`;
};

const handleSectionsNavigation = ({ target }) => {
    const allLinks = Array.from(target.parentElement.querySelectorAll("li"));
    const allSections = elements.mainContent.querySelectorAll(".section");
    const activeSection = document.querySelector(target.dataset.section);

    if (!target.matches("li") || allLinks.indexOf(target) === lastIndexOf) return;

    removeClassAttr(allLinks);

    removeClassAttr(allSections, "active", "prev-section", "active-back", "pre-active");

    target.classList.add("active");

    if (allLinks.indexOf(target) > lastIndexOf) {
        activeSection.classList.add("active");

        allSections[lastIndexOf].classList.add("prev-section");
    } else {
        activeSection.classList.add("pre-active");

        allSections[lastIndexOf].classList.add("active-back");
    }

    lastIndexOf = allLinks.indexOf(target);

    if (elements.asideSection.classList.contains("show")) {
        elements.navTogglerBtn.classList.remove("active");
        elements.asideSection.classList.remove("show");
    }
};

const handleFilteringCategories = ({ target }) => {
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

    categories.forEach(domElm => {
        domElm.classList.add("hide");
        domElm.classList.remove("show");
    });

    document.querySelectorAll(`.${category}`).forEach(domElm => {
        domElm.classList.remove("hide");
        domElm.classList.add("show");
    });
};

const handleDisplaySliderDetails = ({ target }) => {
    const slides = Array.from(elements.slidesContainer.querySelectorAll(".category:not(.hide) img"));

    if (!target.matches("img")) return;

    changeSlidesDetails(target, elements.modalImg);

    elements.modalContainer.classList.add("show");

    currentSlide = slides.indexOf(target);

    elements.slidesLength.textContent = `${currentSlide + 1} OF ${slides.length}`;
};

const handleSlideNavigation = ({ currentTarget, target }) => {
    const slides = elements.slidesContainer.querySelectorAll(".category:not(.hide) img");

    if (target.matches(`.${currentTarget.classList[0]}, .close-btn`)) return currentTarget.classList.remove("show");

    target.matches(".prev") && slideNavigation("prev", slides);

    target.matches(".next") && slideNavigation("next", slides);
};

elements.toggleDisplayBtn.addEventListener("click", handleToggleDisplaySettingsBox);

handleColorsChange({});
elements.colorsContainer.addEventListener("click", handleColorsChange);

elements.themesContainer.addEventListener("click", handleThemeChange);

elements.navLinks.addEventListener("click", handleSectionsNavigation);

elements.navTogglerBtn.addEventListener("click", ({ currentTarget }) => {
    currentTarget.classList.toggle("active");

    elements.asideSection.classList.toggle("show");
});

elements.categoriesNavigator.addEventListener("click", handleFilteringCategories);

elements.slidesContainer.addEventListener("click", handleDisplaySliderDetails);

elements.modalContainer.addEventListener("click", handleSlideNavigation);

window.onload = () => elements.loader.classList.add("active");
