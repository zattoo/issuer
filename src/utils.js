const constants = require('./constants');

const blockRegex = new RegExp(`${constants.TICKETS_BLOCK_START}(.|\r\n|\n)*${constants.TICKETS_BLOCK_END}`);
const codeRegex = new RegExp(/^[A-Z]+-[0-9]+$/);

/**
 * @param {string} title
 * @returns {TicketsFromTitleResponse}
 */
const getIssuerFromTitle = (title) => {
    if (!title.includes(constants.SEPARATOR)) {
        return {error: constants.REFERENCE_ERROR};
    }

    const ticketsString = title.split(constants.SEPARATOR)[0];
    const tickets = ticketsString
        .replace(/,/g, '')
        .split(' ');

    if(!tickets) {
        return {error: constants.REFERENCE_ERROR};
    }

    if(tickets.every((ticket) => codeRegex.test(ticket))) {
        return {tickets};
    }

    return {error: constants.FORMAT_ERROR};
};

/**
 * @param {string} host
 * @param {string[]} tickets
 * @returns {string}
 */
const stringifyTickets = (host, tickets) => {
    if(!tickets) {
        return null;
    }

    return tickets.reduce((result, ticket) => {
        return result + `* ${host}${ticket}\n`;
    }, '');
};

/**
 *
 * @param {string} host
 * @param {string[]} tickets
 * @param {string} title
 * @returns {string}
 */
const createTicketsDescription = (host = '', tickets, title) => {
    const ticketsString = stringifyTickets(host, tickets);

    if (!ticketsString) {
        return constants.TICKETS_BLOCK_START + constants.TICKETS_BLOCK_END;
    }

    return `${constants.TICKETS_BLOCK_START}\n${title}\n${ticketsString}${constants.TICKETS_BLOCK_END}`;
};

/**
 * @param {string} prBody
 * @returns {boolean}
 */
const hasTickets = (prBody) => {
    return blockRegex.test(prBody);
};

/**
 * @param {string} currentBody
 * @param {string} ticketsDescription
 * @returns {string}
 */
const updateBody = (currentBody, ticketsDescription) => {
    const body = currentBody || '';

    if(hasTickets(body)) {
        return body.replace(blockRegex, ticketsDescription);
    }

    return body + constants.SPACE + ticketsDescription;
};

module.exports = {
    createTicketsDescription,
    hasTickets,
    getIssuerFromTitle,
    stringifyTickets,
    updateBody,
};

/**
 * @typedef {Object} TicketsFromTitleResponse
 * @prop {string[]} [tickets]
 * @prop {string} [error]
 */
