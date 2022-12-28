const Sheet = require("./sheet")
const puppeteer = require("puppeteer")

;(async () => {
  const sheet = new Sheet("1G58DXLE-qMLWCl2PmD8hAbUTUiOVHUboTGCd-p7dAQY")
  await sheet.load()

  const urls = ["https://smp.uq.edu.au/staff-directory"]

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  const page = await browser.newPage()

  for (let i = 0; i < urls.length; i++) {
    let url = urls[i]
    await page.goto(url, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(3000)

    let cards = await page.$$("tr[class='staff-directory__views-table']")

    let subURLs = []

    let records = []

    for (let j = 0; j < cards.length; j++) {
      // let endpoint = await cards[j].$eval("a", (a) => a.getAttribute("href"))
      // subURLs.push(
      //   `https://profiles.uts.edu.au/${endpoint.replace("/staff/", "")}`
      // )
      let title
      let name
      let department
      let email
      try {
        title = await cards[j].$eval(".position__title", (el) => el.textContent)
      } catch (e) {
        title = "N/A"
      }
      try {
        name = await cards[j].$eval("strong a", (el) => el.textContent)
      } catch (e) {
        name = "N/A"
      }
      try {
        department = await cards[j].$eval(
          ".position__organisation",
          (el) => el.textContent
        )
      } catch (e) {
        department = "N/A"
      }
      try {
        email = await cards[j].$eval(
          ".staff-directory__contact-details div a",
          (el) => el.textContent
        )
      } catch (e) {
        email = "N/A"
      }
      console.log(`${title} ${name} ${department} ${email}`)
      records.push({ title, name, department, email })
    }

    console.log(records.length)

    // let records = []

    // for (let k = 0; k < subURLs.length; k++) {
    //   await page.goto(subURLs[k])
    //   await page.waitForTimeout(2000)

    //   try {
    //     let name = await page.$eval("h1", (el) => el.textContent)
    //     name = name.replace(" page", "")
    //     name = name.replace("Profile", "")
    //     let position = await page.$eval(
    //       "ul[aria-label='Positions']",
    //       (el) => el.innerText
    //     )
    //     let title = position.split("\n")[0]
    //     let department = position.split("\n")[1]
    //     let email = await page.$eval(
    //       "a[href^='mailto:']",
    //       (el) => el.textContent
    //     )
    //     let status = await page.$eval(
    //       "p[class='hero__title___FgeET']",
    //       (el) => el.textContent
    //     )
    //     console.log(status)
    //     console.log(name)
    //     console.log(title)
    //     console.log(department)
    //     console.log(email)
    //     records.push({ status, name, title, department, email })
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }

    // let staff = []

    // let cards = await page.$$("tr")
    // for (let j = 0; j < cards.length; j++) {
    //   let cardObj = { name: "", email: "", title: "", department: "" }
    //   let data = await cards[j].$$eval("td", (td) => td.map((i) => i.innerText))
    //   cardObj.name = data[0]
    //   cardObj.title = data[1]
    //   cardObj.department = data[2]

    //   var emailSrc = await cards[j].$$eval("a", (a) => a.map((i) => i.href))
    //   cardObj.email = emailSrc[3]
    //   staff.push(cardObj)
    // }

    // let links = await page.$$eval("tr a", (el) => el.map((a) => a.href))

    // for (let j = 0; j < links.length; j++) {
    //   try {
    //     await page.goto(links[j], { waitUntil: "domcontentloaded" })
    //     await page.waitForTimeout(2000)
    //     let info = await page.$$eval(
    //       ".portfolio-informations .item-information",
    //       (el) => el.map((item) => item.innerText)
    //     )
    //     info = info.map((item) => {
    //       item = item.split(" ")
    //       let keyName = item.shift()
    //       let obj = {}
    //       obj[keyName] = item.join(" ")
    //       return obj
    //     })

    //     staff.push(info.reduce((r, c) => Object.assign(r, c), {}))
    //   } catch (e) {}
    // }

    // let cards = await page.$$(".custom-card .card-right")
    // for (let j = 0; j < cards.length; j++) {
    //   let cardObj = { name: "", email: "", phone: "", faculty: "" }
    //   cardObj.name = await cards[j].$eval(
    //     ".card-title a",
    //     (el) => el.textContent
    //   )
    //   cardObj.name = cardObj.name.split("\n")
    //   cardObj.name = `${cardObj.name[1].trim()} ${cardObj.name[2].trim()}`

    //   let content = await cards[j].$$eval(".card-content .set .field", (els) =>
    //     els.map((el) => el.textContent)
    //   )

    //   cardObj.email = content[0].trim()
    //   cardObj.phone = content[1].trim()
    //   cardObj.faculty = content[2].trim()

    //   staff.push(cardObj)
    // }

    // let lastPage = false

    // while (lastPage !== true) {
    //   await page.waitForTimeout(2000)
    //   let rows = await page.$$eval("tbody[role='alert'] tr .span8", (data) => {
    //     return data.map((d) => d.innerText.split("\n").slice(0, 6))
    //   })

    //   rows.forEach((row) =>
    //     staff.push({
    //       name: row[0],
    //       title: row[1],
    //       faculty: row[2],
    //       department: row[3],
    //       phone: row[4].trim(),
    //       email: row[5].trim(),
    //     })
    //   )

    //   let pageStatus = await page.$eval("#sample_3_info", (el) => el.innerText)
    //   pageStatus = pageStatus.split(" ")

    //   if (pageStatus[3] === pageStatus[5]) {
    //     lastPage = true
    //   } else {
    //     await page.$eval("li[class='next'] a", (a) => a.click())
    //   }
    // }

    // console.log(staff[1])

    sheet.addRows(records)
  }
})()
