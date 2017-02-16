const locale = require('locale');
const path = require('path');

module.exports = function configMiddleware(options) {
  const supported = new locale.Locales(options.locales);

  return (req, res) => {
    const locales = new locale.Locales(req.headers["accept-language"]);
    const originalUrl = req.originalUrl;

    let selectedLocale = locales.best(supported);

    const urlParts = originalUrl.split('/');
    const matchPart = urlParts[1];

    if (matchPart) {
      if (options.locales.indexOf(matchPart) !== -1) {
        selectedLocale = matchPart
      }
    } else {
      return res.redirect(`${selectedLocale}${originalUrl}`);
    }

    return res.sendFile(path.join(`${options.root}/${selectedLocale}/index.html`));
  }
};
