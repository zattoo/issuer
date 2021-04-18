const utils = require('../utils');

const host = 'https://atlassian.net/browse/';

describe(utils.getTicketsFromTitle.name, () => {
    it('returns tickets for a title with one ticket', () => {
        expect(utils.getTicketsFromTitle('WEB-2298: Amazon SSO'))
            .toEqual(['WEB-2298']);
    });

    it('returns tickets for a title with multiple tickets', () => {
        expect(utils.getTicketsFromTitle('WEB-2298, WEBTV-3388: Import the correct ZAPI'))
            .toEqual(['WEB-2298', 'WEBTV-3388']);
    });

    it('returns null for a title without ticket', () => {
        expect(utils.getTicketsFromTitle('Import the correct ZAPI'))
            .toEqual(null);
    });

    it('returns empty array for a title with incorrect format', () => {
        expect(utils.getTicketsFromTitle('WEBTV-3388 - Import the correct ZAPI'))
            .toBe(null);

        expect(utils.getTicketsFromTitle('Import the correct ZAPI / WEBTV-3388'))
            .toBe(null);

        expect(utils.getTicketsFromTitle('Import the correct ZAPI - WEBTV-3388'))
            .toBe(null);
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
       expect(utils.createTicketsDescription(host, 'Import the correct ZAPI', title))
           .toBe(utils.TICKETS_BLOCK_START + utils.TICKETS_BLOCK_END);
    });

    it('returns description for one ticket', () => {
        const prTitle = 'WEB-35: Import the correct ZAPI';
        const ticketsString = utils.stringifyTickets(host, utils.getTicketsFromTitle(prTitle));

        expect(utils.createTicketsDescription(host, prTitle, title))
            .toBe(`${utils.TICKETS_BLOCK_START}${title}\n\n${ticketsString}${utils.TICKETS_BLOCK_END}`);
    });

    it('returns description for multiple ticket', () => {
        const prTitle = 'WEB-35, PO-328S: Import the correct ZAPI';
        const ticketsString = utils.stringifyTickets(host, utils.getTicketsFromTitle(prTitle));

        expect(utils.createTicketsDescription(host, prTitle, title))
            .toBe(`${utils.TICKETS_BLOCK_START}${title}\n\n${ticketsString}${utils.TICKETS_BLOCK_END}`);
    });

    it('returns description with default Title', () => {
        const prTitle = 'WEB-35, PO-328S: Import the correct ZAPI';
        const ticketsString = utils.stringifyTickets(host, utils.getTicketsFromTitle(prTitle));

        expect(utils.createTicketsDescription(host, prTitle))
            .toBe(`${utils.TICKETS_BLOCK_START}${utils.TITLE}\n\n${ticketsString}${utils.TICKETS_BLOCK_END}`);
    });
});

describe(utils.hasTickets.name, () => {
   it('returns true if body contains only meta', () => {
       const body = `Hello this is a description\n in this PR we will do something ${utils.TICKETS_BLOCK_START}${utils.TICKETS_BLOCK_END}`;

       expect(utils.hasTickets(body)).toBe(true);
   });

    it('returns true if body contains tickets info', () => {
        const body = `Hello this is a description\n in this PR we will do something ${utils.TICKETS_BLOCK_START}### Title\n* some ticket here${utils.TICKETS_BLOCK_END}`;

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
       const prevTitle = 'WEB-2224: Replace string enums';
       const prevBody = body + utils.createTicketsDescription(host, prevTitle);

       const currentTitle = 'WEB-2224, WEB-2225: Replace string enums';
       const description = utils.createTicketsDescription(host, currentTitle);
       expect(utils.updateBody(prevBody, description)).toBe(body + description);
   });

   it('adds description if not exist on PR description', () => {
       const prTitle = 'WEB-2224: Replace string enums';
       const description = utils.createTicketsDescription(host, prTitle);

       expect(utils.updateBody(body, description)).toBe(body + description);
   });

    it('adds meta even if title doe not include ticket', () => {
        const prTitle = 'Replace string enums';
        const description = utils.createTicketsDescription(host, prTitle);

        expect(utils.updateBody(body, description)).toBe(body + description);
    });
});
