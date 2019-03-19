const emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

export const validator = {
    required: value => value ? undefined : 'Required',
    number: value => value && isNaN(Number(value)) ? 'Must be a number' : undefined,
    mobile_number: value => value && value.length < 10 ? 'Enter valid contact #' : undefined,
    email: value => value && !emailRegex.test(value) ? 'Enter valid email id' : undefined,
}