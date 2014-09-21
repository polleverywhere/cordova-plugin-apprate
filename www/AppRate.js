// Generated by CoffeeScript 1.8.0
var AppRate, channel, locales;

locales = require("./locales");

channel = require("cordova/channel");

AppRate = (function() {
  var getLocaleObject, navigateToAppStore, promptForRatingWindowButtonClickHandler, rate_reset, rate_stop, rate_try, thisObj;

  function AppRate() {}

  thisObj = AppRate;

  AppRate.preferences = {
    autoDetectLanguage: true,
    useLanguage: "en",
    displayAppName: "AppRate plugin",
    promptAtLaunch: true,
    promptAgainForEachNewVersion: true,
    daysUntilPrompt: 1,
    usesUntilPrompt: 3,
    appStoreAppURL: {
      ios: void 0,
      android: void 0,
      blackberry: void 0
    }
  };

  AppRate.rate_app = parseInt(window.localStorage.getItem("rate_app") || 1);

  AppRate.usesUntilPromptCounter = parseInt(window.localStorage.getItem("usesUntilPromptCounter") || 0);

  navigateToAppStore = function() {
    if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent.toLowerCase())) {
      return window.open(AppRate.preferences.appStoreAppURL.ios);
    } else if (/(Android)/i.test(navigator.userAgent.toLowerCase())) {
      return window.open(AppRate.preferences.appStoreAppURL.android, "_system");
    } else if (/(BlackBerry)/i.test(navigator.userAgent.toLowerCase())) {
      return window.open(AppRate.preferences.appStoreAppURL.blackberry);
    }
  };

  promptForRatingWindowButtonClickHandler = function(buttonIndex) {
    switch (buttonIndex) {
      case 3:
        rate_stop();
        return setTimeout(navigateToAppStore, 1000);
      case 2:
        return rate_reset();
      case 1:
        return rate_stop();
    }
  };

  rate_stop = function() {
    window.localStorage.setItem("rate_app", 0);
    return window.localStorage.removeItem("usesUntilPromptCounter");
  };

  rate_reset = function() {
    return window.localStorage.setItem("usesUntilPromptCounter", 0);
  };

  rate_try = function() {
    var localeObj;
    localeObj = getLocaleObject();
    if (thisObj.usesUntilPromptCounter === AppRate.preferences.usesUntilPrompt && thisObj.rate_app !== 0) {
      return navigator.notification.confirm(localeObj.message, promptForRatingWindowButtonClickHandler, localeObj.title, localeObj.buttonLabels);
    } else if (thisObj.usesUntilPromptCounter < AppRate.preferences.usesUntilPrompt) {
      thisObj.usesUntilPromptCounter++;
      return window.localStorage.setItem("usesUntilPromptCounter", thisObj.usesUntilPromptCounter);
    }
  };

  getLocaleObject = function() {
    var displayAppName, key, localeObj, value;
    localeObj = AppRate.preferences.customLocale || locales[AppRate.preferences.useLanguage] || locales["en"];
    displayAppName = localeObj.displayAppName || AppRate.preferences.displayAppName;
    for (key in localeObj) {
      value = localeObj[key];
      if (typeof value === 'string' || value instanceof String) {
        localeObj[key] = value.replace(/%@/g, displayAppName);
      }
    }
    return localeObj;
  };

  AppRate.prototype.setup = function(prefs) {
    if (prefs.useLanguage !== void 0) {
      AppRate.preferences.autoDetectLanguage = false;
      AppRate.preferences.useLanguage = prefs.useLanguage;
    }
    if (prefs.customLocale !== void 0) {
      AppRate.preferences.customLocale = prefs.customLocale;
    }
    if (prefs.usesUntilPrompt !== void 0) {
      AppRate.preferences.usesUntilPrompt = prefs.usesUntilPrompt;
    }
    if (prefs.displayAppName !== void 0) {
      AppRate.preferences.displayAppName = prefs.displayAppName;
    }
    if (prefs.appStoreAppURL) {
      if (prefs.appStoreAppURL.ios !== void 0) {
        AppRate.preferences.appStoreAppURL.ios = prefs.appStoreAppURL.ios;
      }
      if (prefs.appStoreAppURL.android !== void 0) {
        AppRate.preferences.appStoreAppURL.android = prefs.appStoreAppURL.android;
      }
      if (prefs.appStoreAppURL.blackberry !== void 0) {
        return AppRate.preferences.appStoreAppURL.blackberry = prefs.appStoreAppURL.blackberry;
      }
    }
  };

  AppRate.prototype.promptForRating = function() {
    if (navigator.notification && navigator.globalization) {
      if (AppRate.preferences.autoDetectLanguage) {
        return navigator.globalization.getPreferredLanguage(function(language) {
          AppRate.preferences.useLanguage = language.value.split(/_/)[0];
          return rate_try();
        }, function() {
          return rate_try();
        });
      } else {
        return rate_try();
      }
    }
  };

  return AppRate;

})();

module.exports = new AppRate(this);
