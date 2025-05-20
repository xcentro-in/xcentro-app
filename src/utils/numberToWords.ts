
// Function to convert numbers to Indian currency format words
export function convertToIndianCurrencyWords(num: number | string): string {
  if (!num || isNaN(Number(num))) return '';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  // Handle zero separately
  if (number === 0) return 'Rupees Zero only';
  
  // For very large numbers, use simpler format
  if (number >= 1000000000) {
    const billions = Math.floor(number / 1000000000);
    return `Rupees ${billions} ${billions === 1 ? 'Arab' : 'Arab'} only`;
  }
  
  if (number >= 10000000) {
    const crores = Math.floor(number / 10000000);
    return `Rupees ${crores} ${crores === 1 ? 'Crore' : 'Crore'} only`;
  }
  
  if (number >= 100000) {
    const lakhs = Math.floor(number / 100000);
    return `Rupees ${lakhs} ${lakhs === 1 ? 'Lakh' : 'Lakh'} only`;
  }
  
  if (number >= 1000) {
    const thousands = Math.floor(number / 1000);
    return `Rupees ${thousands} ${thousands === 1 ? 'Thousand' : 'Thousand'} only`;
  }
  
  // For smaller numbers, use more detailed conversion
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (number < 20) {
    return `Rupees ${units[number]} only`;
  }
  
  if (number < 100) {
    const unit = number % 10;
    const ten = Math.floor(number / 10);
    return `Rupees ${tens[ten]}${unit ? ' ' + units[unit] : ''} only`;
  }
  
  if (number < 1000) {
    const hundred = Math.floor(number / 100);
    const remainder = number % 100;
    
    let remainderText = '';
    if (remainder > 0) {
      if (remainder < 20) {
        remainderText = ` and ${units[remainder]}`;
      } else {
        const unit = remainder % 10;
        const ten = Math.floor(remainder / 10);
        remainderText = ` and ${tens[ten]}${unit ? ' ' + units[unit] : ''}`;
      }
    }
    
    return `Rupees ${units[hundred]} Hundred${remainderText} only`;
  }
  
  return '';
}
