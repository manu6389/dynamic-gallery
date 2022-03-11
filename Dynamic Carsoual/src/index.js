import Swiper, { Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Logger from "./logger";
import { createSwiperCarouselDOM, injectLinksInHead } from "./dom";
import EventEmitter from "./event-emitter";

Swiper.use([Navigation, Autoplay]);

const getLogger = (function () {
    let logger = null;

    return isDebug => {
        if (logger) return logger;

        logger = new Logger(isDebug ? Logger.levels.INFO : Logger.levels.ERROR);
        return logger;
    };
})();

function injectDNSPrefetchLinks(bz, config, domains) {
    injectLinksInHead(bz, config.usePublisherWindow, "dns-prefetch", domains);
}

const setupNavigationButtons = (bz, config) => {
    const logger = getLogger(config.debug);
    const leftButton = bz.Creative.getElementByName(config.leftButtonElement);
    const rightButton = bz.Creative.getElementByName(config.rightButtonElement);

    if (!leftButton) {
        logger.error(
            "setupNavigationButtons: Could not find element of name " +
            config.leftButtonElement
        );
    }

    leftButton.el.classList.add("leftButton");
    leftButton.el.classList.add("bz-button-prev");

    if (!rightButton) {
        logger.error(
            "setupNavigationButtons: Could not find element of name " +
            config.rightButtonElement
        );
    }

    rightButton.el.classList.add("rightButton");
    rightButton.el.classList.add("bz-button-next");

    leftButton.el.firstElementChild.style.cursor = "pointer";
    rightButton.el.firstElementChild.style.cursor = "pointer";
};

const decodeHtml = html => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    console.log(txt.innerHTML);
    return txt.value;
};

const initializeCarousel = (bz, config, cb, onClickThrough) => {
    const logger = getLogger(config.debug);
    const page = bz.Creative.getPageByName(config.pageName).el;
    page.style.userSelect = "none";

    // console.log(`config data: ${config}, bz data: ${bz}, cb data is: ${cb},clickthrough data: ${onClickThrough}`);

    // console.log(` config data ${config.feedDataElement}`);

    console.log(` find data or raw json: ${JSON.parse(bz.Creative.getElementByName(config.feedDataElement).el
    )}`);

    try {
        var products = JSON.parse(
            decodeHtml(
                bz.Creative.getElementByName(config.feedDataElement).el.innerHTML.replace(
                    /\\"/g,
                    "\""
                )
            )
        );
        console.log('products data:' + products);
    } catch (e) {
        logger.error(
            "initializeCarousel: Failed to get feed JSON from element of name, " +
            config.feedDataElement
        );
        console.error(e);
    }

    function initialize() {
        var carouselContainer = bz.Creative.getElementByName(config.containerElement);

        // Use Carousel_Container element as the container for the carousel or use page.
        (carouselContainer ? carouselContainer.el : page).appendChild(
            createSwiperCarouselDOM(config, products, onClickThrough)
        );

        setupNavigationButtons(bz, config);

        var swiper = new Swiper(".swiper", {
            loop: true,
            autoplay: true,
            slidesPerView: config.itemsPerView,
            spaceBetween: 10,
            preloadImages: false,
            navigation: {
                nextEl: ".bz-button-next",
                prevEl: ".bz-button-prev"
            },
            breakpointsBase: "container",
            breakpoints: config.breakpoints,
            on: {
                init: function () {
                    cb(this);
                }
            },
            ...(config.swiperOptions || {})
        });

        //? Do we need this?
        // document.querySelectorAll(".item").addEventListener("hover", function () {
        //     swiper.autoplay.stop();
        // });
    }

    if (config.imageUrlPropertyName) {
        bz.Common.preloadImages(
            products.slice(0, 3).map(function (product) {
                return product[config.imageUrlPropertyName];
            }),
            initialize
        );
    } else {
        initialize();
    }
};

/**
 *
 * @param {*} bz
 * @param {Object} config
 * @param {string} config.pageName The name of the page on which this carousel is present.
 * @param {string} config.feedDataElement The name of the text element that has the feed data in it.
 * @param {string} [config.containerElement] The name of the container element into which the carousel will be inserted.
 * If you don't pass this, the page is used as the container.
 * @param {string} config.leftButtonElement The name of the left navigation button.
 * @param {string} config.rightButtonElement The name of the right navigation button.
 * @param {Object} config.data The JSON data required to render the carousel.
 * @param {number} config.itemsPerView The number of items to show in the carousel.
 * @param {Function} config.createItemDOM The function to create the item DOM. It receives the feed item object.
 * @param {string} config.idPropertyName The name of the id property of the feed item.
 * @param {string} [config.imageUrlPropertyName] The name of the property in the feed which contains the image
 * url. This is used to preload the first group of image. If you don't pass this images will not be preloaded.
 * @param {boolean} [config.debug=false] Show extra debug output when this option is enabled.
 * @param {boolean} [config.usePublisherWindow=false] Should we use publisher window for inserting stuff. This is
 * helpful for some formats, such as Portal, which move the DOM out of the publisher container.
 * @param {Object} [config.breakpoints] Allows to set different parameter for different responsive breakpoints (container sizes).
 * Not all parameters can be changed in breakpoints, only those which are not required different layout and logic, like slidesPerView & spaceBetween.
 * @param {Object} config.swiperOptions Some extra options that you want to pass directly to Swiper.
 */
class DynamicCarousel {
    constructor(bz, config) {
        this.emitter = new EventEmitter();
        this.swiper = null;
        this.bz = bz;

        injectDNSPrefetchLinks(bz, config, ["https://cdn.jsdelivr.net/"]);

        initializeCarousel(
            bz,
            config,
            swiper => {
                this.swiper = swiper;
                setTimeout(() => {
                    this.emitter.emit("ready");
                }, 0);
                swiper.on("slideChangeTransitionEnd", () => {
                    this.emitter.emit("slideChange");
                });
            },
            (id, url) => {
                this.doClickThrough(id, url);
            }
        );
    }

    /**
     * Add event handler
     * @param {"ready"|"slideChange"} event
     * @param {Function} fn
     */
    on(event, fn) {
        switch (event) {
            case "ready": {
                this.emitter.on("ready", () => fn.call(this));
                break;
            }
            case "slideChange": {
                this.emitter.on("slideChange", () =>
                    fn.call(this, this.swiper.realIndex)
                );
                break;
            }
            default: {
                console.warn(`${event} not recognized`);
            }
        }
    }

    doClickThrough(id, url) {
        var bz = this.bz;

        bz.Creative.triggerAnalyticsEvent(
            "click",
            "Click/Tap",
            bz.Constants.EventType.CLICKTHROUGH,
            {
                acts: [
                    {
                        aid: "bc" + id,
                        at: "Click Through",
                        a: "openurl",
                        ap: url,
                        an: "Open URL"
                    }
                ],
                eleid: "c" + id,
                elen: "CTA " + id,
                elet: "BUTTON"
            }
        );
        bz.Actions.openUrl(url);
    }

    addClickThroughEvent(id, url, el) {
        el.addEventListener("click", () => {
            this.doClickThrough(id, url);
        });
    }
}

export default DynamicCarousel;
