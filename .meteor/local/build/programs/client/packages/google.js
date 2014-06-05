//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var Random = Package.random.Random;
var Template = Package.templating.Template;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Google;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages\google\template.google_configure.js                                                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
                                                                                                                  // 1
Template.__define__("configureLoginServiceDialogForGoogle", (function() {                                         // 2
  var self = this;                                                                                                // 3
  var template = this;                                                                                            // 4
  return [ HTML.Raw("<p>\n    First, you'll need to get a Google Client ID. Follow these steps:\n  </p>\n  "), HTML.OL(HTML.Raw('\n    <li>\n      Visit <a href="https://code.google.com/apis/console/" target="blank">https://code.google.com/apis/console/</a>\n    </li>\n    <li>\n      If necessary, "Create Project"\n    </li>\n    <li>\n      Click "APIs &amp; auth" and "Credentials" on the left\n    </li>\n    <li>\n      Click the "Create New Client ID" button\n    </li>\n    <li>\n      Choose "Web application" as the type\n    </li>\n    '), HTML.LI("\n      Set Authorized Javascript Origins to: ", HTML.SPAN({
    "class": "url"                                                                                                // 6
  }, function() {                                                                                                 // 7
    return Spacebars.mustache(self.lookup("siteUrl"));                                                            // 8
  }), "\n    "), "\n    ", HTML.LI("\n      Set Authorized Redirect URI to: ", HTML.SPAN({                        // 9
    "class": "url"                                                                                                // 10
  }, function() {                                                                                                 // 11
    return Spacebars.mustache(self.lookup("siteUrl"));                                                            // 12
  }, "_oauth/google?close"), "\n    "), HTML.Raw('\n    <li>\n      Click "Create Client ID"\n    </li>\n  ')) ]; // 13
}));                                                                                                              // 14
                                                                                                                  // 15
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages\google\google_configure.js                                                                            //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Template.configureLoginServiceDialogForGoogle.siteUrl = function () {                                             // 1
  return Meteor.absoluteUrl();                                                                                    // 2
};                                                                                                                // 3
                                                                                                                  // 4
Template.configureLoginServiceDialogForGoogle.fields = function () {                                              // 5
  return [                                                                                                        // 6
    {property: 'clientId', label: 'Client ID'},                                                                   // 7
    {property: 'secret', label: 'Client secret'}                                                                  // 8
  ];                                                                                                              // 9
};                                                                                                                // 10
                                                                                                                  // 11
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages\google\google_client.js                                                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Google = {};                                                                                                      // 1
                                                                                                                  // 2
// Request Google credentials for the user                                                                        // 3
// @param options {optional}                                                                                      // 4
// @param credentialRequestCompleteCallback {Function} Callback function to call on                               // 5
//   completion. Takes one argument, credentialToken on success, or Error on                                      // 6
//   error.                                                                                                       // 7
Google.requestCredential = function (options, credentialRequestCompleteCallback) {                                // 8
  // support both (options, callback) and (callback).                                                             // 9
  if (!credentialRequestCompleteCallback && typeof options === 'function') {                                      // 10
    credentialRequestCompleteCallback = options;                                                                  // 11
    options = {};                                                                                                 // 12
  } else if (!options) {                                                                                          // 13
    options = {};                                                                                                 // 14
  }                                                                                                               // 15
                                                                                                                  // 16
  var config = ServiceConfiguration.configurations.findOne({service: 'google'});                                  // 17
  if (!config) {                                                                                                  // 18
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(                                       // 19
      new ServiceConfiguration.ConfigError());                                                                    // 20
    return;                                                                                                       // 21
  }                                                                                                               // 22
                                                                                                                  // 23
  var credentialToken = Random.secret();                                                                          // 24
                                                                                                                  // 25
  // always need this to get user id from google.                                                                 // 26
  var requiredScope = ['profile'];                                                                                // 27
  var scope = ['email'];                                                                                          // 28
  if (options.requestPermissions)                                                                                 // 29
    scope = options.requestPermissions;                                                                           // 30
  scope = _.union(scope, requiredScope);                                                                          // 31
  var flatScope = _.map(scope, encodeURIComponent).join('+');                                                     // 32
                                                                                                                  // 33
  // https://developers.google.com/accounts/docs/OAuth2WebServer#formingtheurl                                    // 34
  var accessType = options.requestOfflineToken ? 'offline' : 'online';                                            // 35
  var approvalPrompt = options.forceApprovalPrompt ? 'force' : 'auto';                                            // 36
                                                                                                                  // 37
  var loginUrl =                                                                                                  // 38
        'https://accounts.google.com/o/oauth2/auth' +                                                             // 39
        '?response_type=code' +                                                                                   // 40
        '&client_id=' + config.clientId +                                                                         // 41
        '&scope=' + flatScope +                                                                                   // 42
        '&redirect_uri=' + Meteor.absoluteUrl('_oauth/google?close') +                                            // 43
        '&state=' + credentialToken +                                                                             // 44
        '&access_type=' + accessType +                                                                            // 45
        '&approval_prompt=' + approvalPrompt;                                                                     // 46
                                                                                                                  // 47
  // Use Google's domain-specific login page if we want to restrict creation to                                   // 48
  // a particular email domain. (Don't use it if restrictCreationByEmailDomain                                    // 49
  // is a function.) Note that all this does is change Google's UI ---                                            // 50
  // accounts-base/accounts_server.js still checks server-side that the server                                    // 51
  // has the proper email address after the OAuth conversation.                                                   // 52
  if (typeof Accounts._options.restrictCreationByEmailDomain === 'string') {                                      // 53
    loginUrl += '&hd=' + encodeURIComponent(Accounts._options.restrictCreationByEmailDomain);                     // 54
  }                                                                                                               // 55
                                                                                                                  // 56
  OAuth.showPopup(                                                                                                // 57
    loginUrl,                                                                                                     // 58
    _.bind(credentialRequestCompleteCallback, null, credentialToken),                                             // 59
    { height: 406 }                                                                                               // 60
  );                                                                                                              // 61
};                                                                                                                // 62
                                                                                                                  // 63
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.google = {
  Google: Google
};

})();

//# sourceMappingURL=23c8e4cf603777abd8e1475a4b5a324d9bba08b2.map
