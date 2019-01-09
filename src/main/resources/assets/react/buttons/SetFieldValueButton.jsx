export const SetFieldValueButton = ({children, field, value, onClick, setFieldValue, text}) =>
	<button type="button" onClick={() => setFieldValue(field, value)}>{children||text}</button>;
