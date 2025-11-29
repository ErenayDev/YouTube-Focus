// biome-ignore-all lint/suspicious/noRedundantUseStrict: Support for legacy browsers
// biome-ignore-all lint/complexity/useArrowFunction: Support for legacy browsers
// biome-ignore-all lint/complexity/useOptionalChain: Support for legacy browsers

(function () {
  "use strict";

  var chromeStorage = chrome && chrome.storage && chrome.storage.local;

  var defaultOptions = {
    hideHome: true,
    hideTrending: true,
    hideWhatToWatch: true,
    hideEndscreen: true,
    hideFooter: true,
    hideRelatedContents: true,
    hideRelatedUpnext: true,
    hideRelatedItems: true,
    hideCompactVideo: true,
    hideCompactPlaylist: true,
    hideCompactRadio: true,
    hideWatchSidebar: true,
    hideSecondaryResults: true,
    hideGuideButton: true,
    hideVoiceSearch: true,
    hideNotifications: true,
    hideAvatarButton: true,
    hideGuideSection2: true,
    hideGuideSection4: true,
    hideGuideSection5: true,
    hideGuideSection6: true,
    hideGuideEntry2: true,
    hideMenuSection1: true,
    hideMenuSection2: true,
    hideMenuSection3: true,
    hideMenuSection5: true,
    hideCompactLink1: true,
    expandPrimary: true,
    limitRelatedVideos: true,
  };

  function initializeExtension() {
    if (!chromeStorage) return;

    chromeStorage.get(["chosenMode", "customOptions"], function (result) {
      var chosenMode = result.chosenMode || "default";
      var customOptions = result.customOptions || defaultOptions;

      var modeButtons = document.querySelectorAll(".mode");

      for (var i = 0; i < modeButtons.length; i++) {
        var button = modeButtons[i];
        var className = "mode-" + chosenMode;

        if (hasClass(button, className)) {
          addClass(button, "active");
          break;
        }
      }

      var activeButton = document.querySelector(".mode.active");
      if (activeButton) {
        var buttonText = getTextContent(activeButton);
        setTextContent(activeButton, ">" + buttonText + "<");
      }

      loadOptionsToUI(customOptions);
    });
  }

  function loadOptionsToUI(options) {
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var checkbox = document.getElementById(key);
        if (checkbox) {
          checkbox.checked = options[key];
        }
      }
    }
  }

  function getOptionsFromUI() {
    var options = {};
    for (var key in defaultOptions) {
      if (defaultOptions.hasOwnProperty(key)) {
        var checkbox = document.getElementById(key);
        if (checkbox) {
          options[key] = checkbox.checked;
        }
      }
    }
    return options;
  }

  function handleModeClick(event) {
    var target = event.target || event.srcElement;

    if (!hasClass(target, "mode")) {
      return;
    }

    var chosenMode = "default";

    if (hasClass(target, "mode-brain")) {
      chosenMode = "brain";
    } else if (hasClass(target, "mode-focus")) {
      chosenMode = "focus";
    } else if (hasClass(target, "mode-study")) {
      chosenMode = "study";
    }

    var parentNode = target.parentNode;
    var activeButton = parentNode.querySelector(".active");

    if (activeButton) {
      removeClass(activeButton, "active");
      var activeText = getTextContent(activeButton);
      setTextContent(
        activeButton,
        activeText.substring(1, activeText.length - 1),
      );
    }

    addClass(target, "active");
    var targetText = getTextContent(target);
    setTextContent(target, ">" + targetText + "<");

    if (chromeStorage) {
      chromeStorage.set({
        chosenMode: chosenMode,
      });
    }
  }

  function handleOptionsToggle() {
    var optionsContent = document.getElementById("optionsContent");
    if (hasClass(optionsContent, "show")) {
      removeClass(optionsContent, "show");
    } else {
      addClass(optionsContent, "show");
    }
  }

  function handleResetOptions() {
    loadOptionsToUI(defaultOptions);
    if (chromeStorage) {
      chromeStorage.set({
        customOptions: defaultOptions,
      });
    }
  }

  function handleApplyOptions() {
    var options = getOptionsFromUI();
    if (chromeStorage) {
      chromeStorage.set({
        customOptions: options,
      });
    }
  }

  function hasClass(element, className) {
    if (element.classList) {
      return element.classList.contains(className);
    }
    return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
  }

  function addClass(element, className) {
    if (element.classList) {
      element.classList.add(className);
    } else if (!hasClass(element, className)) {
      element.className += " " + className;
    }
  }

  function removeClass(element, className) {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi",
        ),
        " ",
      );
    }
  }

  function getTextContent(element) {
    return element.textContent || element.innerText || "";
  }

  function setTextContent(element, text) {
    if (element.textContent !== undefined) {
      element.textContent = text;
    } else {
      element.innerText = text;
    }
  }

  function setupEventListeners() {
    var toggleButton = document.getElementById("toggleOptions");
    var resetButton = document.getElementById("resetOptions");
    var applyButton = document.getElementById("applyOptions");

    if (toggleButton) {
      if (toggleButton.addEventListener) {
        toggleButton.addEventListener("click", handleOptionsToggle);
      } else if (toggleButton.attachEvent) {
        toggleButton.attachEvent("onclick", handleOptionsToggle);
      }
    }

    if (resetButton) {
      if (resetButton.addEventListener) {
        resetButton.addEventListener("click", handleResetOptions);
      } else if (resetButton.attachEvent) {
        resetButton.attachEvent("onclick", handleResetOptions);
      }
    }

    if (applyButton) {
      if (applyButton.addEventListener) {
        applyButton.addEventListener("click", handleApplyOptions);
      } else if (applyButton.attachEvent) {
        applyButton.attachEvent("onclick", handleApplyOptions);
      }
    }

    if (document.addEventListener) {
      document.addEventListener("click", handleModeClick);
    } else if (document.attachEvent) {
      document.attachEvent("onclick", handleModeClick);
    }
  }

  if (document.readyState === "loading") {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", function () {
        initializeExtension();
        setupEventListeners();
      });
    } else if (document.attachEvent) {
      document.attachEvent("onreadystatechange", function () {
        if (document.readyState === "complete") {
          initializeExtension();
          setupEventListeners();
        }
      });
    }
  } else {
    initializeExtension();
    setupEventListeners();
  }
})();
