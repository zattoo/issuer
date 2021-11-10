const core = require('@actions/core');
const {
  context,
  getOctokit,
} = require('@actions/github');

const utils = require('./utils');
const config = require('./config');

(async () => {
    const token = core.getInput('github_token', {required: true});
    const host = core.getInput('host', {required: true});
    const title = core.getInput('title', {required: false}) || config.TITLE_DEFAULT_VALUE;
    const verify = core.getInput('verify', {required: false}) || config.VERIFY_DEFAULT_VALUE;
    const ignoreLabel = core.getInput('ignore_label', {required: false}) || config.IGNORE_LABEL_DEFAULT_VALUE;
    const octokit = getOctokit(token);

    const {pull_request} = context.payload;
    const labels = context.payload.pull_request.labels.map((label) => label.name);

    if(labels.includes(ignoreLabel)) {
        core.info(`Ignore the action due to label '${ignoreLabel}'`);
        process.exit(0);
    }

    core.info('Analyzing PR title');

    if (verify) {
        core.info('Action will verify Pull-Request title');
    }

    const ticketsResponse = utils.getIssuerFromTitle(pull_request.title);

    if (!ticketsResponse.tickets && verify) {
        core.error(ticketsResponse.error);
    }

    const ticketsDescription = utils.createTicketsDescription(host, ticketsResponse.tickets, title);

    const updatedBody = utils.updateBody(pull_request.body, ticketsDescription);

    await octokit.rest.pulls.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pull_request.number,
        body: updatedBody,
    });

    core.info('Description updated successfully');
    })().catch((error) => {
    core.setFailed(error);
    process.exit(1);
});
