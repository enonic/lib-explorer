

//──────────────────────────────────────────────────────────────────────────
// Select
//──────────────────────────────────────────────────────────────────────────
const SELECT_CSS = {
	style: {
		borderTop: '1px solid black'
	},
	label: 'Select using css selector',
	value: 'select'
};

const SELECT_XPATH = {
	label: 'Select using xpath selector',
	value: 'sx'
};

const SELECT_LINKS_CSS = {
	label: 'Select links css selector',
	value: 'sl'
};

const SELECT_LINKS_XPATH = {
	label: 'Select links xpath selector',
	value: 'slx'
};

//──────────────────────────────────────────────────────────────────────────
// Remove
//──────────────────────────────────────────────────────────────────────────
const REMOVE_CSS = {
	label: 'Remove using css selector',
	value: 'remove'
};

const REMOVE_XPATH = {
	label: 'Remove using xpath selector',
	value: 'rmx'
};

//──────────────────────────────────────────────────────────────────────────
// Read
//──────────────────────────────────────────────────────────────────────────
const READ_TEXT = {
	label: 'Read text content',
	value: 'read property textContent'
};

const READ_ATTRIBUTE = {
	label: 'Read attribute',
	value: 'read attribute' // href and many more
};

const READ_ATTRIBUTE_HREF = {
	label: 'Read href attribute',
	value: 'read attribute href'
};

// I know these work: innerHTML, outerHTML, textContent
// I don't know if all listed here works, (textContent is not there)
// https://developer.mozilla.org/en-US/docs/Web/API/Element#Properties
const READ_PROPERTY = {
	label: 'Read property',
	value: 'read property'
};

//──────────────────────────────────────────────────────────────────────────
// Manipulate text
//──────────────────────────────────────────────────────────────────────────
const REPLACE_WHITESPACE = {
	label: 'Replace multiple whitespace with single space',
	value: 'ws'
};

const REPLACE_NEWLINES = {
	label: 'Replace newlines with single space',
	value: 'nl'
};

const TRIM = {
	label: 'Trim',
	value: 'trim'
};

const SANITIZE = {
	label: 'Sanitize',
	value: 'sanitize'
};

const LOWERCASE = {
	label: 'Lowercase',
	value: 'lc'
};

const UPPERCASE_FIRST = {
	label: 'Uppercase first character',
	value: 'ucFirst'
};

//──────────────────────────────────────────────────────────────────────────
// Exports
//──────────────────────────────────────────────────────────────────────────
export const URL_OPTGROUPS = [{
	label: 'Select',
	options: [
		SELECT_LINKS_CSS,
		SELECT_LINKS_XPATH,
		SELECT_CSS,
		SELECT_XPATH,
	]
}, {
	label: 'Remove',
	options: [
		REMOVE_CSS,
		REMOVE_XPATH,
	]
}, {
	label: 'Read',
	options: [
		READ_ATTRIBUTE_HREF,
		READ_TEXT
	]
}];

export const SCRAPE_OPTGROUPS = [{
	label: 'Select',
	options: [
		SELECT_CSS,
		SELECT_XPATH
	]
}, {
	label: 'Remove',
	options: [
		REMOVE_CSS,
		REMOVE_XPATH
	]
}, {
	label: 'Read',
	options: [
		READ_TEXT,
		READ_ATTRIBUTE,
		READ_PROPERTY
	]
}, {
	label: 'Manipulate',
	options: [
		REPLACE_WHITESPACE,
		REPLACE_NEWLINES,
		TRIM,
		SANITIZE,
		LOWERCASE,
		UPPERCASE_FIRST
	]
}];
