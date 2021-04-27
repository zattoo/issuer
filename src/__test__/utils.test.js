const utils = require('../utils');
const constants = require('../constants');

const host = 'https://atlassian.net/browse/';

describe(utils.getTicketsFromTitle.name, () => {
    it('returns tickets for a title with one ticket', () => {
        expect(utils.getTicketsFromTitle('WEB-2298: Amazon SSO'))
            .toEqual({tickets:['WEB-2298']});
    });

    it('returns tickets for a title with multiple tickets', () => {
        expect(utils.getTicketsFromTitle('WEB-2298, WEBTV-3388: Import the correct ZAPI'))
            .toEqual({tickets:['WEB-2298', 'WEBTV-3388']});
    });

    it('returns error for a title without ticket', () => {
        expect(utils.getTicketsFromTitle('Import the correct ZAPI'))
            .toEqual({error: constants.REFERENCE_ERROR});
    });

    it('returns error for a title with invalid format', () => {
        expect(utils.getTicketsFromTitle('WEBTV-3388 - Import the correct ZAPI'))
            .toEqual({error: constants.REFERENCE_ERROR});

        expect(utils.getTicketsFromTitle('Import the correct ZAPI / WEBTV-3388'))
            .toEqual({error: constants.REFERENCE_ERROR});

        expect(utils.getTicketsFromTitle('Import the correct ZAPI - WEBTV-3388'))
    });

    it('returns error for a title with invalid code format', () => {
        expect(utils.getTicketsFromTitle('webtv-338: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('WEB-XXX: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('WEB-1XX: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('111-111: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('111-WEV: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('WEB111: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('WEB:111: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('WEB_111: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('wEB_111: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});
    });

    it('returns error if one or more of multiple codes is are invalid', () => {
        expect(utils.getTicketsFromTitle('WEB-111, WEB-2X: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('WEB-111, WEB-2-: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});

        expect(utils.getTicketsFromTitle('WEB-X11, WEB-22-: Import the correct ZAPI'))
            .toEqual({error: constants.FORMAT_ERROR});
    });
});

describe(utils.stringifyTickets.name, () => {
    it('returns null when no tickets', () => {
        expect(utils.stringifyTickets(host, null))
            .toBe(null);
    });

    it('returns single ticket as a list', () => {
        const ticket = 'WEB-35';

        expect(utils.stringifyTickets(host, [ticket]))
            .toBe(`* ${host}${ticket}\n`);
    });

    it('returns multiple tickets as a list', () => {
        const ticket1 = 'WEB-35';
        const ticket2 = 'WEBTV-78';

        expect(utils.stringifyTickets(host, [ticket1, ticket2]))
            .toBe(`* ${host}${ticket1}\n* ${host}${ticket2}\n`);
    });
});

describe(utils.createTicketsDescription.name, () => {
    const title = '### Tickets';

    it('returns only meta when no tickets in title', () => {
        expect(utils.createTicketsDescription(host, null, title))
           .toBe(constants.TICKETS_BLOCK_START + constants.TICKETS_BLOCK_END);
    });

    it('returns description for one ticket', () => {
        const tickets = ['WEB-35'];
        const ticketsString = utils.stringifyTickets(host, tickets);

        expect(utils.createTicketsDescription(host, tickets, title))
            .toBe(`${constants.TICKETS_BLOCK_START}\n${title}\n${ticketsString}${constants.TICKETS_BLOCK_END}`);
    });

    it('returns description for multiple ticket', () => {
        const tickets = ['WEB-35', 'PO-328'];
        const ticketsString = utils.stringifyTickets(host, tickets);

        expect(utils.createTicketsDescription(host, tickets, title))
            .toBe(`${constants.TICKETS_BLOCK_START}\n${title}\n${ticketsString}${constants.TICKETS_BLOCK_END}`);
    });
});

describe(utils.hasTickets.name, () => {
   it('returns true if body contains only meta', () => {
       const body = `Hello this is a description\n in this PR we will do something ${constants.TICKETS_BLOCK_START}${constants.TICKETS_BLOCK_END}`;

       expect(utils.hasTickets(body)).toBe(true);
   });

    it('returns true if body contains tickets info', () => {
        const body = `Hello this is a description\n in this PR we will do something ${constants.TICKETS_BLOCK_START}### Title\n* some ticket here${constants.TICKETS_BLOCK_END}`;

        expect(utils.hasTickets(body)).toBe(true);
    });

    it('returns false if body does not  contain meta', () => {
        const body = `Hello this is a description\n in this PR we will do something\n ### Tickets\n * WEB-2434 DO SOMETHING \n`;

        expect(utils.hasTickets(body)).toBe(false);
    });
});

describe(utils.updateBody.name, () => {
    const body = 'According to the [agreed practice], we replace all string usages with constants.\n' +
        '\n' +
        'This PR is the changes in the `common` project.';

   it('update body with current description', () => {
       const prevTickets = ['WEB-2224'];
       const prevBody = body + utils.createTicketsDescription(host, prevTickets, constants.TITLE_DEFAULT_VALUE);

       const currentTickets = ['WEB-2224', 'WEB-2225'];
       const description = utils.createTicketsDescription(host, currentTickets, constants.TITLE_DEFAULT_VALUE);
       expect(utils.updateBody(prevBody, description)).toBe(body + description);
   });

   it('adds description if not exist on PR description', () => {
       const tickets = ['WEB-2224'];
       const description = utils.createTicketsDescription(host, tickets, constants.TITLE_DEFAULT_VALUE);

       expect(utils.updateBody(body, description)).toBe(body + constants.SPACE + description);
   });

    it('adds meta even if title doe not include ticket', () => {
        const description = utils.createTicketsDescription(host, null, constants.TITLE_DEFAULT_VALUE);

        expect(utils.updateBody(body, description)).toBe(body + constants.SPACE + description);
    });
});
