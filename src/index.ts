const countries: any = { AD: 20,
	AT: 16,
	BA: 16,
	BE: 12,
	BG: 18,
	CH: 17,
	CY: 24,
	CZ: 20,
	CS: 18,
	DE: 18,
	DK: 14,
	EE: 16,
	ES: 20,
	FI: 14,
	FR: 23,
	GB: 18,
	GI: 19,
	GR: 23,
	HR: 17,
	HU: 24,
	IE: 18,
	IS: 22,
	IT: 23,
	LI: 17,
	LT: 16,
	LU: 16,
	LV: 17,
	MK: 15,
	MT: 27,
	MU: 26,
	NL: 14,
	NO: 11,
	PL: 24,
	PT: 21,
	RO: 20,
	SE: 20,
	SI: 15,
	SK: 20,
	TN: 20,
	TR: 22 };

function checkCDVnumbers(numbers: number[]) {
	const x: number[] = [9, 7, 3, 1];
	let sum: number = 0;
	for (let i = 0; i < (numbers.length - 1); i++) {
		sum += numbers[i] * x[i % 4];
	}
	sum = sum % 10 === 0 ? 0 : 10 - (sum % 10);
	return (sum === numbers[numbers.length - 1])
}

export function isValidCDV(accountNumber: string): boolean {
	if (accountNumber.length !== 16 && accountNumber.length !== 24) {
		return false;
	}
	let values: number[] = accountNumber.split('').map(e => {
		return '0123456789'.indexOf(e) >= 0 ? parseInt(e, 10) : 0
	});

	if (checkCDVnumbers(values.slice(0,8)) === false) {
		return false;
	}
	return checkCDVnumbers(values.slice(8,values.length));
}

export function getIBAN(country: string, accountNumber: string): string | null {

	accountNumber = accountNumber.split('').map(e => {
		return '0123456789'.indexOf(e) >= 0 ? e : ''
	}).join('');

	if (country === 'HU') {
		if (accountNumber.length === 16) {
			accountNumber += '0'.repeat(8);
		}
		if (isValidCDV(accountNumber) === false) {
			return null;
		}
	}

	if (countries[country] !== accountNumber.length) {
		return null;
	}

	let letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let newAccountNumber: string = "";
	for (let i = 0; i < accountNumber.length; i++) {
		let index = letters.indexOf(accountNumber.charAt(i));
		if (index >= 0) {
			newAccountNumber += (index + 10).toString();
		} else {
			newAccountNumber += accountNumber.charAt(i);
		}
	}
	newAccountNumber += (letters.indexOf(country.charAt(0)) + 10).toString()
		             +  (letters.indexOf(country.charAt(1)) + 10).toString()
					 +  '00';
	let rest: number = 0,
		count: number = 0,
		part: string = '';
	while (newAccountNumber.length + count > 9) {
		if (count === 0) {
			part = newAccountNumber.substr(0, 9);
			newAccountNumber = newAccountNumber.substr(9, newAccountNumber.length - 9);
		} else {
			part = rest.toString();
			part += newAccountNumber.substring(0, 9 - count);
			newAccountNumber = newAccountNumber.substr(9 - count, newAccountNumber.length - 9 + count);
		}

		rest = parseInt(part, 10) % 97;

		if (rest === 0) {
			count = 0;
		} else if (rest < 10) {
			count = 1;
		} else {
			count = 2;
		}
	}

	if (rest === 0) {
		part = newAccountNumber;
	} else {
		part = rest.toString();
		part += newAccountNumber;
	}

	rest = parseInt(part, 10) % 97;
	let iban: string = (98 - rest).toString();
	if (iban.length < 2) {
		iban = '0' + iban;
	}

	return country + iban + accountNumber;
}
