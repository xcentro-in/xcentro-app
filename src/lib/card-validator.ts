interface CardType {
  name: string;
  pattern?: RegExp;
  range?: number[][];
  valid_length: number[];
  cvv_length?: number[];
  gaps: number[];
}

interface CardValidationResult {
  card_type: string;
  valid: boolean;
  luhn_valid: boolean;
  length_valid: boolean;
  cvv_length: number[];
  gaps: number[];
  supported_lengths: number[];
  max_length: number | null;
}

const cardTypes: CardType[] = [
  {
    name: 'amex',
    pattern: /^3[47]/,
    valid_length: [15],
    cvv_length: [4],
    gaps: [4, 10],
  },
  {
    name: 'diners_carte',
    pattern: /^30[0-5]/,
    valid_length: [14],
    cvv_length: [3],
    gaps: [4, 10],
  }, {
    name: 'diners',
    pattern: /^3([689]|09)/,
    valid_length: [14],
    cvv_length: [3],
    gaps: [4, 10],
  },
  {
    name: 'jcb',
    pattern: /^35(2[89]|[3-8][0-9])/,
    valid_length: [16],
    cvv_length: [3],
    gaps: [4, 8, 12],
  },
  {
    name: 'visa',
    pattern: /^4/,
    valid_length: [16],
    cvv_length: [3],
    gaps: [4, 8, 12],
  },
  {
    name: 'mastercard',
    range: [
      [222100, 272099],
      [510000, 559999],
    ],
    valid_length: [16],
    cvv_length: [3],
    gaps: [4, 8, 12],
  },
  {
    name: 'maestro',
    pattern: /^(5018|5081|5044|5020|5038|603845|6304|6759|676[1-3]|6220|504834|504817|504645)\d*/,
    valid_length: [12, 13, 14, 15, 16, 17, 18, 19],
    cvv_length: [0, 3],
    gaps: [4, 8, 12, 16],
  },
  {
    name: 'rupay',
    range: [
      [508500, 508999],
      [606985, 607384],
      [607385, 607484],
      [607485, 607984],
      [608001, 608100],
      [608101, 608200],
      [608201, 608300],
      [608301, 608350],
      [608351, 608500],
      [652150, 652849],
      [652850, 653049],
      [653050, 653149],
      [817200, 819899],
      [819900, 820199],
    ],
    valid_length: [16],
    cvv_length: [3],
    gaps: [4, 8, 12],
  },
  {
    name: 'discover',
    pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
    valid_length: [16],
    cvv_length: [3],
    gaps: [4, 8, 12],
  },
  {
    name: 'sodexo',
    pattern: /^(637513)/,
    valid_length: [16],
    cvv_length: [3],
    gaps: [4, 8, 12],
  },
];

class CardValidator {
  private cardNumber: string;
  private card: CardType | null = null;
  private cardType: string = 'unknown';
  private luhnValid: boolean = false;
  private lengthValid: boolean = false;
  private cvvLength: number[] = [];
  private gaps: number[] = [];
  private supportedLengths: number[] = [];
  private maxLength: number | null = null;
  private month: number | null = null;
  private year: number | null = null;

  constructor(cardNumber: string) {
    this.cardNumber = cardNumber;
  }

  private getCardType(number: string): CardType | null {
    for (const cardType of cardTypes) {
      if (cardType.pattern && number.match(cardType.pattern)) {
        return cardType;
      } else if (cardType.range) {
        const bin = number.substring(0, 6);
        if (!/^\d+$/.test(bin)) {
          continue;
        }
        const binNumber = parseInt(bin, 10);
        for (const range of cardType.range) {
          if (range[0] <= binNumber && binNumber <= range[1]) {
            return cardType;
          }
        }
      }
    }
    return null;
  }

  private isValidLuhn(number: string): boolean {
    let sum = 0;
    const digits = number.split('').reverse();

    for (let n = 0; n < digits.length; n++) {
      let digit = parseInt(digits[n], 10);

      if (n % 2 === 1) {
        digit *= 2;
        if (digit < 10) {
          sum += digit;
        } else {
          sum += digit - 9;
        }
      } else {
        sum += digit;
      }
    }

    return sum % 10 === 0;
  }

  private isValidLength(number: string): boolean {
    if (!this.card) {
      return false;
    }
    return this.card.valid_length.includes(number.length);
  }

  private validateCardNumber(number: string): CardValidationResult {
    this.card = this.getCardType(number);

    // Fixed logic bug: only update cardType if we found a valid card
    if (this.card) {
      this.cardType = this.card.name;
      this.luhnValid = this.isValidLuhn(number);
      this.lengthValid = this.isValidLength(number);
      this.cvvLength = this.card.cvv_length || [];
      this.gaps = this.card.gaps;
      this.supportedLengths = this.card.valid_length;
      this.maxLength = this.card.valid_length[this.card.valid_length.length - 1];
    } else {
      // No valid card found
      this.cardType = 'unknown';
      this.luhnValid = false;
      this.lengthValid = false;
      this.cvvLength = [];
      this.gaps = [];
      this.supportedLengths = [];
      this.maxLength = null;
    }

    return {
      card_type: this.cardType,
      valid: this.luhnValid && this.lengthValid,
      luhn_valid: this.luhnValid,
      length_valid: this.lengthValid,
      cvv_length: this.cvvLength,
      gaps: this.gaps,
      supported_lengths: this.supportedLengths,
      max_length: this.maxLength,
    };
  }

  private normalize(number: string): string {
    return number.toString().replace(/[ -]/g, '');
  }

  public getCardDetails(): CardValidationResult {
    if (!this.cardNumber) {
      throw new Error('Invalid cardNumber property set');
    }
    const number = this.normalize(this.cardNumber);
    return this.validateCardNumber(number);
  }

  public setBaseDate(month?: number, year?: number): void {
    const now = new Date();
    const currentMonth = month ?? now.getMonth() + 1;
    const currentYear = year ?? now.getFullYear();

    if (
      isNaN(currentMonth) ||
      isNaN(currentYear) ||
      currentMonth < 1 ||
      currentMonth > 12
    ) {
      throw new Error('Invalid date format. Use MM, YYYY format');
    }

    this.month = currentMonth;
    this.year = currentYear;
  }

  public validateCard(): boolean {
    if (!this.cardNumber) {
      throw new Error('Invalid cardNumber property set');
    }
    return this.getCardDetails().valid;
  }

  public validateCvv(val: string | number): boolean {
    const cvvString = val?.toString() || '';

    if (!this.cardNumber) {
      throw new Error('Invalid cardNumber property set');
    }

    if (!this.card) {
      this.validateCard();
    }

    if (isNaN(Number(cvvString)) && cvvString !== '') {
      throw new Error('CVV should be a number');
    }

    // Maestro cards may not have CVV
    if (this.cardType === 'maestro') {
      return (
        cvvString === '' || this.cvvLength.includes(cvvString.length) || false
      );
    }

    if (!cvvString) {
      throw new Error('CVV should be a number');
    }

    return this.cvvLength.includes(cvvString.length);
  }

  public validateExpiry(val: string): boolean {
    const expiryRegex = /^(0[1-9]|1[0-2])\/2[0-9]{3}$/;

    if (!this.cardNumber) {
      throw new Error('Invalid cardNumber property set');
    }

    if (!val) {
      throw new Error('Expiry should not be empty');
    }

    if (!this.card) {
      this.validateCard();
    }

    if (!this.month || !this.year) {
      this.setBaseDate(this.month ?? undefined, this.year ?? undefined);
    }

    const expiry = val?.toString().split('/') || [undefined, undefined];

    if (
      !expiry[0] ||
      !expiry[1] ||
      isNaN(Number(expiry[0])) ||
      isNaN(Number(expiry[1]))
    ) {
      throw new Error('Expiry should be in MM/YYYY format');
    }

    const expiryMonth = parseInt(expiry[0], 10);
    const expiryYear = parseInt(expiry[1], 10);

    // Check if card is already expired
    if (this.year && expiryYear === this.year && expiryMonth < this.month!) {
      return false;
    }

    return (
      expiryRegex.test(val.toString()) &&
      expiryMonth > 0 &&
      expiryMonth <= 12 &&
      this.year !== null &&
      expiryYear >= this.year
    );
  }
}

export default CardValidator;
