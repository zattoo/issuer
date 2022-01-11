const errors = require('./constants/errors');
const block = require('./constants/block');
const config = require('./config');

const blockRegex = new RegExp(`(\\n)*(\s)*${block.TICKETS_BLOCK_START}(.|\r\n|\n)*${block.TICKETS_BLOCK_END}(s)*(\\n)*`);
const codeRegex = new RegExp(/^[A-Z]+-[0-9]+$/);

/**
 * @param {string} title
 * @returns {TicketsFromTitleResponse}
 */
const getIssuerFromTitle = (title) => {
    if (!title.includes(config.SEPARATOR)) {
        return {error: errors.REFERENCE_ERROR};
    }

    const [ticketsString, titleString] = title.split(config.SEPARATOR);
    const tickets = ticketsString
        .replace(/,/g, '')
        .split(' ');


    if(!tickets) {
        return {error: errors.REFERENCE_ERROR};
    }

    if(tickets.some((ticket) => !codeRegex.test(ticket))) {
        return {error: errors.FORMAT_ERROR};
    }

    if(titleString[0] !== ' ') {
        return {error: errors.SPACE_ERROR};
    }

    if(titleString[1] !== titleString[1].toUpperCase()) {
        return {error: errors.UPPERCASE_ERROR};
    }

    return {tickets};
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
        return block.TICKETS_BLOCK_START + block.TICKETS_BLOCK_END;
    }

    return `${block.TICKETS_BLOCK_START}\n${title}\n${ticketsString}${block.TICKETS_BLOCK_END}`;
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

    return body + block.SPACE + ticketsDescription;
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
