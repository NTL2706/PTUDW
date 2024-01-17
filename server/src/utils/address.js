function getAddressDetails(address) {
    const parts = address.split(',').map(part => part.trim());

    let ward, district, numbers;

    const lastPart = parts[parts.length - 1];
    if (/^\d{5,}/.test(lastPart)) {
        parts.pop();
    }

    ward = parts.find(part => /Phường/i.test(part));

    district = parts.find(part => /Quận/i.test(part));

    if (parts.length > 0) {
        const match = parts.find(part => /\d+/.test(part));
        if (match) {
            numbers = parseInt(match, 10);
        }
    }

    return {
        ward,
        district,
        numbers,
    };
}

export default getAddressDetails;