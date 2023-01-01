const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');
// Set up the webdriver
let driver = new Builder()
    .forBrowser('opera')
    .build();

// Navigate to the login page
driver.get('https://su-cs308-22fa.github.io/Team30-FrontEnd/login');

// Find the login form elements and enter the username and password
let usernameField = driver.findElement(By.id('username'));
usernameField.sendKeys('basaranozan@sabanciuniv.edu');

let passwordField = driver.findElement(By.id('password'));
passwordField.sendKeys('654321');

// Submit the form
let form = driver.findElement(By.tagName('form'));
form.submit();

// Wait for the page to load
driver.wait(until.titleIs('Dashboard'), 1000);

// Check if a JWT Token is present in the page
driver.executeScript("return window.localStorage.getItem('jwt');")
  .then((jwt) => {
    assert(jwt !== null, "JWT Token was not created");
  });

// Close the webdriver
driver.quit();