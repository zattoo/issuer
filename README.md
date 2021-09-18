# Issuer

GitHub Action for adding a link to issue on pull-request description from pull-request title

## Inputs

### `github_token`

`string`

Required. GitHub Token from action context

### `host`

`string`

Required. Issue tracking host URL

### `pathname'

`string`

Required. pathname to issuer

### `title`

`string`

Optional. Default to `### Issuer`

### `verify`

`boolean`

Optional. Default to `false`, indicates weather the action should validate the PR title

### `ignore_label`

`string`

Optional. Default to `-issuer`, if `validate` set to `true`, when label set, the action will skip verification

### `milestone`

`boolean`

Optional. Default to `false`, Indicates if milestone should be added if available from issue

### `jira_username`

`string`

Required if `milestone` is enabled. Jira username for authentication

### `jira_token`

`string`

Required if `milestone` is enabled. Jira token for authentication

## Verifier

The Action can also verify the Pull-request title:
- It will check that the Title includes an issue
- It will check that the structure of the title follow a proper format `CODE-XXX [, CODE-XXX]: Title`
- It can be skipped by using the `-issuer`

## Milestones

The Action can add milestones to the PR automatically (currently supports only Jira)
- Milestone have to be registered before
- Milestone name is the same as the `fix version` attached to one of the issues

## Usage Example

````yaml
name: Issue tracking
jobs:
  issue-tracking:
    name: Issue tracking
    runs-on: ubuntu-latest
    steps:
      - uses: zattoo/issuer@v1
        with:
          github_token: ${{github.token}}
          host: 'company.atlassian.net'
          pathname: '/browse'
          title: '### Tickets'
          verify: true,
          ignore_label: '-verify'
          milestone: true
          jira_username: 'you@your-company.com'
          jira_token: 'abcdefghij1234567890'
````
