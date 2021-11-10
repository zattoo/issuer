const EXPECTED_PATTERN = 'Expected pattern is CODE-XXX [, CODE-XXX]: Title';
const FORMAT_ERROR = `Format is invalid. ${EXPECTED_PATTERN}`;
const REFERENCE_ERROR = `Issuer reference is missing. ${EXPECTED_PATTERN}`;
const SPACE_ERROR = `Title should have space after the separator. ${EXPECTED_PATTERN}`;
const UPPERCASE_ERROR = `Title should start with a capital letter. ${EXPECTED_PATTERN}`;

module.exports = {
    FORMAT_ERROR,
    REFERENCE_ERROR,
    SPACE_ERROR,
    UPPERCASE_ERROR
};
