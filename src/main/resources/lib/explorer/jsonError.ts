export function jsonError(
	message :string = '',
	status :number = 400 // Bad request
) :{
	body :{
		message :string
	}
	contentType :'text/json; charset=utf-8'
	status :number
}{
	//log.error(message);
	return {
		body: {
			message
		},
		contentType: 'text/json; charset=utf-8',
		status
	};
}
