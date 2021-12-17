export const BOOLEANS = [
	false,
	true
];

export const DATE_OBJECTS = [
	new Date()
];

export const EMPTY_ARRAY = [];

export const EMPTY_OBJECT = {};

export const EMPTY_STRING = '';

export const FLOATS = [
	-0.1,
	-0.0,
	0.0,
	0.1
];

export const GEOPOINT_ARRAYS = [
	[59.9090442,10.7423389],
	[-90,-180],
	[90,-180],
	[0,0],
	[-90,180],
	[90,180]
];

export const GEOPOINT_STRINGS = [
	'59.9090442,10.7423389',
	'-90,-180',
	'90,-180',
	'0,0',
	'-90,180',
	'90,180'
];

export const INFINITIES = [
	-Infinity,
	Infinity
];

export const INTEGERS = [
	-1,
	-0,
	0,
	1
];

export const INSTANT_STRINGS = [
	'2011-12-03T10:15:30Z',
	'2011-12-03T10:15:30.1Z',
	'2011-12-03T10:15:30.12Z',
	'2011-12-03T10:15:30.123Z',
	'2011-12-03T10:15:30.1234Z',
	'2011-12-03T10:15:30.12345Z',
	'2011-12-03T10:15:30.123456Z',
	'2011-12-03T10:15:30.1234567Z',
	'2011-12-03T10:15:30.12345678Z',
	'2011-12-03T10:15:30.123456789Z',
	new Date().toJSON(),
	new Date().toISOString()
];

export const LOCAL_DATE_STRINGS_VALID = [
	'2011-12-03',
	'0000-01-01',
	'9999-12-31'
];

export const LOCAL_DATE_TIME_STRINGS_VALID = [
	'2007-12-03T10:15:30',
	'0000-01-01T00:00:00', // min
	'9999-12-31T23:59:59', // max
	'0000-01-01T00:00', // Surprise, this is allowed
	'0000-01-01T00:00:00.', // Surprise, also allowed
	'0000-01-01T00:00:00.0',
	'0000-01-01T00:00:00.1',
	'0000-01-01T00:00:00.12',
	'0000-01-01T00:00:00.123',
	'0000-01-01T00:00:00.1234',
	'0000-01-01T00:00:00.12345',
	'0000-01-01T00:00:00.123456',
	'0000-01-01T00:00:00.1234567',
	'0000-01-01T00:00:00.12345678',
	'0000-01-01T00:00:00.123456789',
	'0000-01-01T00:00:00.000000000',
	new Date() // Not a localDateTimeString, but lib-value.localDateTime() supports it
];

export const TIME_STRINGS = [
	'00:00',
	'00:00:00',
	'00:00:00.', // Allowed
	'00:00:00.1',
	'00:00:00.12',
	'00:00:00.123',
	'00:00:00.1234',
	'00:00:00.12345',
	'00:00:00.123456',
	'00:00:00.1234567',
	'00:00:00.12345678',
	'00:00:00.123456789'
];

export const UUIDV4 = [
	'c51c80c2-66a1-442a-91e2-4f55b4256a72'
];

//──────────────────────────────────────────────────────────────────────────────
// Invalid
//──────────────────────────────────────────────────────────────────────────────
export const INVALID_INSTANT_STRINGS = [
	'2011-12-03T10:15Z', // java.time.format.DateTimeParseException: Text '2011-12-03T10:15Z' could not be parsed at index 16
	'2011-12-03T10:15:30', // java.time.format.DateTimeParseException: Text '2011-12-03T10:15:30' could not be parsed at index 19
	'2011-12-03T10:15:30.1234567890Z', // java.time.format.DateTimeParseException: Text '2011-12-03T10:15:30.1234567890Z' could not be parsed at index 29
	'2002-12-31T23:00:00+01:00', // java.time.format.DateTimeParseException: Text '2002-12-31T23:00:00+01:00' could not be parsed at index 19
	// Right format, but invalid time
	'2000-00-01T00:00:00Z',
	'2000-01-00T00:00:00Z',
	'2000-13-01T00:00:00Z',
	'2000-01-32T00:00:00Z',

	// Date.parse doesn't allow '2000-01-01T24:00:00Z'
	// For some reason lib-value.instant() does, but I'm sticking with Date.parse
	'2000-01-01T24:00:00Z',

	'2000-01-01T24:00:01Z',
	'2000-01-01T25:00:00Z',
	'2000-01-01T00:60:00Z',
	'2000-01-01T00:00:60Z',
];

export const LOCAL_DATE_STRINGS_INVALID = [
	// Invalid format
	'0000-1-01', // Text '0000-1-01' could not be parsed at index 5 java.time.format.DateTimeParseException
	'0000-01-01T', // Text '0000-01-01T' could not be parsed, unparsed text found at index 10 java.time.format.DateTimeParseException
	// Valid format, but invalid date
	'0000-00-01', // Text '0000-00-01' could not be parsed: Invalid value for MonthOfYear (valid values 1 - 12): 0 java.time.format.DateTimeParseException
	'0000-01-00', // Text '0000-01-00' could not be parsed: Invalid value for DayOfMonth (valid values 1 - 28/31): 0 java.time.format.DateTimeParseException
	'0000-13-01', // Text '0000-13-01' could not be parsed: Invalid value for MonthOfYear (valid values 1 - 12): 13 java.time.format.DateTimeParseException
	'0000-01-32', // Text '0000-01-32' could not be parsed: Invalid value for DayOfMonth (valid values 1 - 28/31): 32 java.time.format.DateTimeParseException
	// localDateString related, but not an actual localDateString
	new Date().toDateString(),
	new Date().toGMTString(),
	new Date().toJSON(),
	new Date().toLocaleDateString(),
	new Date().toLocaleString(),
	new Date().toLocaleTimeString(),
	new Date().toISOString(),
	//new Date().toSource(), // Deprecated
	new Date().toString(),
	new Date().toTimeString(),
	new Date().toUTCString(),
	Date.now(),
	Date.parse('2011-12-03T10:15:30Z'),
	Date.UTC(),
	// Invalid input
	EMPTY_STRING,
	'a',
	true,
	false,
	[],
	{},
	-1,
	1,
	-Infinity,
	Infinity
];

export const LOCAL_DATE_TIME_STRINGS_INVALID = [
	// Invalid format
	'0000-01-01', // Text '0000-01-01' could not be parsed at index 10 java.time.format.DateTimeParseException
	'0000-01-01T', // Text '0000-01-01T' could not be parsed at index 11 java.time.format.DateTimeParseException
	'0000-01-01T00', // Text '0000-01-01T00' could not be parsed at index 13 java.time.format.DateTimeParseException
	'0000-01-01T00:00.1', // Text '0000-01-01T00:00.1' could not be parsed, unparsed text found at index 16 java.time.format.DateTimeParseException
	'2007-12-03T10:15:30Z', // Text '2007-12-03T10:15:30Z' could not be parsed, unparsed text found at index 19 java.time.format.DateTimeParseException
	// Valid format, but invalid date
	'0000-00-01T00:00:00', // Text '0000-00-01T00:00:00' could not be parsed: Invalid value for MonthOfYear (valid values 1 - 12): 0 java.time.format.DateTimeParseException
	'0000-01-00T00:00:00', // Text '0000-01-00T00:00:00' could not be parsed: Invalid value for DayOfMonth (valid values 1 - 28/31): 0 java.time.format.DateTimeParseException
	'0000-01-01T24:00:00', // Text '0000-01-01T24:00:00' could not be parsed: Invalid value for HourOfDay (valid values 0 - 23): 24 java.time.format.DateTimeParseException
	'0000-01-01T00:60:00', // Text '0000-01-01T00:60:00' could not be parsed: Invalid value for MinuteOfHour (valid values 0 - 59): 60 java.time.format.DateTimeParseException
	'0000-01-01T00:00:60', // Text '0000-01-01T00:00:60' could not be parsed: Invalid value for SecondOfMinute (valid values 0 - 59): 60 java.time.format.DateTimeParseException
	'0000-01-01T00:00:00.1234567890', // Text '0000-01-01T00:00:00.1234567890' could not be parsed, unparsed text found at index 29 java.time.format.DateTimeParseException
	// localDateTimeString related, but not an actual localDateTimeString
	new Date().toDateString(),
	new Date().toGMTString(),
	new Date().toJSON(),
	new Date().toLocaleDateString(),
	new Date().toLocaleString(),
	new Date().toLocaleTimeString(),
	new Date().toISOString(),
	//new Date().toSource(), // Deprecated
	new Date().toString(),
	new Date().toTimeString(),
	new Date().toUTCString(),
	Date.now(),
	Date.parse('2011-12-03T10:15:30Z'),
	Date.UTC(),
	// Invalid input
	EMPTY_STRING,
	'a',
	true,
	false,
	[],
	{},
	-1,
	1,
	-Infinity,
	Infinity
];

export const NOT_UUIDV4 = [
	EMPTY_STRING,
	'a',
	true,
	false,
	[],
	{},
	-1,
	1,
	-Infinity,
	Infinity
];

//──────────────────────────────────────────────────────────────────────────────
// Derived
//──────────────────────────────────────────────────────────────────────────────
export const GEOPOINTS = GEOPOINT_ARRAYS.concat(GEOPOINT_STRINGS);

export const NUMBERS = [].concat(
	INTEGERS,
	FLOATS,
	INFINITIES
);

export const STRINGS = [
	EMPTY_STRING,
	'a',
	'true',
	'false',
	'[]',
	'{}',
	'-Infinity',
	'-1',
	'-0.1',
	'-0.0',
	'-0',
	'0',
	'0.0',
	'0.1',
	'1',
	'Infinity',
	'new Date()'
]/*.concat(
	GEOPOINT_STRINGS,
	INSTANT_STRINGS,
	INVALID_INSTANT_STRINGS,
	LOCAL_DATE_STRINGS_VALID
)*/;

//──────────────────────────────────────────────────────────────────────────────
// NOT
//──────────────────────────────────────────────────────────────────────────────
export const NOT_BOOLEANS = [].concat(
	//BOOLEANS,
	DATE_OBJECTS,
	EMPTY_ARRAY,
	EMPTY_OBJECT,
	GEOPOINT_ARRAYS,
	NUMBERS,
	STRINGS
);

export const NOT_DATE_OBJECTS = [].concat(
	BOOLEANS,
	//DATE_OBJECTS,
	EMPTY_ARRAY,
	EMPTY_OBJECT,
	GEOPOINT_ARRAYS,
	NUMBERS,
	STRINGS
);

export const NOT_INTEGERS = [].concat(
	BOOLEANS,
	DATE_OBJECTS,
	EMPTY_ARRAY,
	EMPTY_OBJECT,
	//FLOATS, // -0.0 and 0 becomes 0 which is an integer
	//GEOPOINT_ARRAYS, // Array of integer and floats
	STRINGS
);

export const NOT_NUMBERS = [].concat(
	BOOLEANS,
	DATE_OBJECTS,
	EMPTY_ARRAY,
	EMPTY_OBJECT,
	//GEOPOINT_ARRAYS, // Array of integer and floats
	//NUMBERS,
	STRINGS
);

export const NOT_STRINGS = [].concat(
	BOOLEANS,
	DATE_OBJECTS,
	EMPTY_ARRAY,
	EMPTY_OBJECT,
	GEOPOINT_ARRAYS,
	NUMBERS//,
	//STRINGS
);
