export default (phoneNumber: string) => {
    const clearNumber = phoneNumber.replace(/\D/g, '');
    const defaultNumber = /^(\+?55)?(\d{2})(\d{8,9})$/;
    const [, country, ddd, number] = defaultNumber.exec(clearNumber);
    return `${country}${ddd}${number.length === 9 ? number : '9' + number}`
}