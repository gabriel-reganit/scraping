// 1) Import the sheet.js file and the puppeteer module
const Sheet = require("./sheet")
const puppeteer = require("puppeteer")

;(async () => {
  // 3) Create a new instance of the Sheet class and pass in the google spreadsheet ID
  const sheet = new Sheet("1hNIN52aP3sbSvP33ksAjdPn78ZBqrAH45b-BWKCUPYk")
  await sheet.load()

  // 4) Create a new instance of the puppeteer browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  const page = await browser.newPage()

  let urls = "https://entrepreneuriat.com/members/?page_88532="

  let cardHrefs = []

  for (let i = 3; i < 19; i++) {
    await page.goto(urls + i, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(3000)

    // 6) Get the "cards" from the page
    let cards = await page.$$(".um-member")

    for (var j = 0; j < cards.length; j++) {
      let cardHref = await cards[j].$eval("a", (a) => a.getAttribute("href"))
      cardHrefs.push(cardHref)
    }
  }

  console.log(cardHrefs.length)

  let profEmails = []

  for (var k = 0; k < cardHrefs.length; k++) {
    await page.goto(cardHrefs[k], { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(3000)

    let email = await page.$eval(".um-field-user_email a", (a) =>
      a.getAttribute("href")
    )
    email = email.replace("mailto:", "")
    // profEmails.push(email.replace("mailto:", ""))

    let firstName = await page.$eval(
      ".um-field-first_name .um-field-value",
      (text) => text.textContent
    )
    let lastName = await page.$eval(
      ".um-field-last_name .um-field-value",
      (text) => text.textContent
    )

    sheet.addRows([{ firstName, lastName, email }])
  }
})()
