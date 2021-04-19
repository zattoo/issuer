# Issuer

GitHub Action for adding a link to issue on PR description from PR title

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

### `verify`

`boolean`

Optional. Default to `false`, indicates weather the action should validate the PR title

### `ignore_label`

`string`

Optional. Default to `-verify issuer`, if `validate` set to `true`, when label set, the action will skip verification

## Usage Example

````yaml
name: Issue tracking
jobs:
  issue-tracking:
    name: Issue tracking
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: zattoo/issuer@v1
        with:
          github_token: ${{github.token}}
          host: 'https://atlassian.net/browse/'
          title: '### Tickets'
          varify: true,
          ignore_label: '-verify'
````
