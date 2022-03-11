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

/**
 * Data required
 *
 * 1. Mouse over creative by date and by user
 * 2. In-view when not yet interacted by date and by user
 * 3. In-view time after user interaction by date by user
 * 4. CTA click
 * 5. Image click
 * 6. Auto property view
 * 7. Next nav prop view
 * 8. Prev nav prop view
 */

var ANALYTICS_SPREADSHEET_ID = "15Cya_t61LTKTmG202l4eJKXgGDuojxeLwn5_mwaZW_c";
var ITEMS_PER_VIEW = 3;
var ICON_ELEMENT_NAME = "1_Icons";
var CTA_ELEMENT_NAME = "1_CTA";
var address_ELEMENT_NAME = "1_Address";
var FEED_JSON_ELEMENT = "feed_data";
var LEFT_BUTTON_ELEMENT = "leftButton";
var RIGHT_BUTTON_ELEMENT = "rightButton";
var IS_TESTING = false; // TODO Use false for production
var logger = new Logger(Logger.levels.ERRORS); // TODO Revert to ERROR for production & INFO for checking the output

initialize();

function initialize() {
    injectDNSPrefetchLinks([
        "https://static2.bhgre.com.au/",
        "https://cdn.jsdelivr.net/"
    ]);

    injectCSS(["https://cdn.jsdelivr.net/npm/swiper@6.6.2/swiper-bundle.min.css"]);

    var hasUserInteractedState = new State("HasUserInteracted", false);
    var inViewState = new State("IsInView", bz.Creative.isInView());

    watchViewability(inViewState);

    bz.Common.loadScripts([
        "https://cdn.jsdelivr.net/npm/swiper@6.6.2/swiper-bundle.min.js"
    ]).then(function () {
        initializeCarousel(
            bz.Common.include("Swiper"),
            hasUserInteractedState,
            inViewState
        );
    });

    var userId = getUniqueString(8);

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
                return response;
            }

            var error = new Error(response.statusText);
            error.response = response;
            return Promise.reject(error);
        }

        var fetchWithErrorHandler = function (endpoint, config) {
            return fetch(endpoint, config).then(checkStatus);
        };

        setupMouseOverMeasurement(fetchWithErrorHandler, userId);
        setupInViewWhenNotInteracted(
            fetchWithErrorHandler,
            userId,
            hasUserInteractedState,
            inViewState
        );
        setupInViewWhenInteracted(
            fetchWithErrorHandler,
            userId,
            hasUserInteractedState,
            inViewState
        );
    });
}

function initializeCarousel(Swiper, hasUserInteractedState, inViewState) {
    var page = bz.Creative.getPageByName("Banner Main").el;
    page.style.userSelect = "none";

    try {
        var properties = JSON.parse(
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
    }

    bz.Common.preloadImages(
        properties.slice(0, 3).map(function (property) {
            return property.propertyImage512;
        }),
        function () {
            var carouselContainer = bz.Creative.getElementByName("Carousel_Container");

            // Use Carousel_Container element as the container for the carousel or use page.
            (carouselContainer ? carouselContainer.el : page).appendChild(
                createSwiperCarouselDOM(properties, hasUserInteractedState)
            );

            // Hide base creative elements
            setTimeout(function () {
                hideElements([
                    "image_1",
                    "image_2",
                    "image_3",
                    "Button 2",
                    "imgClick_1",
                    "imgClick_2",
                    "imgClick_3",
                    "1_Icons",
                    "2_Icons",
                    "3_Icons",
                    "1_Address",
                    "2_Address",
                    "3_Address",
                    "1_Bedroom",
                    "2_Bedroom",
                    "3_Bedroom",
                    "1_Bathroom",
                    "2_Bathroom",
                    "3_Bathroom",
                    "1_Parking",
                    "2_Parking",
                    "3_Parking",
                    "1_CTA",
                    "2_CTA",
                    "3_CTA"
                ]);
                swiper.autoplay.start();
            }, 900);

            setupNavigationButtons(hasUserInteractedState);

            var swiper = new Swiper(".swiper-container", {
                loop: true,
                autoplay: true,
                slidesPerView: ITEMS_PER_VIEW,
                spaceBetween: 35,
                preloadImages: false,
                navigation: {
                    nextEl: ".bz-button-next",
                    prevEl: ".bz-button-prev"
                }
            });
            swiper.autoplay.stop();
            document.addEventListener(".item", function () {
                swiper.autoplay.stop();
            });

            setupInViewLogic(swiper, inViewState);
            setupPropertyViewMeasurement(swiper, properties, hasUserInteractedState);
        }
    );
}

function setupNavigationButtons(hasUserInteractedState) {
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

    function recordInteraction() {
        hasUserInteractedState.set(true);
    }

    leftButton.el.addEventListener("click", recordInteraction);
    rightButton.el.addEventListener("click", recordInteraction);
}

function setupInViewLogic(swiper, inViewState) {
    bz.Creative.waitForOutOfView(
        function () {
            swiper.autoplay.stop();
        },
        10 /* % */,
        false /* fireOnce */
    );

    inViewState.onChange(function (isInView) {
        if (isInView === false) {
            swiper.autoplay.stop();
        }
    });
}

function createSwiperCarouselDOM(properties, hasUserInteractedState) {
    var swiperContainer = document.createElement("div");
    swiperContainer.className = "swiper-container";

    var swiperWrapper = document.createElement("div");
    swiperWrapper.className = "swiper-wrapper";

    properties
        .map(function (item) {
            return createItemDOM(item, hasUserInteractedState);
        })
        .forEach(function (dom) {
            swiperWrapper.appendChild(dom);
        });

    swiperContainer.appendChild(swiperWrapper);
    return swiperContainer;
}

/*
Item structure

{
    bathrooms: 1
    bedrooms: 0
    carSpaces: 1
    listingUrl: "https://www.bhgre.com.au/property/2002975"
    propertyId: 2002975
    propertyImage512: "https://static2.bhgre.com.au/5007/listing/2000228/2000228_3472565original.512x308.jpg"
    address: "Pacific Highway"
    suburb: "Greenwich"
}
*/
function createItemDOM(item, hasUserInteractedState) {
    var itemContainer = document.createElement("div");
    itemContainer.className = "item swiper-slide";
    itemContainer.id = "property-id-" + item.propertyId;

    var bottomContainer = document.createElement("div");

    itemContainer.appendChild(
        createPropertyImageDOM(
            item.propertyImage512,
            item.propertyId,
            item.listingUrl,
            hasUserInteractedState
        )
    );
    itemContainer.appendChild(createaddressDOM(item.address));
    bottomContainer.appendChild(
        createIconsDOM(item.bathrooms, item.bedrooms, item.carSpaces)
    );
    bottomContainer.appendChild(
        createCTADOM(item.propertyId, item.listingUrl, hasUserInteractedState)
    );
    itemContainer.appendChild(bottomContainer);

    return itemContainer;
}

function createPropertyImageDOM(url, propertyId, listingUrl, hasUserInteractedState) {
    var style = getStyleString({
        height: "154px",
        "background-image": "url(" + url + ")",
        "background-size": "cover",
        "background-repeat": "no-repeat",
        "background-position": "center center",
        cursor: "pointer"
    });

    var imageContainer = document.createElement("div");
    imageContainer.className = "property-image";
    imageContainer.style = style;

    imageContainer.addEventListener("click", function () {
        hasUserInteractedState.set(true);
        bz.Creative.triggerAnalyticsEvent(
            "click",
            "Click/Tap",
            bz.Constants.EventType.CLICKTHROUGH,
            {
                acts: [
                    {
                        aid: "ic" + propertyId,
                        at: "Click Through",
                        a: "openurl",
                        ap: listingUrl,
                        an: "Open URL"
                    }
                ],
                eleid: "i" + propertyId,
                elen: "Image " + propertyId,
                elet: "IMAGE"
            }
        );
        bz.Actions.openUrl(listingUrl);
    });

    return imageContainer;
}

function createaddressDOM(address) {
    var exampleaddressElement = bz.Creative.getElementByName(address_ELEMENT_NAME);
    if (!exampleaddressElement) {
        logger.error(
            "createaddressDOM: Could not find element of name " + address_ELEMENT_NAME
        );
    }

    var addressStyle = window.getComputedStyle(exampleaddressElement.el);

    var style = getStyleString({
        "text-align": "left",
        "font-family": addressStyle.getPropertyValue("font-family"),
        color: "#339932",
        margin: "5px 0 0 0"
    });

    var addressContainer = document.createElement("p");
    addressContainer.innerHTML = address;
    addressContainer.style = style;

    return addressContainer;
}

var getIconSprite = (function () {
    var exampleIcons = bz.Creative.getElementByName(ICON_ELEMENT_NAME);

    if (!exampleIcons) {
        logger.error(
            "getIconSprite: Could not find element of name " + ICON_ELEMENT_NAME
        );
    }

    var innerDiv = exampleIcons.el.querySelector(".bz-el-rotate");
    var imageUrl = innerDiv.style.backgroundImage.replace("url(", "").replace(")", "");

    return function () {
        return imageUrl;
    };
})();

function createIconsDOM(bathrooms, bedrooms, carSpaces) {
    var iconsContainer = document.createElement("div");
    iconsContainer.style.float = "left";
    iconsContainer.style.width = "65%";
    iconsContainer.style.height = "32px";
    iconsContainer.style.paddingTop = "2px";

    var parkingTextEl = bz.Creative.getElementByName("3_Parking").el;
    var countComputedStyle = window.getComputedStyle(parkingTextEl);

    var commonIconStyle = {
        "background-image": "url(" + getIconSprite() + ")",
        width: "23px",
        height: "23px",
        display: "inline-block",
        "background-size": "170px 32px",
        "background-repeat": "no-repeat",
        float: "left"
    };
    var countStyle = {
        "text-align": "left",
        "font-family": countComputedStyle.getPropertyValue("font-family"),
        float: "left",
        height: "32px",
        "padding-top": "3px",
        "box-sizing": "border-box",
        "margin-left": "6px",
        color: countComputedStyle.getPropertyValue("color")
    };

    var bedroomIcon = document.createElement("div");
    bedroomIcon.style = getStyleString(commonIconStyle);
    bedroomIcon.style.backgroundPosition = "-25px -2px";

    var bedroomCount = document.createElement("span");
    bedroomCount.style = getStyleString(countStyle);
    bedroomCount.innerHTML = bedrooms;

    var bathroomIcon = document.createElement("div");
    bathroomIcon.style = getStyleString(commonIconStyle);
    bathroomIcon.style.backgroundPosition = "-75px -2px";
    bathroomIcon.style.marginLeft = "11px";

    var bathroomCount = document.createElement("span");
    bathroomCount.style = getStyleString(countStyle);
    bathroomCount.innerHTML = bathrooms;

    var carSpacesIcon = document.createElement("div");
    carSpacesIcon.style = getStyleString(commonIconStyle);
    carSpacesIcon.style.backgroundPosition = "-127px -2px";
    carSpacesIcon.style.marginLeft = "14px";

    var carSpacesCount = document.createElement("span");
    carSpacesCount.style = getStyleString(countStyle);
    carSpacesCount.innerHTML = carSpaces;

    iconsContainer.appendChild(bedroomIcon);
    iconsContainer.appendChild(bedroomCount);
    iconsContainer.appendChild(bathroomIcon);
    iconsContainer.appendChild(bathroomCount);
    iconsContainer.appendChild(carSpacesIcon);
    iconsContainer.appendChild(carSpacesCount);

    return iconsContainer;
}

var getExampleCTAStyle = (function ctaDOM() {
    var exampleCTA = bz.Creative.getElementByName(CTA_ELEMENT_NAME);

    if (!exampleCTA) {
        logger.error("getExampleCTAStyle: Could not element of name " + CTA_ELEMENT_NAME);
    }

    var innerDiv = exampleCTA.el.querySelector(".bz-el-rotate");
    var style = {
        height: exampleCTA.el.style.height,
        width: exampleCTA.el.style.width,
        "background-image": innerDiv.style.backgroundImage
    };

    return function () {
        return style;
    };
})();

function createCTADOM(propertyId, listingUrl, hasUserInteractedState) {
    var cta = document.createElement("div");
    var exampleCTAStyle = getExampleCTAStyle();

    exampleCTAStyle["background-size"] = "contain";
    exampleCTAStyle.float = "right";
    exampleCTAStyle.cursor = "pointer";

    cta.style = getStyleString(exampleCTAStyle);

    cta.addEventListener("click", function () {
        hasUserInteractedState.set(true);
        bz.Creative.triggerAnalyticsEvent(
            "click",
            "Click/Tap",
            bz.Constants.EventType.CLICKTHROUGH,
            {
                acts: [
                    {
                        aid: "cc" + propertyId,
                        at: "Click Through",
                        a: "openurl",
                        ap: listingUrl,
                        an: "Open URL"
                    }
                ],
                eleid: "c" + propertyId,
                elen: "CTA " + propertyId,
                elet: "BUTTON"
            }
        );
        bz.Actions.openUrl(listingUrl);
    });

    return cta;
}

function setupMouseOverMeasurement(fetch, userId) {
    var publisherContainer = bz.Creative.getPublisherAdContainer();
    var mouseOverTimer = new Timer("MouseOver");

    publisherContainer.addEventListener("mouseover", function () {
        mouseOverTimer.start();
    });

    publisherContainer.addEventListener("mouseout", function () {
        mouseOverTimer.pause();
    });

    record(fetch, userId, mouseOverTimer, "mouseHoverTime", "A", function (
        elapsed,
        userId,
        formattedDate
    ) {
        return [elapsed, userId, formattedDate];
    });
}

function setupInViewWhenNotInteracted(
    fetch,
    userId,
    hasUserInteractedState,
    inViewState
) {
    var inViewTimer = new Timer("InView");

    inViewTimer.start();

    if (!bz.Creative.isInView()) {
        inViewTimer.pause();
    }

    bz.Creative.waitForOutOfView(function () {
        logger.info("Ad went out of view");
        inViewTimer.pause();
    });

    bz.Creative.waitForInView(function () {
        logger.info("Ad came into view");
        inViewTimer.resume();
    });

    hasUserInteractedState.onChange(function (hasUserInteracted) {
        if (hasUserInteracted) {
            inViewTimer.stop();
        }
    });

    inViewState.onChange(function (inView) {
        if (inView === true) {
            inViewTimer.resume();
        } else {
            inViewTimer.pause();
        }
    });

    record(fetch, userId, inViewTimer, "autoInteractionTime", "A", function (
        elapsed,
        userId,
        formattedDate
    ) {
        return [elapsed, userId, formattedDate];
    });
}

function setupInViewWhenInteracted(fetch, userId, hasUserInteractedState, inViewState) {
    var inViewTimer = new Timer("InView");

    bz.Creative.waitForOutOfView(function () {
        inViewTimer.pause();
    });

    bz.Creative.waitForInView(function () {
        inViewTimer.resume();
    });

    hasUserInteractedState.onChange(function (hasUserInteracted) {
        if (hasUserInteracted) {
            inViewTimer.start();
        }
    });

    inViewState.onChange(function (isInView) {
        if (isInView === true) {
            inViewTimer.resume();
        } else {
            inViewTimer.pause();
        }
    });

    record(fetch, userId, inViewTimer, "userInteractionTime", "A", function (
        elapsed,
        userId,
        formattedDate
    ) {
        return [elapsed, userId, formattedDate];
    });
}

function record(fetch, userId, timer, sheetName, columnName, generateValues) {
    var lastRecorded = null;
    var row = null;
    var creatingRow = false;
    var formattedDate = getTodaysFormattedDate();

    function recordInSpreadsheet() {
        var elapsed = timer.getElapsed() / 1000;

        if (lastRecorded !== elapsed) {
            if (row == null && !creatingRow) {
                creatingRow = true; // Define creatingRow just below row = null
                storeNewSpreadSheetRow(
                    fetch,
                    sheetName,
                    generateValues(elapsed, userId, formattedDate)
                ).then(function (rowNumber) {
                    row = rowNumber;
                });
            } else if (row !== null) {
                updateSpreadSheetCell(fetch, sheetName, row, columnName, elapsed);
            }
            lastRecorded = elapsed;
        }

        if (elapsed < 300) {
            setTimeout(recordInSpreadsheet, 1000);
        }
    }

    recordInSpreadsheet();
}

function setupPropertyViewMeasurement(swiper, properties, hasUserInteractedState) {
    var prevActiveIndex = 0;

    swiper.on("slideChange", function () {
        var currentActiveIndex = swiper.realIndex;
        var propertyViewed;
        var propertyId;

        if (swiper.autoplay.running) {
            propertyViewed =
                properties[
                    (currentActiveIndex + (ITEMS_PER_VIEW - 1)) % properties.length
                ];
            propertyId = propertyViewed.propertyId;

            logger.info("Sending event for auto property viewed", {
                eventId: "apv" + propertyId,
                eventName: "Auto Initiated Property Viewed " + propertyId,
                eventType: bz.Constants.EventType.AUTO,
                eleid: "carousel",
                elen: "Dynamic Carousel",
                elet: "CAROUSEL"
            });

            bz.Creative.triggerAnalyticsEvent(
                "apv" + propertyId,
                "Auto Initiated Property Viewed " + propertyId,
                bz.Constants.EventType.AUTO,
                {
                    eleid: "carousel",
                    elen: "Dynamic Carousel",
                    elet: "CAROUSEL"
                }
            );
        } else if (
            currentActiveIndex > prevActiveIndex ||
            currentActiveIndex - prevActiveIndex === properties.length - 1
        ) {
            propertyViewed =
                properties[
                    (currentActiveIndex + (ITEMS_PER_VIEW - 1)) % properties.length
                ];
            propertyId = propertyViewed.propertyId;

            logger.info("Sending event for property viewed on next click", {
                eventId: "npv" + propertyId,
                eventName: "User Initiated Next Property Viewed " + propertyId,
                eventType: bz.Constants.EventType.INTERACTION,
                eleid: "carousel",
                elen: "Dynamic Carousel",
                elet: "CAROUSEL"
            });

            bz.Creative.triggerAnalyticsEvent(
                "npv" + propertyId,
                "User Initiated Next Property Viewed " + propertyId,
                bz.Constants.EventType.INTERACTION,
                {
                    eleid: "carousel",
                    elen: "Dynamic Carousel",
                    elet: "CAROUSEL"
                }
            );
        } else {
            propertyViewed = properties[currentActiveIndex];
            propertyId = propertyViewed.propertyId;

            logger.info("Sending event for property viewed on previous click", {
                eventId: "ppv" + propertyId,
                eventName: "User Initiated Previous Property Viewed " + propertyId,
                eventType: bz.Constants.EventType.INTERACTION,
                eleid: "carousel",
                elen: "Dynamic Carousel",
                elet: "CAROUSEL"
            });

            bz.Creative.triggerAnalyticsEvent(
                "ppv" + propertyId,
                "User Initiated Previous Property Viewed " + propertyId,
                bz.Constants.EventType.INTERACTION,
                {
                    eleid: "carousel",
                    elen: "Dynamic Carousel",
                    elet: "CAROUSEL"
                }
            );
        }

        prevActiveIndex = currentActiveIndex;
    });
}

function injectCSS(cssLinks) {
    injectLinksInHead("stylesheet", cssLinks);
}

function injectDNSPrefetchLinks(domains) {
    injectLinksInHead("dns-prefetch", domains);
}

function injectLinksInHead(rel, hrefs) {
    var head = document.getElementsByTagName("head")[0];
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

function hideElements(names) {
    names
        .map(function (name) {
            var element = bz.Creative.getElementByName(name);
            return element ? element.el : null;
        })
        .filter(function (el) {
            return el != null;
        })
        .forEach(function (el) {
            el.style.display = "none";
        });
}

function getUniqueString(length) {
    var result = [];
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }

    return result.join("");
}

function getTodaysFormattedDate() {
    var d = new Date();
    var dt = d.getDate();
    var month = d.getMonth() + 1;

    if (dt < 10) {
        dt = "0" + dt;
    }
    var yr = d
        .getFullYear()
        .toString()
        .substr(-2);

    if (month < 10) {
        month = "0" + month;
    }
    return month + "/" + dt + "/" + yr;
}

var Timer = (function () {
    function Timer(name) {
        this.name = name;
        this.elapsed = 0;
        this.startTime = null;
        this.state = Timer.states.INITIALIZED;
        // this._timerId = null;
    }

    Timer.states = {
        INITIALIZED: "initialized",
        RUNNING: "running",
        PAUSED: "paused",
        STOPPED: "stopped"
    };

    // Timer.prototype._startTick = function () {
    //     var timer = this;

    //     (function tick() {
    //         timer.elapsed = new Date() - timer.startTime;

    //         if (timer.state === Timer.states.RUNNING) {
    //             timer._timerId = setTimeout(tick, 500);
    //         }
    //     }());
    // };

    // Timer.prototype._stopTick = function () {
    //     clearTimeout(this._timerId);
    // };

    Timer.prototype.start = function () {
        if (
            this.state === Timer.states.INITIALIZED ||
            this.state === Timer.states.PAUSED
        ) {
            this.startTime = new Date();
            this.state = Timer.states.RUNNING;
            // this._startTick();
        }
    };

    Timer.prototype.isRunning = function () {
        return this.state === Timer.states.RUNNING;
    };

    Timer.prototype.reset = function () {
        this.startTime = null;
        this.elapsed = 0;
        this.state = Timer.states.INITIALIZED;
    };

    Timer.prototype.pause = function () {
        if (this.state === Timer.states.RUNNING) {
            this.elapsed += new Date() - this.startTime;
            this.state = Timer.states.PAUSED;
            // this._stopTick();
        }

        return this.elapsed;
    };

    Timer.prototype.resume = function () {
        if (this.state === Timer.states.PAUSED) {
            this.startTime = new Date();
            this.state = Timer.states.RUNNING;
            // this._startTick();
        }
    };

    Timer.prototype.stop = function () {
        if (this.state !== Timer.states.STOPPED) {
            this.elapsed += new Date() - this.startTime;
            this.startTime = null;

            this.state = Timer.states.STOPPED;
            // this._stopTick();
        }

        return this.elapsed;
    };

    Timer.prototype.getElapsed = function () {
        return (
            this.elapsed +
            (this.state === Timer.states.RUNNING ? new Date() - this.startTime : 0)
        );
    };

    return Timer;
})();

function State(name, initial) {
    this.name = name;
    this.store = initial;
    this.cbs = [];
}

State.prototype.set = function (value) {
    this.store = value;
    this.cbs.forEach(function (cb) {
        cb(value);
    });
};

State.prototype.get = function () {
    return this.store;
};

State.prototype.onChange = function (cb) {
    this.cbs.push(cb);
    cb(this.store);
};

function storeNewSpreadSheetRow(fetch, sheetName, values) {
    logger.test("Storing data in spreadsheet", {
        sheetName: sheetName,
        values: values
    });
    if (IS_TESTING) {
        return Promise.resolve(0);
    }
    return fetch("https://04apyp8qj6.execute-api.ap-southeast-1.amazonaws.com/dev/row", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
            spreadsheetId: ANALYTICS_SPREADSHEET_ID,
            range: sheetName,
            values: [values]
        })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.row;
        });
}

function updateSpreadSheetCell(fetch, sheetName, row, columnName, value) {
    logger.test("Storing data in spreadsheet", {
        sheetName: sheetName,
        row: row,
        column: columnName,
        value: value
    });
    if (IS_TESTING) {
        return Promise.resolve(0);
    }

    return fetch(
        "https://04apyp8qj6.execute-api.ap-southeast-1.amazonaws.com/dev/cell/" +
            columnName +
            row,
        {
            method: "PUT",
            mode: "cors",
            body: JSON.stringify({
                spreadsheetId: ANALYTICS_SPREADSHEET_ID,
                sheetName: sheetName,
                value: value
            })
        }
    );
}

function onScroll(pubWin, inViewState) {
    var container = bz.Creative.getPublisherAdContainer();
    var containerArea = container.offsetHeight;

    return function () {
        var boundingRect = container.getBoundingClientRect();
        var bottom = Math.min(boundingRect.bottom, pubWin.innerHeight);
        var top = Math.max(boundingRect.top, 0);
        var height = (bottom < 0 ? 0 : bottom) - top;
        var visibleArea = height < 0 ? 0 : height;
        var percentVisible = visibleArea / containerArea;

        if (percentVisible > 0.1) {
            inViewState.set(true);
        } else {
            inViewState.set(false);
        }
    };
}

function watchViewability(inViewState) {
    var pubWin = bz.Creative.getPublisherWindow();
    pubWin.addEventListener(
        "scroll",
        bz.Common.debounce(onScroll(pubWin, inViewState), 10)
    );

    /*
    if (!window.IntersectionObserver) {
        pubWin.addEventListener("scroll", debouncedOnScroll);
        return;
    }
    var observerCb = function (entries) {
        intersectionCb(entries, adContainerGrandparent);
    };
    adVisibilityObserver = new IntersectionObserver(observerCb, {
        threshold: [0.5, 0.6, 0.95, 1]
    });
    adVisibilityObserver.observe(adContainerGrandparent);
    return bz.Common.noop;
    */
}
