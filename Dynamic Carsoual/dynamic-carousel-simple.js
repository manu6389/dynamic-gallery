/* globals bz */
function Logger(level) {
    this.level = level || Logger.levels.ERROR;
}

Logger.levels = {
    ERROR: 0,
    WARN: 1,
    TEST: 2,
    INFO: 3
};

Logger.prototype = {
    info: function () {
        if (this.level >= Logger.levels.INFO) {
            console.log.apply(console, arguments);
        }
    },
    warn: function () {
        if (this.level >= Logger.levels.WARN) {
            console.log.apply(console, arguments);
        }
    },
    test: function () {
        if (this.level >= Logger.levels.TEST) {
            console.log.apply(console, arguments);
        }
    },
    error: function () {
        if (this.level >= Logger.levels.ERROR) {
            console.log.apply(console, arguments);
        }
    }
};

var ITEMS_PER_VIEW = 3;
var FEED_JSON_ELEMENT = "RawJSON";
var LEFT_BUTTON_ELEMENT = "leftButton";
var RIGHT_BUTTON_ELEMENT = "rightButton";
var logger = new Logger(Logger.levels.ERRORS); // TODO Revert to ERROR for production & INFO for checking the output

initialize();

function initialize() {
    injectDNSPrefetchLinks(["https://cdn.jsdelivr.net/"]);

    injectCSS(["https://cdn.jsdelivr.net/npm/swiper@6.6.2/swiper-bundle.min.css"]);

    bz.Common.loadScripts([
        "https://cdn.jsdelivr.net/npm/swiper@6.6.2/swiper-bundle.min.js"
    ]).then(function () {
        initializeCarousel(bz.Common.include("Swiper"));
    });

    (window.fetch
        ? Promise.resolve(window.fetch)
        : bz.Common.loadScripts([
            "https://cdn.jsdelivr.net/npm/unfetch@4.2.0/dist/unfetch.min.js"
        ]).then(function () {
            return bz.Common.include("unfetch");
        })
    ).then(function (fetch) {
        function checkStatus(response) {
            if (response.ok) {
                console.log(response, "response");
                return response;
            }

            var error = new Error(response.statusText);
            error.response = response;
            return Promise.reject(error);
        }

        var fetchWithErrorHandler = function (endpoint, config) {
            return fetch(endpoint, config).then(checkStatus);
        };
    });
}

function initializeCarousel(Swiper) {
    var page = bz.Creative.getPageByName("Bannermain").el;
    page.style.userSelect = "none";

    try {
        var products = JSON.parse(
            bz.Creative.getElementByName(FEED_JSON_ELEMENT).el.innerHTML.replace(
                /\\"/g,
                "\""
            )
        );
    } catch (e) {
        logger.error(
            "initializeCarousel: Failed to get feed JSON from element of name, " +
                FEED_JSON_ELEMENT
        );
        console.error(e);
    }

    bz.Common.preloadImages(
        products.slice(0, 3).map(function (product) {
            return product.image_link;
        }),
        function () {
            var carouselContainer = bz.Creative.getElementByName("Carousel_Container");

            // Use Carousel_Container element as the container for the carousel or use page.
            (carouselContainer ? carouselContainer.el : page).appendChild(
                createSwiperCarouselDOM(products)
            );

            setupNavigationButtons();

            var swiper = new Swiper(".swiper-container", {
                loop: true,
                autoplay: true,
                slidesPerView: ITEMS_PER_VIEW,
                spaceBetween: 10,
                preloadImages: false,
                navigation: {
                    nextEl: ".bz-button-next",
                    prevEl: ".bz-button-prev"
                }
            });

            document.addEventListener(".item", function () {
                swiper.autoplay.stop();
            });
        }
    );
}

function setupNavigationButtons() {
    var leftButton = bz.Creative.getElementByName(LEFT_BUTTON_ELEMENT);

    if (!leftButton) {
        logger.error(
            "setupNavigationButtons: Could not find element of name " +
                LEFT_BUTTON_ELEMENT
        );
    }

    leftButton.el.classList.add("leftButton");
    leftButton.el.classList.add("bz-button-prev");

    var rightButton = bz.Creative.getElementByName(RIGHT_BUTTON_ELEMENT);

    if (!rightButton) {
        logger.error(
            "setupNavigationButtons: Could not find element of name " +
                RIGHT_BUTTON_ELEMENT
        );
    }

    rightButton.el.classList.add("rightButton");
    rightButton.el.classList.add("bz-button-next");

    leftButton.el.firstElementChild.style.cursor = "pointer";
    rightButton.el.firstElementChild.style.cursor = "pointer";
}

function createSwiperCarouselDOM(properties) {
    var swiperContainer = document.createElement("div");
    swiperContainer.className = "swiper-container";
    swiperContainer.style.position = "relative";
    swiperContainer.style.top = "35px";
    swiperContainer.style.left = "0";
    swiperContainer.style.height = "100%";
    swiperContainer.style.width = "100%";

    var swiperWrapper = document.createElement("div");
    swiperWrapper.className = "swiper-wrapper";

    properties
        .map(function (item) {
            return createItemDOM(item);
        })
        .forEach(function (dom) {
            swiperWrapper.appendChild(dom);
        });

    swiperContainer.appendChild(swiperWrapper);
    return swiperContainer;
}

/*
Item structure

*/
function createItemDOM(item) {
    var itemContainer = document.createElement("div");
    itemContainer.className = "item swiper-slide";
    itemContainer.id = "property-id-" + item.id;
    itemContainer.style.height = "239px";

    var style = getStyleString({
        background: "#fff",
        padding: "10px",
        "box-sizing": "border-box",
        width: "170px",
        border: "1px solid #cac3c3",
        "border-radius": "7px"
    });

    itemContainer.style = style;

    itemContainer.appendChild(createProductImageDOM(item.image_link, item.id, item.link));

    var marketImage = bz.Creative.getElementByName("MarketPlaceTag").el;
    var marketUrl = marketImage.firstChild.style.backgroundImage;

    var marketImageDiv = document.createElement("div");
    marketImageDiv.style.height = "36px";
    marketImageDiv.style.width = "100px";
    marketImageDiv.style.backgroundImage = marketUrl;
    marketImageDiv.style.backgroundSize = "contain";
    marketImageDiv.style.backgroundRepeat = "no-repeat";
    marketImageDiv.style.backgroundPosition = "center";
    marketImageDiv.style.position = "absolute";
    marketImageDiv.style.top = 0;
    marketImageDiv.style.left = "-11px";

    itemContainer.appendChild(marketImageDiv);

    itemContainer.appendChild(createTitleDOM(item.title));

    var bottomContainer = document.createElement("div");
    bottomContainer.style.margin = "8px 0 0 0";

    bottomContainer.appendChild(createPriceDOM(item.price));
    bottomContainer.appendChild(createCTADOM(item.link, item.id));

    itemContainer.appendChild(bottomContainer);

    return itemContainer;
}

function createProductImageDOM(url, id, productLink) {
    var style = getStyleString({
        height: "154px",
        "background-image": "url(" + url + ")",
        "background-size": "contain",
        "background-repeat": "no-repeat",
        "background-position": "center center",
        cursor: "pointer"
    });

    var imageContainer = document.createElement("div");
    imageContainer.className = "property-image";
    imageContainer.style = style;

    imageContainer.addEventListener("click", function () {
        bz.Creative.triggerAnalyticsEvent(
            "click",
            "Click/Tap",
            bz.Constants.EventType.CLICKTHROUGH,
            {
                acts: [
                    {
                        aid: "ic" + id,
                        at: "Click Through",
                        a: "openurl",
                        ap: productLink,
                        an: "Open URL"
                    }
                ],
                eleid: "i" + id,
                elen: "Image " + id,
                elet: "IMAGE"
            }
        );
        bz.Actions.openUrl(productLink);
    });

    return imageContainer;
}

function createTitleDOM(title) {
    var style = getStyleString({
        "text-align": "left",
        margin: "0",
        overflow: "hidden",
        "-webkit-line-clamp": 2,
        display: "-webkit-box",
        "text-overflow": "ellipsis",
        "-webkit-box-orient": "vertical",
        "font-family": "FuturaStd-Heavy,Arial",
        "font-size": "0.65em",
        "line-height": "1.5",
        height: "2.8em"
    });

    var titleContainer = document.createElement("p");
    titleContainer.innerHTML = title;
    titleContainer.style = style;
    titleContainer.title = title;

    return titleContainer;
}

function createPriceDOM(price) {
    var style = getStyleString({
        "text-align": "left",
        color: "#0d5257",
        "font-weight": "bold",
        "font-family": "Futurabold",
        "font-size": "1em",
        "padding-top": "1px",
        float: "left",
        margin: 0
    });

    var priceContainer = document.createElement("p");
    priceContainer.innerHTML = "$" + price;
    priceContainer.style = style;

    return priceContainer;
}

function createCTADOM(url, id) {
    var style = getStyleString({
        background: "#0f5258",
        "border-radius": "3px",
        "font-family": "FuturaStd-Heavy,Arial",
        float: "right",
        color: "#fff",
        outline: "none",
        border: "none",
        padding: "5px 12px",
        cursor: "pointer"
    });

    var cta = document.createElement("button");
    cta.innerHTML = "See More";
    cta.style = style;

    cta.addEventListener("click", function () {
        bz.Creative.triggerAnalyticsEvent(
            "click",
            "Click/Tap",
            bz.Constants.EventType.CLICKTHROUGH,
            {
                acts: [
                    {
                        aid: "cc" + id,
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
    });

    return cta;
}

function injectCSS(cssLinks) {
    injectLinksInHead("stylesheet", cssLinks);
}

function injectDNSPrefetchLinks(domains) {
    injectLinksInHead("dns-prefetch", domains);
}

function injectLinksInHead(rel, hrefs) {
    var head = bz.Creative.getPublisherWindow().document.getElementsByTagName("head")[0];
    var allLinks = getDOMElementsFragment(
        hrefs.map(function (href) {
            return getLinkDOM(rel, href);
        })
    );

    head.appendChild(allLinks);
}

function getLinkDOM(rel, href) {
    var link = document.createElement("link");
    link.setAttribute("rel", rel);
    link.setAttribute("href", href);

    return link;
}

function getDOMElementsFragment(listOfDOMElements) {
    var fragment = new DocumentFragment();

    listOfDOMElements.forEach(function (dom) {
        fragment.appendChild(dom);
    });

    return fragment;
}

function getStyleString(styleObj) {
    return Object.keys(styleObj)
        .map(function (key) {
            return key + ":" + styleObj[key];
        })
        .join(";");
}
