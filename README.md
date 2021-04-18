# Ticket

GitHub Action for adding a link to ticket on PR description from PR title

## Inputs

### `github_token`

`string`

Required. GitHub Token from action context

### `host`

`string`

Required. Issue tracking host URL

### `title`

`string`

Optional. Default to `### Issuer`

## Usage Example

````yaml
name: Issue tracking
jobs:
  issue-tracking:
    name: Issue tracking
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: zattoo/ticket@v1
        with:
          github_token: ${{github.token}}
          host: 'https://atlassian.net/browse/'
          title: '### Tickets'
````
