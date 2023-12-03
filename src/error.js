export class ValidationForm extends Error{
    constructor(message){
        super(message);
        this.name = "ValidationForm"
    }
}

export async function ErrorHandling(Schema, body_form){
    Object.keys(body_form).forEach(key => {
        const value = body_form[key];
        const fieldtype = Schema.path(key).instance.toLowerCase()
       
        if ( typeof(value) != fieldtype){
            throw new ValidationForm(`Invalid data type for field: ${key}`);
        }
    });
}
