const utils = require('../utils');
const errors = require('../constants/errors');
const block = require('../constants/block');
const config = require('../config');

const host = 'https://atlassian.net/browse/';

describe(utils.getIssuerFromTitle.name, () => {
    it('returns tickets for a title with one ticket', () => {
        expect(utils.getIssuerFromTitle('WEB-2298: Amazon SSO'))
            .toEqual({tickets:['WEB-2298']});
    });

    it('returns tickets for a title with multiple tickets', () => {
        expect(utils.getIssuerFromTitle('WEB-2298, WEBTV-3388: Import the correct ZAPI'))
            .toEqual({tickets:['WEB-2298', 'WEBTV-3388']});
    });

    it('returns error for a title without ticket', () => {
        expect(utils.getIssuerFromTitle('Import the correct ZAPI'))
            .toEqual({error: errors.REFERENCE_ERROR});
    });

    it('returns error for a title with invalid format', () => {
        expect(utils.getIssuerFromTitle('WEBTV-3388 - Import the correct ZAPI'))
            .toEqual({error: errors.REFERENCE_ERROR});

        expect(utils.getIssuerFromTitle('Import the correct ZAPI / WEBTV-3388'))
            .toEqual({error: errors.REFERENCE_ERROR});

        expect(utils.getIssuerFromTitle('Import the correct ZAPI - WEBTV-3388'))
    });

    it("returns error for a title with invalid code format", () => {
        let title = "webtv-338: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "WEB-XXX: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "WEB-1XX: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "111-111: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "111-WEV: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "WEB111: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "WEB:111: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "WEB_111: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "wEB_111: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });
    });

    it("returns error if one or more of multiple codes is are invalid", () => {
        let title = "WEB-111, WEB-2X: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "WEB-111, WEB-2-: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });

        title = "WEB-X11, WEB-22-: Import the correct ZAPI";
        expect(utils.getIssuerFromTitle(title)).toEqual({
            error: `${errors.FORMAT_ERROR}. Found: "${title}"`,
        });
    });

    it('returns error if no space after separator', () => {
        expect(utils.getIssuerFromTitle('WEB-111:Import the correct ZAPI'))
            .toEqual({error: errors.SPACE_ERROR});
    });

    it('returns error if no upper case on title', () => {
        expect(utils.getIssuerFromTitle('WEB-111: import the correct ZAPI'))
            .toEqual({error: errors.UPPERCASE_ERROR});
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
           .toBe(block.TICKETS_BLOCK_START + block.TICKETS_BLOCK_END);
    });

    it('returns description for one ticket', () => {
        const tickets = ['WEB-35'];
        const ticketsString = utils.stringifyTickets(host, tickets);

        expect(utils.createTicketsDescription(host, tickets, title))
            .toBe(`\n\n${block.TICKETS_BLOCK_START}\n${title}\n${ticketsString}${block.TICKETS_BLOCK_END}\n\n`);
    });

    it('returns description for multiple ticket', () => {
        const tickets = ['WEB-35', 'PO-328'];
        const ticketsString = utils.stringifyTickets(host, tickets);

        expect(utils.createTicketsDescription(host, tickets, title))
            .toBe(`\n\n${block.TICKETS_BLOCK_START}\n${title}\n${ticketsString}${block.TICKETS_BLOCK_END}\n\n`);
    });
});

describe(utils.hasTickets.name, () => {
   it('returns true if body contains only meta', () => {
       const body = `Hello this is a description\n in this PR we will do something ${block.TICKETS_BLOCK_START}${block.TICKETS_BLOCK_END}`;

       expect(utils.hasTickets(body)).toBe(true);
   });

    it('returns true if body contains tickets info', () => {
        const body = `Hello this is a description\n in this PR we will do something ${block.TICKETS_BLOCK_START}### Title\n* some ticket here${block.TICKETS_BLOCK_END}`;

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
       const prevBody = body + utils.createTicketsDescription(host, prevTickets, config.TITLE_DEFAULT_VALUE);

       const currentTickets = ['WEB-2224', 'WEB-2225'];
       const description = utils.createTicketsDescription(host, currentTickets, config.TITLE_DEFAULT_VALUE);
       expect(utils.updateBody(prevBody, description)).toBe(body + description);
   });

   it('adds description if not exist on PR description', () => {
       const tickets = ['WEB-2224'];
       const description = utils.createTicketsDescription(host, tickets, config.TITLE_DEFAULT_VALUE);

       expect(utils.updateBody(body, description)).toBe(body + description);
   });

    it('adds meta even if title doe not include ticket', () => {
        const description = utils.createTicketsDescription(host, null, config.TITLE_DEFAULT_VALUE);

        expect(utils.updateBody(body, description)).toBe(body + description);
    });
});
