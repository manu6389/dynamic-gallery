/*
Item structure
*/
const createItemDOM = (config, item, onClickThrough) => {
    var itemContainer = document.createElement("div");
    itemContainer.className = "item swiper-slide";
    itemContainer.id = "property-id-" + item[config.idPropertyName];

    config.createItemDOM(item, itemContainer, onClickThrough);

    return itemContainer;
};

export const createSwiperCarouselDOM = (config, properties, onClickThrough) => {
    const swiperContainer = document.createElement("div");
    swiperContainer.className = "swiper";
    // swiperContainer.style.position = "relative";
    // swiperContainer.style.top = "35px";
    // swiperContainer.style.left = "0";
    swiperContainer.style.height = "100%";
    swiperContainer.style.width = "100%";

    var swiperWrapper = document.createElement("div");
    swiperWrapper.className = "swiper-wrapper";

    properties
        .map(function (item) {
            return createItemDOM(config, item, onClickThrough);
        })
        .forEach(function (dom) {
            swiperWrapper.appendChild(dom);
        });

    swiperContainer.appendChild(swiperWrapper);
    return swiperContainer;
};

export function injectLinksInHead(bz, onPublisherWindow, rel, hrefs) {
    var head = (onPublisherWindow
        ? bz.Creative.getPublisherWindow().document
        : document
    ).getElementsByTagName("head")[0];
    var allLinks = getDOMElementsFragment(
        hrefs.map(function (href) {
            return getLinkDOM(rel, href);
        })
    );

    head.appendChild(allLinks);
}

function getDOMElementsFragment(listOfDOMElements) {
    var fragment = new DocumentFragment();

    listOfDOMElements.forEach(function (dom) {
        fragment.appendChild(dom);
    });

    return fragment;
}

function getLinkDOM(rel, href) {
    var link = document.createElement("link");
    link.setAttribute("rel", rel);
    link.setAttribute("href", href);

    return link;
}
