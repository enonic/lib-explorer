export function jsonResponse<Body>(
	body :Body,
	status :number = 200 // OK
) :{
	body :Body
	contentType :'text/json; charset=utf-8'
	status :number
} {
	return {
		body,
		contentType: 'text/json; charset=utf-8',
		status
	};
}
