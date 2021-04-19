const IGNORE_LABEL_DEFAULT_VALUE = '-verify issuer';
const SEPARATOR  = ':';
const SPACE = '\n\n';
const TITLE_DEFAULT_VALUE = '### Issuer';
const TICKETS_BLOCK_START = '<!-- tickets start -->';
const TICKETS_BLOCK_END = '<!-- tickets end -->';
const VERIFY_DEFAULT_VALUE = false;
const SEPARATOR_ERROR = 'Separator is missing, structure is invalid, CODE-XXX [, CODE-XXX]: Title';
const CODE_ERROR = 'One or more tickets code are invalid, CODE-XXX [, CODE-XXX]: Title';

module.exports = {
    IGNORE_LABEL_DEFAULT_VALUE,
    SPACE,
    SEPARATOR,
    TITLE_DEFAULT_VALUE,
    TICKETS_BLOCK_END,
    TICKETS_BLOCK_START,
    VERIFY_DEFAULT_VALUE,
    SEPARATOR_ERROR,
    CODE_ERROR,
}
