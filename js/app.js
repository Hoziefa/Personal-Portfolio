const elements = {
    mainContent: document.querySelector(".main-content"),
    toggleDisplaySettingsBoxBtn: document.querySelector(".toggle-display"),
    colorsContainer: document.querySelector(".colors-container"),
    themesContainer: document.querySelector(".theme-modes"),
    personalColorInput: document.getElementById("personal-color"),
    asideSection: document.querySelector(".aside"),
    navTogglerBtn: document.querySelector(".nav-toggler"),
    navLinks: document.querySelector(".links-container"),
    categoriesNavigator: document.querySelector(".portfolio ul"),
    slidesContainer: document.querySelector(".categories"),
    slidesLength: document.querySelector(".modal-info"),
    modalContainer: document.querySelector(".modal-overlay"),
    modalTitleHeader: document.getElementById("modal-details-header-title"),
    modalTitleBody: document.getElementById("modal-details-body-title"),
    modalDescription: document.getElementById("modal-details-body-desc"),
    modalTools: document.getElementById("modal-details-body-tools"),
    modalTags: document.getElementById("modal-details-body-tags"),
    modalImg: document.querySelector(".modal-overlay img"),
    modalLink: document.querySelector(".modal-overlay .modal-details #website-link"),
    loader: document.querySelector(".loader"),
};

let currentSlide = 0,
    timeout,
    lastLinkIndex = 0,
    defaultColor = getComputedStyle(elements.colorsContainer.firstElementChild).backgroundColor || "";

const removeClassAttr = (list, ...[cls = "active", ...rest]) =>
    Array.from(list, item => item.classList.remove(cls, ...rest));

const changeSlidesDetails = (
    target,
    slide = elements.modalImg,
    link = elements.modalLink,
    slideTitleHeader = elements.modalTitleHeader,
    slideTitleBody = elements.modalTitleBody,
    slideDesc = elements.modalDescription,
    slideTools = elements.modalTools,
    slideTags = elements.modalTags,
) => {
    const { src, alt, dataset: { linkto, description, tools, tags } = {} } = target;

    slide.src = "";

    [slide.src, slide.alt, link.href] = [src, alt, linkto];

    let targeTitle = target.parentElement.querySelector("h5").textContent.trim();

    [slideTitleHeader, slideTitleBody].forEach(slideTitle => (slideTitle.textContent = targeTitle));

    slideDesc.textContent = description && description;

    slideTools.textContent = "";
    tools && slideTools.insertAdjacentHTML("afterbegin", `<strong>Tools:</strong> ${tools}`);

    slideTags.textContent = "";
    tags && slideTags.insertAdjacentHTML("afterbegin", `<i class="fas fa-tag"></i> ${tags}`);
};

const slideNavigation = (direction, slides) => {
    const modal = elements.modalContainer.querySelector(".modal-content");

    if (direction === "prev") currentSlide === 0 ? (currentSlide = slides.length - 1) : currentSlide--;

    if (direction === "next") currentSlide === slides.length - 1 ? (currentSlide = 0) : currentSlide++;

    modal.classList.add(direction);

    timeout && clearTimeout(timeout);

    timeout = setTimeout(() => modal.classList.remove(direction), 300);

    changeSlidesDetails(slides[currentSlide]);

    elements.slidesLength.textContent = `${currentSlide + 1} OF ${slides.length}`;
};

const rgbToHex = rgb => {
    rgb = rgb.replace(/[( rgb )]/g, "");

    let [r, g, b] = rgb
        .split(",")
        .map(Number)
        .map(c => {
            c = c.toString(16);

            return c.length === 1 ? `0${c}` : c;
        });

    return `#${r}${g}${b}`;
};

const handleColorsChange = ({ target = elements.colorsContainer.firstElementChild }) => {
    if (!target.matches("li, li *")) return;

    removeClassAttr(target.parentElement.querySelectorAll("li"));

    target.classList.add("active");

    let pickedColor = getComputedStyle(target).backgroundColor;

    document.documentElement.style.setProperty("--primary-color", pickedColor);

    elements.personalColorInput.value = rgbToHex(pickedColor);
};

const handleThemeChange = ({ target }) => {
    removeClassAttr(target.parentElement.children);

    target.classList.add("active");

    target.classList.contains("dark-theme")
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
};

const handleSectionsNavigation = ({ target }) => {
    const allLinks = Array.from(target.parentElement.querySelectorAll("li"));
    const allSections = elements.mainContent.querySelectorAll(".section");
    const activeSection = document.querySelector(target.dataset.section);

    let currentLinkIndex = allLinks.indexOf(target);

    if (!target.matches("li") || currentLinkIndex === lastLinkIndex) return;

    removeClassAttr(allLinks);

    removeClassAttr(allSections, "active", "prev-section", "active-back", "pre-active");

    target.classList.add("active");

    if (currentLinkIndex > lastLinkIndex) {
        activeSection.classList.add("active");

        allSections[lastLinkIndex].classList.add("prev-section");
    } else {
        activeSection.classList.add("pre-active");

        allSections[lastLinkIndex].classList.add("active-back");
    }

    lastLinkIndex = currentLinkIndex;

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

    changeSlidesDetails(target);

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

elements.toggleDisplaySettingsBoxBtn.addEventListener("click", ({ currentTarget }) => {
    currentTarget.firstElementChild.classList.toggle("fa-spin");

    currentTarget.parentElement.classList.toggle("show");
});

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

elements.personalColorInput.value = rgbToHex(defaultColor);

elements.personalColorInput.addEventListener("input", ({ target: { value = defaultColor } }) => {
    document.documentElement.style.setProperty("--primary-color", value);
});

window.onload = () => elements.loader.classList.add("active");
