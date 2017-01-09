/**
 * This is the test entry point.
 * It collects and injects all specs and templates into the test runtime.
 */

var req = require.context('.', true, /(spec\.js)|(\.html)$/);

require('angular-mocks'); //load angular mocks into the test suite

//load all the specs into the test suite
req.keys().forEach((key) => {
    req(key);
});
