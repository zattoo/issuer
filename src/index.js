const core = require('@actions/core');
const {
  context,
  getOctokit,
} = require('@actions/github');

const utils = require('./utils');
const constants = require('./constants');
const jiraService = require('./jira');

(async () => {
    const token = core.getInput('github_token', {required: true});
    const host = core.getInput('host', {required: true});
    const pathname = core.getInput('pathname', {required: true});
    const title = core.getInput('title', {required: false}) || constants.TITLE_DEFAULT_VALUE;
    const verify = core.getInput('verify', {required: false}) || constants.VERIFY_DEFAULT_VALUE;
    const ignoreLabel = core.getInput('ignore_label', {required: false}) || constants.IGNORE_LABEL_DEFAULT_VALUE;
    const milestone = core.getInput('milestone', {required: false});
    const jiraUsername = core.getInput('jira_username', {required: false});
    const jiraToken = core.getInput('jira_token', {required: false});

    const octokit = getOctokit(token);

    const {pull_request} = context.payload;
    const labels = context.payload.pull_request.labels.map((label) => label.name);

    if (labels.includes(ignoreLabel)) {
        core.info(`Ignore the action due to label '${ignoreLabel}'`);
        process.exit(0);
    }

    core.info('Analyzing pull-request title');

    if (verify) {
        core.info('Action will verify pull-request title');
    }

    const ticketsResponse = utils.getIssuerFromTitle(pull_request.title);

    if (!ticketsResponse.tickets && verify) {
        throw new Error(ticketsResponse.error);
    }

    const ticketsDescription = utils.createTicketsDescription(`${host}${pathname}`, ticketsResponse.tickets, title);

    const updatedBody = utils.updateBody(pull_request.body, ticketsDescription);

    await octokit.rest.pulls.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pull_request.number,
        body: updatedBody,
    });

    core.info('Description updated successfully');

    if (!milestone) {
        return;
    }

    if (pull_request.milestone) {
        console.log('Milestone already exists, exiting');
        return;
    }

    if (!(jiraUsername && jiraToken)) {
        throw new Error('milestone option is enabled but no valid cardinals as been given')
    }

    jiraService.init(jiraUsername, jiraToken, host);

    const versions = await jiraService.getVersionsForIssuer(ticketsResponse.tickets);

    if (!versions) {
        console.log('Couldn\'t find version related to issues');
        return;
    }

    const milestones = await octokit.rest.issues.listMilestones({
        owner: context.repo.owner,
        repo: context.repo.repo,
    });

    const milestonePayload = milestones.data.find(({title}) => {
        return versions.includes(title);
    }) || {};

    if (!milestonePayload.number) {
        console.log(`Couldn't find milestone with the title ${milestonePayload.title}`);
        return;
    }

    await octokit.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pull_request.number,
        milestone: milestonePayload.number,
    });

    console.log(`Added ${milestonePayload.title} as milestone`);
})().catch((error) => {
    core.setFailed(error);
    process.exit(1);
});
