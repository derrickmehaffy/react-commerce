export function computeDiscountPercentage(
   price: number | Money,
   compareAtPrice?: number | Money | null
): number {
   if (compareAtPrice == null) {
      return 0;
   }
   const priceCents =
      typeof price === 'number' ? price : convertMoneyToCents(price);
   const compareAtPriceCents =
      typeof compareAtPrice === 'number'
         ? compareAtPrice
         : convertMoneyToCents(compareAtPrice);
   let percentage = 100 - (100 * priceCents) / compareAtPriceCents;
   percentage = Math.round(percentage);
   return percentage;
}

function convertMoneyToCents(money: Money): number {
   if (typeof money.amount === 'number') {
      return money.amount * 100;
   }
   return parseFloat(money.amount) * 100;
}

export type Money<T extends string | number = string | number> = {
   /** Numeric or string representation of money expressed as a decimal number (e.g. 39.99) */
   amount: T;
   /** Country currency code (e.g. usd) */
   currencyCode: string;
};

export function formatMoney(money: Money) {
   let amount: number;
   if (typeof money.amount === 'number') {
      amount = money.amount;
   } else {
      amount = parseFloat(money.amount);
   }
   const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: money.currencyCode,
   });
   return formatter.format(amount);
}

export function multiplyMoney(money: Money, multiplier: number): Money {
   const cents = convertMoneyToCents(money);
   const amount = (cents * multiplier) / 100;
   return {
      ...money,
      amount: amount.toFixed(2),
   };
}