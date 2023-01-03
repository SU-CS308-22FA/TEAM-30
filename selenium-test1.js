var webdriver = require('selenium-webdriver'),
        By = webdriver.By, until = webdriver.until;
        var webdriver = require('selenium-webdriver');

var chrome = require('selenium-webdriver/chrome');

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

// Navigate to the login page
driver.get('https://su-cs308-22fa.github.io/Team30-FrontEnd/login');



// Close the webdriver
driver.quit();