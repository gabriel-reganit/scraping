// 1) Import the sheet.js file and the puppeteer module
const Sheet = require("./sheet")
const puppeteer = require("puppeteer")

// 2) Create a self-executing anonymous function
;(async () => {
  // 3) Create a new instance of the Sheet class and pass in the google spreadsheet ID
  const sheet = new Sheet("185YvDAlPZkwd7oOqgZ55HkIadPy5LvWxcUYqxW6bw-I")
  await sheet.load()

  // 4) Create a new instance of the puppeteer browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  const page = await browser.newPage()

  // 5) Navigate to the URL/s
  let urls = [
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/phy",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/mme",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/hss",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/bt",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/me",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/sm",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/ee",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/cse",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/ce",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/cy",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/ece",
    "https://wsdc.nitw.ac.in/facultynew/dept/faculty_profiles/che",
  ]

  for (let i = 0; i < urls.length; i++) {
    let url = urls[i]
    await page.goto(url, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(3000)

    // 6) Get the "cards" from the page
    let cards = await page.$$("div.cardm")

    console.log(cards.length)
    let records = []

    for (var j = 0; j < cards.length; j++) {
      let anchors = await cards[j].$$("a")
      let name = await anchors[0].$eval("strong", (el) => el.textContent)
      let email = await anchors[1].evaluate((el) => el.textContent)
      records.push({ url, name, email })
    }
    sheet.addRows(records, "749557757")

    // for (var j = 0; j < cards.length; j++) {
    //   let cardHref = await cards[j].$eval("a", (a) => a.getAttribute("href"))
    //   cardHrefs.push(
    //     `https://profiles.uts.edu.au${cardHref.replace("/staff", "")}`
    //   )
    // }
    // for (var k = 0; k < cardHrefs.length; k++) {
    //   await page.goto(cardHrefs[k], { waitUntil: "domcontentloaded" })
    //   await page.waitForTimeout(3000)

    //   let title
    //   let name
    //   let position
    //   let email

    //   try {
    //     title = await page.$eval(".hero__title___FgeET", (el) => el.textContent)
    //     title = title.replace(" page", "")
    //   } catch (error) {
    //     console.log(error)
    //   }

    //   try {
    //     name = await page.$eval(".hero__header___kPVlB", (el) => el.textContent)
    //   } catch (error) {
    //     console.log(error)
    //   }

    //   // try {
    //   //   position = await page.$eval(
    //   //     ".iconAndContentRow__content___3tAOW iconAndContentRow__leftMargin___6h4zu iconAndContentRow__topMargin___332BV",
    //   //     (el) => el.textContent
    //   //   )
    //   // } catch (error) {
    //   //   console.log(error)
    //   // }

    //   try {
    //     email = await page.$eval(
    //       ".oneLineText__oneLineText___2ob06",
    //       (el) => el.textContent
    //     )
    //   } catch (error) {
    //     console.log(error)
    //   }

    //   sheet.addRows([{ title, name, email }])
    // }
  }
})()
