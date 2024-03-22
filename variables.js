const { faq } = require('./faq');

module.exports.state = {
    sites: faq.sites,
    categoriesChina: faq.sites.china.categories,
    categoriesBankrot: faq.sites.bankrot.categories,
    categoriesRealty: faq.sites.realty.categories,
}