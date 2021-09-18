const IGNORE_LABEL_DEFAULT_VALUE = '-issuer';
const SEPARATOR  = ':';
const SPACE = '\n\n';
const TITLE_DEFAULT_VALUE = '### Issuer';
const TICKETS_BLOCK_START = '<!-- tickets start -->';
const TICKETS_BLOCK_END = '<!-- tickets end -->';
const VERIFY_DEFAULT_VALUE = false;
const FORMAT_ERROR = 'Title format is invalid, expected pattern is CODE-XXX [, CODE-XXX]: Title';
const REFERENCE_ERROR = 'Issuer reference is missing. Expected pattern is CODE-XXX [, CODE-XXX]: Title';

module.exports = {
    IGNORE_LABEL_DEFAULT_VALUE,
    SPACE,
    SEPARATOR,
    TITLE_DEFAULT_VALUE,
    TICKETS_BLOCK_END,
    TICKETS_BLOCK_START,
    VERIFY_DEFAULT_VALUE,
    FORMAT_ERROR,
    REFERENCE_ERROR,
}
