const core = require('@actions/core');
const {
  context,
  getOctokit,
} = require('@actions/github');

const utils = require('./utils');

const run = async () => {
  const token = core.getInput('github_token', {required: true});
  const host = core.getInput('host', {required: true});
  const title = core.getInput('title', {required: false});

  core.info('Analyzing PR title');

  const octokit = getOctokit(token);
  const {pull_request} = context.payload;

  const ticketsDescription = utils.createTicketsDescription(host, pull_request.title, title);
  core.info(String(utils.hasTickets(pull_request.body)));
  const updatedBody = utils.updateBody(pull_request.body, ticketsDescription);

  await octokit.pulls.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pull_request.number,
    body: updatedBody,
  });

  core.info('Description updated successfully');
};

run();
