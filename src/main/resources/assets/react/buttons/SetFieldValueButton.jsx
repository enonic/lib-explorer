export const SetFieldValueButton = ({children, classes, field, value, onClick, setFieldValue, text}) =>
	<button class={classes} type="button" onClick={() => setFieldValue(field, value)}>{children||text}</button>;
