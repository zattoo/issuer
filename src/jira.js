const JiraApi = require('jira-client');

/** @type {JiraApi} */
let jira;

/**
 * @param {string } username
 * @param {string} password
 * @param {string} host
 */
const init = (username, password, host) => {
    jira = new JiraApi({
        protocol: 'https',
        host,
        username,
        password,
        apiVersion: '3',
        strictSSL: true
    });
};

/**
 * @param {string[]} issueIds
 * @returns {string}
 */
const getVersion = async (issueIds) => {
    for (const issueId in issueIds) {
        const issue = await jira.getIssue(issueId);

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
