var page = bz.Creative.getPageByName("Banner Main").el;
page.style.userSelect = "none";

var dnsPrefetchTag = document.createElement("link");
dnsPrefetchTag.setAttribute("rel", "dns-prefetch");
dnsPrefetchTag.setAttribute("href", "https://fonts.gstatic.com/");
document.getElementsByTagName("head")[0].appendChild(dnsPrefetchTag);

var iframeContainer =
    document.querySelector("#ad-container") ||
    window.top.document.querySelector("#bannermain") ||
    window.frameElement;

//initial check...
var flag = false;
var timeFlagVisible = true;
var autoSessionInterval = 0;
var autoDisplay;
var stopOwlCarouselAfterOutOfView = document.createElement("button");
stopOwlCarouselAfterOutOfView.style.opacity = 0;
stopOwlCarouselAfterOutOfView.classList.add("stopOwlCarouselAfterOutOfView");
page.appendChild(stopOwlCarouselAfterOutOfView);
var dataReceivedFlag = false;
var totalAPIData = [];
var authToken = [];
var numberOfBedsAvailableArray = [];
var numberOfBathroomsAvailableArray = [];
var numberOfParkingsAvailableArray = [];
var streetNameArray = [];
var suburbArray = [];
var propertyImageURLArray = [];
var totalAddress = [];
var modifiedURL = [];
var addStatic2WordToTheURL;
var addDimensionsToTheURL;
var clickURLArray = [];
var propertyIdArray = [];
var x = [];
var y = [];

var position = iframeContainer.getBoundingClientRect();
if (
    position.top <= window.top.document.documentElement.clientHeight &&
    position.bottom >= 0
) {
    flag = true;
    if (timeFlagVisible) {
        mainFunction();
        autoSessionInterval = setInterval(autoSessionFunction, 1000);
        timeFlagVisible = false;
    }
} else {
    clearInterval(autoDisplay);
    stopOwlCarouselAfterOutOfView.click();
}

window.addEventListener("scroll", scrollFunction);

var fontElementOne = document.createElement("link");
fontElementOne.setAttribute("rel", "preconnect");
document.getElementsByTagName("head")[0].appendChild(fontElementOne);

var fontElementTwo = document.createElement("link");
fontElementTwo.setAttribute("rel", "stylesheet");
fontElementTwo.setAttribute(
    "href",
    "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@700&display=swap"
);
document.getElementsByTagName("head")[0].appendChild(fontElementTwo);

var elementOne = document.createElement("link");
elementOne.setAttribute("rel", "stylesheet");
elementOne.setAttribute("type", "text/css"); //
elementOne.setAttribute(
    "href",
    "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
);
document.getElementsByTagName("head")[0].appendChild(elementOne);

var elementTwo = document.createElement("link");
elementTwo.setAttribute("rel", "stylesheet");
elementTwo.setAttribute("type", "text/css");
elementTwo.setAttribute(
    "href",
    "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"
);
document.getElementsByTagName("head")[0].appendChild(elementTwo);

var i = 0;
var j = 1;
var k = 2;

var iCounter = 0;
var jCounter = 0;

var allAddress = bz.Creative.getElementByName("allAddress").el;
var allAddressWidth = allAddress.getBoundingClientRect().width;
var allAddressHeight = allAddress.getBoundingClientRect().height;

var bed_1 = bz.Creative.getElementByName("1_Bedroom").el;
var bath_1 = bz.Creative.getElementByName("1_Bathroom").el;
var park_1 = bz.Creative.getElementByName("1_Parking").el;
var add_1 = bz.Creative.getElementByName("1_Address").el;

var bed_2 = bz.Creative.getElementByName("2_Bedroom").el;
var bath_2 = bz.Creative.getElementByName("2_Bathroom").el;
var park_2 = bz.Creative.getElementByName("2_Parking").el;
var add_2 = bz.Creative.getElementByName("2_Address").el;

var bed_3 = bz.Creative.getElementByName("3_Bedroom").el;
var bath_3 = bz.Creative.getElementByName("3_Bathroom").el;
var park_3 = bz.Creative.getElementByName("3_Parking").el;
var add_3 = bz.Creative.getElementByName("3_Address").el;

var cta_1 = bz.Creative.getElementByName("1_CTA").el;
cta_1.style.zIndex = 999999;
cta_1.classList.add("cta_1");
var cta_2 = bz.Creative.getElementByName("2_CTA").el;
cta_2.style.zIndex = 999999;
cta_2.classList.add("cta_2");
var cta_3 = bz.Creative.getElementByName("3_CTA").el;
cta_3.style.zIndex = 999999;
cta_3.classList.add("cta_3");

var leftButton = bz.Creative.getElementByName("leftButton").el;
leftButton.classList.add("leftButton");
var rightButton = bz.Creative.getElementByName("rightButton").el;
rightButton.classList.add("rightButton");

cta_1.firstElementChild.style.cursor = "pointer";
cta_2.firstElementChild.style.cursor = "pointer";
cta_3.firstElementChild.style.cursor = "pointer";

leftButton.firstElementChild.style.cursor = "pointer";
rightButton.firstElementChild.style.cursor = "pointer";

var imgClick_1 = bz.Creative.getElementByName("imgClick_1").el;
imgClick_1.style.zIndex = 999999;
imgClick_1.style.cursor = "pointer";
imgClick_1.classList.add("imgClick_1");
var imageWidth_1 = imgClick_1.getBoundingClientRect().width;

var imgClick_2 = bz.Creative.getElementByName("imgClick_2").el;
imgClick_2.style.zIndex = 999999;
imgClick_2.style.cursor = "pointer";
imgClick_2.classList.add("imgClick_2");
var imageWidth_2 = imgClick_1.getBoundingClientRect().width;

var imgClick_3 = bz.Creative.getElementByName("imgClick_3").el;
imgClick_3.style.zIndex = 999999;
imgClick_3.style.cursor = "pointer";
imgClick_3.classList.add("imgClick_3");
var imageWidth_3 = imgClick_1.getBoundingClientRect().width;

var imageWidth = imageWidth_1 + imageWidth_2 + imageWidth_3 + 100;
var imageHeight = imgClick_1.getBoundingClientRect().height;

var rowNumber, rowNumberUserInteraction;
var randomNumber = Math.floor(Math.random() * 1000000000 + 1);

var mouseHoverTimeRow;

var autoSession = 0;
var autoSessionCounter = 0;
var autoSessionFlag = false;

var userSessionInterval = 0;
var userSessionCounter = 0;
var userInteractionFlagToStopAuto = true;
var userInteractionFlag = false;
var userInteractionCounter = 0;
var userSessionTime = 0;

var d, dt, mon, yr, totalMonth, totalTime;
calculateTime();

function scrollFunction() {
    console.log("scroll");
    var position = iframeContainer.getBoundingClientRect();
    if (
        position.top <= window.top.document.documentElement.clientHeight &&
        position.bottom >= 0
    ) {
        flag = true;
        if (timeFlagVisible) {
            clearInterval(autoDisplay);
            timeFlagVisible = false;
        }
    } else {
        console.log("else", flag);
        if (flag) {
            clearInterval(autoDisplay);
            stopOwlCarouselAfterOutOfView.click();
        }
    }
}

var mouseOverCounter = 0;
var mouseOverInterval = 0;
var firstMouseOver = 0;
var mouseOverSession = 0;
var mouseOverSessionInterval = 0;

iframeContainer.addEventListener("mouseover", mouseOverFunction);
iframeContainer.addEventListener("mouseout", mouseOutFunction);

function mouseOverFunction() {
    mouseOverInterval = setInterval(function () {
        mouseOverCounter++;
    }, 1000);
    if (firstMouseOver === 0) {
        firstMouseOver++;
        mouseOverSessionInterval = setInterval(function () {
            mouseOverSession++;
            if (mouseOverSession > 61) {
                clearInterval(mouseOverSessionInterval);
                clearInterval(mouseOverInterval);
                // bz.Common.loadScripts(["https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js"]).then(function() {
                //     var axios = bz.Common.include("axios");
                //     axios.post('https://04apyp8qj6.execute-api.ap-southeast-1.amazonaws.com/dev/row', {
                //         "spreadsheetId": "1Bb_d_TvJYzYr_AgUSpPpWdzRJuJUHFswHqJ7sAdbIwI",
                //         "range": "mouseHoverTime",
                //         "values": [
                //             [
                //                 mouseOverCounter, randomNumber, totalTime
                //             ] //these are the values needed to be stored
                //         ]
                //     }).then(function(response) {});
                // });
            }
        }, 1000);
    }
}

function mouseOutFunction() {
    clearInterval(mouseOverInterval);
}

var autoInteractionVariableFlag = true;

function mainFunction() {
    var URL = "https://api.cservices.com.au/auth/1518807372/token";
    var authURL = "https://api.cservices.com.au/bhgre/properties?state=nsw";

    fetch(URL, {
        headers: {
            key: "zrEG-ZCE7hFcvSA7lq",
            secret: "RyYAPhs1Kz-zt6HB-qxxx4T"
        }
    })
        .then(function (result) {
            return result.json();
        })
        .then(function (data) {
            authToken = data.Authorization;
            fetch(authURL, {
                headers: {
                    Authorization: authToken
                }
            })
                .then(function (apiResult) {
                    return apiResult.json();
                })
                .then(function (apiData) {
                    totalAPIData = apiData;

                    x = totalAPIData.map(function (e) {
                        y = e.propertyPhotos.map(function (f) {
                            if (f.position === 1 && f.type === "Property Photo") {
                                return f.url;
                            }
                        });
                        return y;
                    });

                    propertyImageURLArray = x.map(function (e, index) {
                        return e[0];
                    });

                    modifiedURL = propertyImageURLArray.map(function (e) {
                        addStatic2WordToTheURL = e.replace("static1", "static2");
                        addDimensionsToTheURL = addStatic2WordToTheURL.replace(
                            "original",
                            "original.512x308"
                        );
                        return addDimensionsToTheURL;
                    });

                    numberOfBedsAvailableArray = totalAPIData.map(function (e) {
                        return e.bedrooms;
                    });

                    numberOfBathroomsAvailableArray = totalAPIData.map(function (e) {
                        return e.bathrooms;
                    });

                    numberOfParkingsAvailableArray = totalAPIData.map(function (e) {
                        return e.carSpaces;
                    });

                    streetNameArray = totalAPIData.map(function (e) {
                        return e.streetName;
                    });

                    suburbArray = totalAPIData.map(function (e) {
                        return e.suburb;
                    });
                    totalAddress = streetNameArray.map(function (obj, index) {
                        var payload = {};
                        var key = suburbArray[index];
                        return obj.concat(", ").concat(key);
                    });

                    propertyIdArray = totalAPIData.map(function (e) {
                        return e.propertyId;
                    });

                    clickURLArray = totalAPIData.map(function (e) {
                        return e.listingUrl;
                    });

                    // console.log(modifiedURL);
                    // console.log(numberOfBedsAvailableArray)
                    // console.log(numberOfBathroomsAvailableArray)
                    // console.log(numberOfParkingsAvailableArray)
                    // console.log(totalAddress)
                    // console.log(propertyIdArray)
                    // console.log(clickURLArray)

                    function infoData() {
                        if (autoInteractionVariableFlag) {
                            if (i === 0 && iCounter === 0) {
                                iCounter++;
                                // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnAuto', totalAPIData[i].gsx$uniqueidnumerical.$t, "Auto", {
                                //     eleid: totalAPIData[i].gsx$uniqueidnumerical.$t,
                                //     elen: "PropertyInViewOnAuto",
                                //     //elet: "HOTSPOT_V2",
                                //     evt: "Auto"
                                // });
                            }

                            if (j === 1 && jCounter === 0) {
                                jCounter++;
                                // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnAuto', totalAPIData[j].gsx$uniqueidnumerical.$t, "Auto", {
                                //     eleid: totalAPIData[j].gsx$uniqueidnumerical.$t,
                                //     elen: "PropertyInViewOnAuto",
                                //     //elet: "HOTSPOT_V2",
                                //     evt: "Auto"
                                // });
                            }

                            // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnAuto', totalAPIData[k].gsx$uniqueidnumerical.$t, "Auto", {
                            //     eleid: totalAPIData[k].gsx$uniqueidnumerical.$t,
                            //     elen: "PropertyInViewOnAuto",
                            //     //elet: "HOTSPOT_V2",
                            //     evt: "Auto"
                            // });
                        } else {
                            // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnUserInteraction', totalAPIData[i].gsx$uniqueidnumerical.$t, "Interaction", {
                            //     eleid: totalAPIData[i].gsx$uniqueidnumerical.$t,
                            //     elen: "PropertyInViewOnUserInteraction",
                            //     //elet: "HOTSPOT_V2",
                            //     evt: "Interaction"
                            // });
                        }
                    }

                    if (totalAPIData.length > 0) {
                        infoData();

                        imgClick_1.addEventListener("click", function () {
                            autoInteractionVariableFlag = false;
                            window.open(totalAPIData[i].clickURLArray, "_blank");
                            clearInterval(autoDisplay);
                            userInteractionFlag = true;
                            if (userInteractionFlag && userInteractionCounter === 0) {
                                userInteractionCounter++;
                                userSessionInterval = setInterval(
                                    userSessionFunction,
                                    1000
                                );
                                userInteractionFlagToStopAuto = false;
                            }
                            // bz.Creative.triggerAnalyticsEvent('click', totalAPIData[i].gsx$uniqueidnumerical.$t, "Clickthrough", {
                            //     eleid: totalAPIData[i].gsx$uniqueidnumerical.$t,
                            //     elen: "PropertyImageClick",
                            //     elet: "IMAGE",
                            //     evt: "Clickthrough"
                            // });
                        });

                        cta_1.addEventListener("click", function () {
                            autoInteractionVariableFlag = false;
                            window.open(totalAPIData[i].clickURLArray, "_blank");
                            clearInterval(autoDisplay);
                            userInteractionFlag = true;
                            if (userInteractionFlag && userInteractionCounter === 0) {
                                userInteractionCounter++;
                                userSessionInterval = setInterval(
                                    userSessionFunction,
                                    1000
                                );
                                userInteractionFlagToStopAuto = false;
                            }
                            // bz.Creative.triggerAnalyticsEvent('click', totalAPIData[i].gsx$uniqueidnumerical.$t, "Clickthrough", {
                            //     eleid: totalAPIData[i].gsx$uniqueidnumerical.$t,
                            //     elen: "CTAClick",
                            //     elet: "IMAGE",
                            //     evt: "Clickthrough"
                            // });
                        });

                        imgClick_2.addEventListener("click", function () {
                            autoInteractionVariableFlag = false;
                            window.open(totalAPIData[j].clickURLArray, "_blank");
                            clearInterval(autoDisplay);
                            userInteractionFlag = true;
                            if (userInteractionFlag && userInteractionCounter === 0) {
                                userInteractionCounter++;
                                userSessionInterval = setInterval(
                                    userSessionFunction,
                                    1000
                                );
                                userInteractionFlagToStopAuto = false;
                            }
                            // bz.Creative.triggerAnalyticsEvent('click', totalAPIData[j].gsx$uniqueidnumerical.$t, "Clickthrough", {
                            //     eleid: totalAPIData[j].gsx$uniqueidnumerical.$t,
                            //     elen: "PropertyImageClick",
                            //     elet: "IMAGE",
                            //     evt: "Clickthrough"
                            // });
                        });

                        cta_2.addEventListener("click", function () {
                            autoInteractionVariableFlag = false;
                            window.open(totalAPIData[j].clickURLArray, "_blank");
                            clearInterval(autoDisplay);
                            userInteractionFlag = true;
                            if (userInteractionFlag && userInteractionCounter === 0) {
                                userInteractionCounter++;
                                userSessionInterval = setInterval(
                                    userSessionFunction,
                                    1000
                                );
                                userInteractionFlagToStopAuto = false;
                            }
                            // bz.Creative.triggerAnalyticsEvent('click', totalAPIData[j].gsx$uniqueidnumerical.$t, "Clickthrough", {
                            //     eleid: totalAPIData[j].gsx$uniqueidnumerical.$t,
                            //     elen: "CTAClick",
                            //     elet: "IMAGE",
                            //     evt: "Clickthrough"
                            // });
                        });

                        imgClick_3.addEventListener("click", function () {
                            autoInteractionVariableFlag = false;
                            window.open(totalAPIData[k].clickURLArray, "_blank");
                            clearInterval(autoDisplay);
                            userInteractionFlag = true;
                            if (userInteractionFlag && userInteractionCounter === 0) {
                                userInteractionCounter++;
                                userSessionInterval = setInterval(
                                    userSessionFunction,
                                    1000
                                );
                                userInteractionFlagToStopAuto = false;
                            }
                            // bz.Creative.triggerAnalyticsEvent('click', totalAPIData[k].gsx$uniqueidnumerical.$t, "Clickthrough", {
                            //     eleid: totalAPIData[k].gsx$uniqueidnumerical.$t,
                            //     elen: "PropertyImageClick",
                            //     elet: "IMAGE",
                            //     evt: "Clickthrough"
                            // });
                        });

                        cta_3.addEventListener("click", function () {
                            autoInteractionVariableFlag = false;
                            window.open(totalAPIData[k].clickURLArray, "_blank");
                            clearInterval(autoDisplay);
                            userInteractionFlag = true;
                            if (userInteractionFlag && userInteractionCounter === 0) {
                                userInteractionCounter++;
                                userSessionInterval = setInterval(
                                    userSessionFunction,
                                    1000
                                );
                                userInteractionFlagToStopAuto = false;
                            }
                            // bz.Creative.triggerAnalyticsEvent('click', totalAPIData[k].gsx$uniqueidnumerical.$t, "Clickthrough", {
                            //     eleid: totalAPIData[k].gsx$uniqueidnumerical.$t,
                            //     elen: "CTAClick",
                            //     elet: "IMAGE",
                            //     evt: "Clickthrough"
                            // });
                        });

                        leftButton.addEventListener("click", nextLeft);
                        rightButton.addEventListener("click", nextRight);

                        leftButton.addEventListener("click", clearIntLeft);
                        rightButton.addEventListener("click", clearIntRight);

                        function clearIntLeft() {
                            clearInterval(autoDisplay);
                            userInteractionFlag = true;

                            autoInteractionVariableFlag = false;
                            //console.log('Previois Button clicked');
                            if (i === 0 && iCounter === 0) {
                                iCounter++;
                                // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnPreviousButton', totalAPIData[i].gsx$uniqueidnumerical.$t, "Interaction", {
                                //     eleid: totalAPIData[i].gsx$uniqueidnumerical.$t,
                                //     elen: "PropertyInViewOnPreviousButton",
                                //     //elet: "HOTSPOT_V2",
                                //     evt: "Interaction"
                                // });
                            }

                            if (j === 1 && jCounter === 0) {
                                jCounter++;
                                // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnPreviousButton', totalAPIData[j].gsx$uniqueidnumerical.$t, "Interaction", {
                                //     eleid: totalAPIData[j].gsx$uniqueidnumerical.$t,
                                //     elen: "PropertyInViewOnPreviousButton",
                                //     //elet: "HOTSPOT_V2",
                                //     evt: "Interaction"
                                // });
                            }

                            // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnPreviousButton', totalAPIData[k].gsx$uniqueidnumerical.$t, "Interaction", {
                            //     eleid: totalAPIData[k].gsx$uniqueidnumerical.$t,
                            //     elen: "PropertyInViewOnPreviousButton",
                            //     //elet: "HOTSPOT_V2",
                            //     evt: "Interaction"
                            // });

                            if (userInteractionFlag && userInteractionCounter === 0) {
                                userInteractionCounter++;
                                userSessionInterval = setInterval(
                                    userSessionFunction,
                                    1000
                                );
                                userInteractionFlagToStopAuto = false;
                            }
                        }

                        function clearIntRight() {
                            clearInterval(autoDisplay);
                            userInteractionFlag = true;

                            autoInteractionVariableFlag = false;
                            if (i === 0 && iCounter === 0) {
                                iCounter++;
                                // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnNextButton', totalAPIData[i].gsx$uniqueidnumerical.$t, "Interaction", {
                                //     eleid: totalAPIData[i].gsx$uniqueidnumerical.$t,
                                //     elen: "PropertyInViewOnNextButton",
                                //     //elet: "HOTSPOT_V2",
                                //     evt: "Interaction"
                                // });
                            }

                            if (j === 1 && jCounter === 0) {
                                jCounter++;
                                // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnNextButton', totalAPIData[j].gsx$uniqueidnumerical.$t, "Interaction", {
                                //     eleid: totalAPIData[j].gsx$uniqueidnumerical.$t,
                                //     elen: "PropertyInViewOnNextButton",
                                //     //elet: "HOTSPOT_V2",
                                //     evt: "Interaction"
                                // });
                            }

                            // bz.Creative.triggerAnalyticsEvent('PropertyInViewOnNextButton', totalAPIData[k].gsx$uniqueidnumerical.$t, "Interaction", {
                            //     eleid: totalAPIData[k].gsx$uniqueidnumerical.$t,
                            //     elen: "PropertyInViewOnNextButton",
                            //     //elet: "HOTSPOT_V2",
                            //     evt: "Interaction"
                            // });

                            if (userInteractionFlag && userInteractionCounter === 0) {
                                userInteractionCounter++;
                                userSessionInterval = setInterval(
                                    userSessionFunction,
                                    1000
                                );
                                userInteractionFlagToStopAuto = false;
                            }
                        }

                        owlFunction();

                        function nextRight() {
                            ++i;
                            ++j;
                            ++k;
                            if (k > totalAPIData.length - 1) {
                                k = 0;
                            } else if (j > totalAPIData.length - 1) {
                                j = 0;
                            } else if (i > totalAPIData.length - 1) {
                                i = 0;
                            }

                            infoData();
                        }

                        function nextLeft() {
                            i--;
                            j--;
                            k--;
                            if (i < 0) {
                                i = totalAPIData.length - 1;
                            } else if (j < 0) {
                                j = totalAPIData.length - 1;
                            } else if (k < 0) {
                                k = totalAPIData.length - 1;
                            }

                            infoData();
                        }

                        autoDisplay = setInterval(function () {
                            nextRight();
                        }, 5150);
                    }
                })
                .catch(function (error) {});
        })
        .catch(function (error) {});
}

function owlFunction() {
    // var mainCarouselDiv = document.createElement('div');
    // mainCarouselDiv.classList.add('owl-carousel');
    // mainCarouselDiv.style.height = "200px";
    // mainCarouselDiv.style.width = "850px";
    // mainCarouselDiv.style.top = '16%';
    // mainCarouselDiv.style.position = 'relative';
    // mainCarouselDiv.style.margin = '0 auto';
    // mainCarouselDiv.style.border = '1px solid red';
    // page.appendChild(mainCarouselDiv);

    var owlDiv = document.createElement("div");
    owlDiv.classList.add("owl-carousel");
    owlDiv.style.height = imageHeight + "px";
    owlDiv.style.width = imageWidth + "px";
    owlDiv.style.top = "15%";
    owlDiv.style.position = "relative";
    owlDiv.style.margin = "0 auto";
    page.appendChild(owlDiv);

    var owlDivText = document.createElement("div");
    owlDivText.classList.add("owl-carousel");
    owlDivText.style.height = allAddressHeight + "px";
    owlDivText.style.width = allAddressWidth + "px";
    owlDivText.style.position = "relative";
    owlDivText.style.margin = "0 auto";
    owlDivText.style.top = "10%";
    page.appendChild(owlDivText);

    var owlBed = document.createElement("div");
    owlBed.classList.add("owl-carousel");
    owlBed.style.height = allAddressHeight + "px";
    owlBed.style.width = allAddressWidth + "px";
    owlBed.style.position = "absolute";
    owlBed.style.top = "84%";
    owlBed.style.left = "9%";
    page.appendChild(owlBed);

    var owlBath = document.createElement("div");
    owlBath.classList.add("owl-carousel");
    owlBath.style.height = allAddressHeight + "px";
    owlBath.style.width = allAddressWidth + "px";
    owlBath.style.position = "absolute";
    owlBath.style.top = "84%";
    owlBath.style.left = "14%";
    page.appendChild(owlBath);

    var owlPark = document.createElement("div");
    owlPark.classList.add("owl-carousel");
    owlPark.style.height = allAddressHeight + "px";
    owlPark.style.width = allAddressWidth + "px";
    owlPark.style.position = "absolute";
    owlPark.style.top = "84%";
    owlPark.style.left = "19%";
    page.appendChild(owlPark);

    var nURL = 0;
    var nAddress = 0;
    var nBed = 0;
    var nBath = 0;
    var nPark = 0;

    modifiedURL.map(function (d) {
        var ow = document.createElement("div");

        if (nURL === 0) {
            nURL++;
        }
        ow.style.height = "154px";
        ow.style.backgroundImage = "url(" + d + ")";
        ow.style.backgroundSize = "100% 100%";
        ow.classList.add("owlClass" + nURL);
        nURL++;
        owlDiv.appendChild(ow);
    });
    //totalAddress
    streetNameArray.map(function (w) {
        var owText = document.createElement("p");

        if (nAddress === 0) {
            nAddress++;
        }
        owText.style.textAlign = "left";
        owText.style.width = "256px";
        owText.innerHTML = w;
        owText.style.fontFamily = "'Nunito Sans',sans-serif";
        owText.style.color = "#339932";
        owText.classList.add("owlClass" + nAddress);
        nAddress++;
        owlDivText.appendChild(owText);
    });

    numberOfBedsAvailableArray.map(function (w) {
        var noOfBed = document.createElement("p");

        if (nBed === 0) {
            nBed++;
        }
        noOfBed.style.textAlign = "left";
        noOfBed.style.width = "25px";
        noOfBed.innerHTML = w;
        noOfBed.style.fontFamily = "'Nunito Sans',sans-serif";
        noOfBed.classList.add("owlClass" + nBed);
        nBed++;
        owlBed.appendChild(noOfBed);
    });

    numberOfBathroomsAvailableArray.map(function (w) {
        var noOfBath = document.createElement("p");

        if (nBath === 0) {
            nBath++;
        }
        noOfBath.style.textAlign = "left";
        noOfBath.style.width = "25px";
        noOfBath.innerHTML = w;
        noOfBath.style.fontFamily = "'Nunito Sans',sans-serif";
        noOfBath.classList.add("owlClass" + nBath);
        nBath++;
        owlBath.appendChild(noOfBath);
    });

    numberOfParkingsAvailableArray.map(function (w) {
        var noOfPark = document.createElement("p");

        if (nPark === 0) {
            nPark++;
        }
        noOfPark.style.textAlign = "left";
        noOfPark.style.width = "25px";
        noOfPark.innerHTML = w;
        noOfPark.style.fontFamily = "'Nunito Sans',sans-serif";
        noOfPark.classList.add("owlClass" + nPark);
        nPark++;
        owlPark.appendChild(noOfPark);
    });

    bz.Common.loadScripts([
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
    ]).then(function () {
        var $ = bz.Common.include("$");
        var owl = $(".owl-carousel");

        owl.owlCarousel({
            loop: true,
            margin: 35,
            nav: false,
            items: 3,
            autoplay: true,
            //autoplaySpeed: 100,
            mouseDrag: false,
            touchDrag: false
            //autoplayHoverPause: true
        });

        $(".rightButton").click(function () {
            owl.trigger("next.owl.carousel");
            owl.trigger("stop.owl.autoplay");
        });

        $(".leftButton").click(function () {
            owl.trigger("prev.owl.carousel");
            owl.trigger("stop.owl.autoplay");
        });

        $(".imgClick_1").click(function () {
            owl.trigger("stop.owl.autoplay");
        });

        $(".imgClick_2").click(function () {
            owl.trigger("stop.owl.autoplay");
        });

        $(".imgClick_3").click(function () {
            owl.trigger("stop.owl.autoplay");
        });
        $(".stopOwlCarouselAfterOutOfView").click(function () {
            owl.trigger("stop.owl.autoplay");
        });
    });
}

function autoSessionFunction() {
    autoSessionCounter++;
    var position = iframeContainer.getBoundingClientRect();
    if (
        position.top <= window.top.document.documentElement.clientHeight &&
        position.bottom >= 0 &&
        autoSessionCounter < 61
    ) {
        autoSession++;
    }

    if (autoSessionCounter > 61 || userInteractionFlagToStopAuto === false) {
        clearInterval(autoSessionInterval);

        // bz.Common.loadScripts(["https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js"]).then(function() {
        //     var axios = bz.Common.include("axios");
        //     axios.post('https://04apyp8qj6.execute-api.ap-southeast-1.amazonaws.com/dev/row', {
        //         "spreadsheetId": "1Bb_d_TvJYzYr_AgUSpPpWdzRJuJUHFswHqJ7sAdbIwI",
        //         "range": "autoInteractionTime",
        //         "values": [
        //             [
        //                 "", autoSession, randomNumber, totalTime
        //             ] //these are the values needed to be stored
        //         ]
        //     }).then(function(response) {});
        // });
    }
}

function userSessionFunction() {
    userSessionCounter++;
    var position = iframeContainer.getBoundingClientRect();
    if (
        position.top <= window.top.document.documentElement.clientHeight &&
        position.bottom >= 0 &&
        userSessionCounter < 61
    ) {
        userSessionTime++;
    }

    if (userSessionCounter > 61) {
        clearInterval(userSessionInterval);

        // bz.Common.loadScripts(["https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js"]).then(function() {
        //     var axios = bz.Common.include("axios");
        //     axios.post('https://04apyp8qj6.execute-api.ap-southeast-1.amazonaws.com/dev/row', {
        //         "spreadsheetId": "1Bb_d_TvJYzYr_AgUSpPpWdzRJuJUHFswHqJ7sAdbIwI",
        //         "range": "userInteractionTime",
        //         "values": [
        //             [
        //                 "", userSessionTime, randomNumber, totalTime
        //             ] //these are the values needed to be stored
        //         ]
        //     }).then(function(response) {});
        // });
    }
}

function calculateTime() {
    d = new Date();
    dt = d.getDate();
    mon = d.getMonth();
    totalMonth = mon + 1;
    if (dt < 10) {
        dt = "0" + dt;
    }
    yr = new Date()
        .getFullYear()
        .toString()
        .substr(-2);

    if (totalMonth < 10) {
        totalMonth = "0" + totalMonth;
    }
    totalTime = totalMonth + "/" + dt + "/" + yr;
}
