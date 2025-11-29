// biome-ignore-all lint/suspicious/noRedundantUseStrict: Support for legacy browsers
// biome-ignore-all lint/complexity/useArrowFunction: Support for legacy browsers
// biome-ignore-all lint/complexity/useOptionalChain: Support for legacy browsers

(function () {
  "use strict";

  var chromeStorage = chrome && chrome.storage && chrome.storage.local;

  function getStorageData() {
    if (chromeStorage && chromeStorage.get) {
      if (typeof chromeStorage.get().then === "function") {
        chromeStorage.get().then(setMode);
      } else {
        chromeStorage.get(null, setMode);
      }
    }
  }

  function setupStorageListener() {
    if (
      chromeStorage &&
      chromeStorage.onChanged &&
      chromeStorage.onChanged.addListener
    ) {
      chromeStorage.onChanged.addListener(function () {
        getStorageData();
      });
    }
  }

  function handleRedirect(customOptions) {
    if (customOptions && customOptions.redirectToPlaylists) {
      if (window.location.pathname === "/") {
        window.location.pathname = "/feed/playlists";
      }
    }
  }

  getStorageData();
  setupStorageListener();

  function setMode(data) {
    if (
      !data ||
      !data.chosenMode /* ARCHIVE: || !data.chosenMode.contains(['brain', 'focus', 'default']) */
    ) {
      console.log("Wrong chosenMode!", data.chosenMode);
      return;
    }

    var customOptions = data.customOptions || {};

    handleRedirect(customOptions);

    if (data.chosenMode === "study") {
      study(customOptions);
    } else if (data.chosenMode === "brain") {
      brain(customOptions);
    } else if (data.chosenMode === "focus") {
      focus(customOptions);
    } else {
      normal();
    }
  }

  function removeExistingStyle(styleId) {
    var existingStyle = document.getElementById(styleId);
    if (existingStyle && existingStyle.parentNode) {
      existingStyle.parentNode.removeChild(existingStyle);
    }
  }

  function createAndAppendStyle(styleId, cssContent) {
    removeExistingStyle(styleId);

    var style = document.createElement("style");
    style.id = styleId;

    if (style.styleSheet) {
      style.styleSheet.cssText = cssContent;
    } else {
      style.appendChild(document.createTextNode(cssContent));
    }

    var head = document.head || document.getElementsByTagName("head")[0];
    if (head) {
      head.appendChild(style);
    }
  }

  function buildCSSFromOptions(options, mode) {
    var cssRules = [];
    var layoutRules = [];

    if (options.hideHome) {
      cssRules.push('*[page-subtype~="home"]');
    }
    if (options.hideTrending) {
      cssRules.push('_[href_="/feed/trending"]');
    }
    if (options.hideEndscreen) {
      cssRules.push(".ytp-endscreen-content");
    }
    if (options.hideRelatedContents) {
      cssRules.push("#related #contents");
    }
    if (options.hideRelatedUpnext) {
      cssRules.push("#related #upnext");
    }
    if (options.hideRelatedItems) {
      cssRules.push("#related #items");
    }
    if (options.hideCompactVideo) {
      if (mode === "focus") {
        cssRules.push("ytd-compact-video-renderer:nth-child(n+4)");
      } else {
        cssRules.push("#related ytd-compact-video-renderer");
      }
    }
    if (options.hideCompactPlaylist) {
      cssRules.push("#related ytd-compact-playlist-renderer");
    }
    if (options.hideCompactRadio) {
      cssRules.push("#related ytd-compact-radio-renderer");
    }
    if (options.hideWatchSidebar) {
      cssRules.push(".watch-sidebar-body");
    }
    if (options.hideFooter) {
      cssRules.push("#footer");
    }
    if (options.hideWhatToWatch) {
      cssRules.push("#feed-main-what_to_watch");
    }
    if (options.hideGuideButton) {
      cssRules.push("#guide-button");
    }
    if (options.hideVoiceSearch) {
      cssRules.push("#voice-search-button");
    }
    if (options.hideNotifications) {
      cssRules.push("ytd-notification-topbar-button-renderer");
    }
    if (options.hideAvatarButton) {
      cssRules.push("ytd-topbar-menu-button-renderer#avatar-btn");
    }
    if (options.hideSecondaryResults) {
      cssRules.push("#secondary-results");
    }
    if (options.hideGuideSection2) {
      cssRules.push("ytd-guide-section-renderer.style-scope:nth-child(2)");
    }
    if (options.hideGuideSection4) {
      cssRules.push("ytd-guide-section-renderer.style-scope:nth-child(4)");
    }
    if (options.hideGuideSection5) {
      cssRules.push("ytd-guide-section-renderer.style-scope:nth-child(5)");
    }
    if (options.hideGuideSection6) {
      cssRules.push("ytd-guide-section-renderer.style-scope:nth-child(6)");
      cssRules.push(
        "ytd-guide-section-renderer.style-scope:nth-child(6) > div:nth-child(2)",
      );
    }
    if (options.hideGuideEntry2) {
      cssRules.push(
        "ytd-guide-section-renderer.style-scope:nth-child(1) > div:nth-child(2) > ytd-guide-entry-renderer:nth-child(2)",
      );
    }
    if (options.hideMenuSection1) {
      cssRules.push(
        "yt-multi-page-menu-section-renderer.style-scope:nth-child(1) > div:nth-child(2) > ytd-compact-link-renderer:nth-child(1)",
      );
    }
    if (options.hideMenuSection2) {
      cssRules.push(
        "yt-multi-page-menu-section-renderer.style-scope:nth-child(2)",
      );
    }
    if (options.hideMenuSection3) {
      cssRules.push(
        "yt-multi-page-menu-section-renderer.style-scope:nth-child(3) > div:nth-child(2) > ytd-compact-link-renderer:nth-child(1)",
      );
    }
    if (options.hideMenuSection5) {
      cssRules.push(
        "yt-multi-page-menu-section-renderer.style-scope:nth-child(5)",
      );
      cssRules.push(
        "yt-multi-page-menu-section-renderer.style-scope:nth-child(5) > div:nth-child(2)",
      );
    }
    if (options.hideCompactLink1) {
      cssRules.push("#buttons > ytd-button-renderer:nth-child(1)");
    }

    if (mode === "study") {
      cssRules.push(
        "ytd-guide-collapsible-entry-renderer.style-scope:nth-child(7) > ytd-guide-entry-renderer:nth-child(1)",
      );
      cssRules.push(
        "ytd-guide-collapsible-entry-renderer.style-scope:nth-child(7) > div:nth-child(2) > ytd-guide-entry-renderer:nth-child(2)",
      );
      cssRules.push(
        "ytd-guide-entry-renderer.ytd-guide-collapsible-section-entry-renderer:nth-child(5)",
      );
    }

    if (options.limitRelatedVideos && mode === "focus") {
      cssRules.push("#related #dismissible:nth-child(n+4)");
    }

    var cssContent = "";
    if (cssRules.length > 0) {
      cssContent += cssRules.join(",") + " { display: none !important; }";
    }

    if (options.expandPrimary && mode === "study") {
      cssContent += "#primary-inner { margin-right: 0 !important; }";
      cssContent +=
        "#columns #primary { width: 100% !important; max-width: 100% !important; }";
      cssContent +=
        "ytd-guide-collapsible-entry-renderer.style-scope:nth-child(7) > div:nth-child(2) { display: block !important; }";
    }

    return cssContent;
  }

  function normal() {
    removeExistingStyle("youtubeFocusBrain");
    removeExistingStyle("youtubeFocusBrainStudy");
  }

  function brain(options) {
    removeExistingStyle("youtubeFocusBrainStudy");
    var cssContent = buildCSSFromOptions(options, "brain");
    createAndAppendStyle("youtubeFocusBrain", cssContent);
  }

  function focus(options) {
    removeExistingStyle("youtubeFocusBrainStudy");
    var cssContent = buildCSSFromOptions(options, "focus");
    createAndAppendStyle("youtubeFocusBrain", cssContent);

    /* ARCHIVE: var autoplay = document.getElementById('toggle');
       if (autoplay && autoplay.checked) {
         autoplay.checked = false;
       } */
  }

  function study(options) {
    removeExistingStyle("youtubeFocusBrain");
    var cssContent = buildCSSFromOptions(options, "study");
    createAndAppendStyle("youtubeFocusBrainStudy", cssContent);

    /* ARCHIVE: var autoplay = document.getElementById('toggle');
       if (autoplay && autoplay.checked) {
         autoplay.checked = false;
       } */
  }
})();
