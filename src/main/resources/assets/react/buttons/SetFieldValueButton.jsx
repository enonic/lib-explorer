export const SetFieldValueButton = ({children, field, onClick, setFieldValue, text, value, ...rest}) =>
	<button onClick={() => setFieldValue(field, value)} type="button" {...rest}>{children||text}</button>;
