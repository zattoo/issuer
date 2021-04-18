const SEPARATOR  = ':';
const TITLE = '### Issuer';
const TICKETS_BLOCK_START = '<!-- tickets start -->';
const TICKETS_BLOCK_END = '<!-- tickets end -->';
const SPACE = '\n\n';

const regex = new RegExp(`${TICKETS_BLOCK_START}(.|\r\n|\n)*${TICKETS_BLOCK_END}`);

/**
 * @param {string} title
 * @returns {string[]}
 */
const getTicketsFromTitle = (title) => {
    if (!title.includes(SEPARATOR)) {
        return null;
    }

    const ticketsString = title.split(SEPARATOR)[0];
    return ticketsString
        .replace(/\s/g, '')
        .split(',');
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
 * @param {string} prTitle
 * @param {string} [title]
 * @returns {string}
 */
const createTicketsDescription = (host = '', prTitle, title = TITLE) => {
    const ticketsString = stringifyTickets(host, getTicketsFromTitle(prTitle));

    if (!ticketsString) {
        return TICKETS_BLOCK_START + TICKETS_BLOCK_END;
    }

    return `${TICKETS_BLOCK_START}\n${title}${SPACE}${ticketsString}${TICKETS_BLOCK_END}`;
};

/**
 *
 * @param {string} currentBody
 * @param {string} ticketsDescription
 * @returns {string}
 */
const updateBody = (currentBody, ticketsDescription) => {
    if(hasTickets(currentBody)) {
        return currentBody.replace(regex, ticketsDescription);
    }

    return currentBody + SPACE + ticketsDescription;
};

/**
 * @param {string} prBody
 * @returns {boolean}
 */
const hasTickets = (prBody) => {
    return regex.test(prBody);
};



module.exports = {
    createTicketsDescription,
    hasTickets,
    getTicketsFromTitle,
    stringifyTickets,
    updateBody,
    TICKETS_BLOCK_END,
    TICKETS_BLOCK_START,
    TITLE,
    SPACE,
};
