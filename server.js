
const express = require("express");
const app = express();
app.use("/govuk-frontend", express.static("node_modules/govuk-frontend/dist/govuk"));
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Apply for space travel - GOV.UK</title>
        <link rel="stylesheet" href="/govuk-frontend/govuk-frontend.min.css">
      </head>
      <body>
        <div class="govuk-width-container">
          <main class="govuk-main-wrapper" id="main-content">
            <h1 class="govuk-heading-xl">Apply for space travel</h1>
            <p class="govuk-body">Choose your destination and provide your details.</p>
            <a class="govuk-button" href="/destination">Start now</a>
          </main>
        </div>
      </body>
    </html>
  `);
});



app.get("/destination", (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Choose your destination - GOV.UK</title>
        <link rel="stylesheet" href="/govuk-frontend/govuk-frontend.min.css">
      </head>
      <body>
        <div class="govuk-width-container">
          <main class="govuk-main-wrapper" id="main-content">
            <a href="/" class="govuk-back-link">Back</a>

            <form action="/details" method="GET">
              <div class="govuk-form-group">
                <fieldset class="govuk-fieldset">
                  <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
                    <h1 class="govuk-fieldset__heading">
                      Where would you like to travel?
                    </h1>
                  </legend>

                  <div class="govuk-radios">
                    <div class="govuk-radios__item">
                      <input class="govuk-radios__input" id="moon" name="destination" type="radio" value="Moon" required>
                      <label class="govuk-label govuk-radios__label" for="moon">Moon</label>
                    </div>

                    <div class="govuk-radios__item">
                      <input class="govuk-radios__input" id="mars" name="destination" type="radio" value="Mars" required>
                      <label class="govuk-label govuk-radios__label" for="mars">Mars</label>
                    </div>
                  </div>
                </fieldset>
              </div>

              <button class="govuk-button" type="submit">Continue</button>
            </form>
          </main>
        </div>
      </body>
    </html>
  `);
});



app.get("/details", (req, res) => {
  const destination = req.query.destination;

  if (!["Moon", "Mars"].includes(destination)) {
    return res.redirect("/destination");
  }

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Enter your details - GOV.UK</title>
        <link rel="stylesheet" href="/govuk-frontend/govuk-frontend.min.css">
      </head>
      <body>
        <div class="govuk-width-container">
          <main class="govuk-main-wrapper" id="main-content">
            <a href="/destination" class="govuk-back-link">Back</a>

            <h1 class="govuk-heading-xl">Enter your details</h1>
            <p class="govuk-body">Destination: ${escapeHtml(destination)}</p>

            <form action="/summary" method="GET">
              <input type="hidden" name="destination" value="${escapeHtml(destination)}">

              <div class="govuk-form-group">
                <label class="govuk-label" for="name">Full name</label>
                <input class="govuk-input" id="name" name="name" type="text" autocomplete="name" required>
              </div>

              <div class="govuk-form-group">
                <label class="govuk-label" for="address">Address</label>
                <textarea class="govuk-textarea" id="address" name="address" rows="4" autocomplete="street-address" required></textarea>
              </div>

              <button class="govuk-button" type="submit">Continue</button>
            </form>
          </main>
        </div>
      </body>
    </html>
  `);
});



app.get("/summary", (req, res) => {
  const { destination, name, address } = req.query;

  if (!["Moon", "Mars"].includes(destination) ||
      typeof name !== "string" || !name.trim() ||
      typeof address !== "string" || !address.trim()) {
    return res.redirect("/destination");
  }

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Check your answers - GOV.UK</title>
        <link rel="stylesheet" href="/govuk-frontend/govuk-frontend.min.css">
      </head>
      <body>
        <div class="govuk-width-container">
          <main class="govuk-main-wrapper" id="main-content">
            <a href="/details?destination=${encodeURIComponent(destination)}" class="govuk-back-link">Back</a>

            <h1 class="govuk-heading-xl">Check your answers</h1>

            <dl class="govuk-summary-list">
              <div class="govuk-summary-list__row">
                <dt class="govuk-summary-list__key">Destination</dt>
                <dd class="govuk-summary-list__value">${escapeHtml(destination)}</dd>
                <dd class="govuk-summary-list__actions">
                  <a class="govuk-link" href="/destination">Change<span class="govuk-visually-hidden"> destination</span></a>
                </dd>
              </div>

              <div class="govuk-summary-list__row">
                <dt class="govuk-summary-list__key">Full name</dt>
                <dd class="govuk-summary-list__value">${escapeHtml(name)}</dd>
                <dd class="govuk-summary-list__actions">
                  <a class="govuk-link" href="/details?destination=${encodeURIComponent(destination)}">Change<span class="govuk-visually-hidden"> full name</span></a>
                </dd>
              </div>

              <div class="govuk-summary-list__row">
                <dt class="govuk-summary-list__key">Address</dt>
                <dd class="govuk-summary-list__value">${escapeHtml(address).replace(/\n/g, "<br>")}</dd>
                <dd class="govuk-summary-list__actions">
                  <a class="govuk-link" href="/details?destination=${encodeURIComponent(destination)}">Change<span class="govuk-visually-hidden"> address</span></a>
                </dd>
              </div>
            </dl>

            <a class="govuk-button" href="/confirmation" role="button">Submit application</a>
          </main>
        </div>
      </body>
    </html>
  `);
});

app.get("/confirmation", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Application submitted - Space travel service</title>
        <link rel="stylesheet" href="/govuk-frontend/govuk/all.css">
      </head>
      <body class="govuk-template__body">
        <div class="govuk-width-container">
          <main class="govuk-main-wrapper" id="main-content">
            <div class="govuk-panel govuk-panel--confirmation">
              <h1 class="govuk-panel__title">Application submitted</h1>
              <div class="govuk-panel__body">
                Your application has been submitted
              </div>
            </div>

            

            <a class="govuk-button" href="/">Return to start</a>
          </main>
        </div>
      </body>
    </html>
  `);
});



function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[char]);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
