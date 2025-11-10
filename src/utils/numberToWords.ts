
// Function to convert numbers to Indian currency format words
export function convertToIndianCurrencyWords(num: number | string): string {
  if (!num || isNaN(Number(num))) return '';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  // Handle zero separately
  if (number === 0) return 'Rupees Zero only';
  
  // Array of units and tens for conversion
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  // Function to convert numbers less than 1000
  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    
    let result = '';
    
    // Handle hundreds place - always display as number
    if (n >= 100) {
      result = Math.floor(n / 100).toString() + ' Hundred';
      if (n % 100 !== 0) result += ' ';
    }
    
    // Handle tens and units place - always display as number
    const remainder = n % 100;
    if (remainder > 0) {
      result += remainder.toString();
    }
    
    return result;
  };
  
  // For very large numbers in Indian numbering system
  if (number >= 1000000000) {
    const arab = Math.floor(number / 1000000000);
    const remainder = number % 1000000000;
    
    let result = `${arab} Arab`;
    if (remainder > 0) {
      result += ' ' + convertToIndianCurrencyWords(remainder).replace('Rupees ', '').replace(' only', '');
    }
    
    return `Rupees ${result} only`;
  }
  
  if (number >= 10000000) {
    const crore = Math.floor(number / 10000000);
    const remainder = number % 10000000;
    
    let result = `${crore} Crore`;
    if (remainder > 0) {
      result += ' ' + convertToIndianCurrencyWords(remainder).replace('Rupees ', '').replace(' only', '');
    }
    
    return `Rupees ${result} only`;
  }
  
  if (number >= 100000) {
    const lakh = Math.floor(number / 100000);
    const remainder = number % 100000;
    
    let result = `${lakh} Lakh`;
    if (remainder > 0) {
      result += ' ' + convertToIndianCurrencyWords(remainder).replace('Rupees ', '').replace(' only', '');
    }
    
    return `Rupees ${result} only`;
  }
  
  if (number >= 1000) {
    const thousand = Math.floor(number / 1000);
    const remainder = number % 1000;
    
    let result = `${thousand} Thousand`;
    if (remainder > 0) {
      result += ' ' + convertLessThanThousand(remainder);
    }
    
    return `Rupees ${result} only`;
  }
  
  // For numbers less than 1000
  return `Rupees ${convertLessThanThousand(number)} only`;
}
