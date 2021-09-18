const JiraApi = require('jira-client');

/** @type {JiraApi} */
let jira;

/**
 * @param {string }username
 * @param {string} password
 * @param {string} host
 */
const init = (username, password, host) => {
    jira = new JiraApi({
        protocol: 'https',
        host,
        username,
        password,
        apiVersion: '2',
        strictSSL: true
    });
};

/**
 * @param {string[]} issueIds
 * @returns {string}
 */
const getVersion = (issueIds) => {
    for (const issueId in issueIds) {
        const issue = jira.getIssue(issueId);

        if (
            issue &&
            issue.fields &&
            issue.fields.fixVersions &&
            Array.isArray(issue.fields.fixVersions) &&
            issue.fields.fixVersions[0].id
        ) {
            return issue.fields.fixVersions[0].id
        }
    }

    return undefined;
};

module.exports = {
    init,
    getVersion,
};