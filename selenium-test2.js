const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');

// Set up the webdriver
let driver = new Builder()
    .forBrowser('chrome')
    .build();

// Navigate to the dashboard
driver.get('https://su-cs308-22fa.github.io/Team30-FrontEnd/');

// Wait for the page to load
driver.wait(until.titleIs('Dashboard'), 1000);

// Click on the products tab
let productsTab = driver.findElement(By.id('prod-router'));
productsTab.click();

// Wait for the products page to load
driver.wait(until.titleIs('Products'), 1000);

// Click on the edit button for the first product
let editButton = driver.findElement(By.id('edit-button'));
editButton.click();

// Wait for the edit form to load
driver.wait(2000);

// Find the "isDiscounted" radio button and click on it
let radioButton = driver.findElement(By.id('isdisc'));
radioButton.click();