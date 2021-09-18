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
 * @returns {string[]}
 */
const getVersionsForIssuer = async (issueIds) => {
    const versions = await Promise.all(issueIds.map(async (issueId) => {
        const issue = await jira.getIssue(issueId);

        if (
            issue &&
            issue.fields &&
            issue.fields.fixVersions &&
            Array.isArray(issue.fields.fixVersions) &&
            issue.fields.fixVersions[0]
        ) {
            return issue.fields.fixVersions[0].name;
        }

        return undefined;
    }));

    return [...new Set(versions)].filter(Boolean);
};

module.exports = {
    init,
    getVersionsForIssuer,
};
