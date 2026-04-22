const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const bengaliMonths = [
  "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
  "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র",
];

const bengaliDays = [
  "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার",
];

const gregorianMonths = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

export function toBengaliDigits(num: number | string): string {
  return String(num)
    .split("")
    .map((d) => {
      const n = parseInt(d);
      return isNaN(n) ? d : bengaliDigits[n];
    })
    .join("");
}

// Convert Gregorian date to Bengali calendar (approximate)
// Bengali months start on these Gregorian dates (approximately):
// Boishakh: Apr 14, Jyoishtho: May 15, Asharh: Jun 15, Shraban: Jul 16,
// Bhadro: Aug 16, Ashwin: Sep 16, Kartik: Oct 16, Ogrohayon: Nov 15,
// Poush: Dec 15, Magh: Jan 15, Falgun: Feb 13, Choitro: Mar 15
function toBengaliCalendar(date: Date): { day: number; month: string; year: number } {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1; // 1-12
  const gDay = date.getDate();

  let bYear: number;
  let bMonth: string;
  let bDay: number;

  if (gMonth === 4 && gDay >= 14) {
    bYear = gYear - 593; bDay = gDay - 13; bMonth = bengaliMonths[0];
  } else if (gMonth === 5 && gDay < 15) {
    bYear = gYear - 593; bDay = gDay + 17; bMonth = bengaliMonths[0];
  } else if (gMonth === 5 && gDay >= 15) {
    bYear = gYear - 593; bDay = gDay - 14; bMonth = bengaliMonths[1];
  } else if (gMonth === 6 && gDay < 15) {
    bYear = gYear - 593; bDay = gDay + 17; bMonth = bengaliMonths[1];
  } else if (gMonth === 6 && gDay >= 15) {
    bYear = gYear - 593; bDay = gDay - 14; bMonth = bengaliMonths[2];
  } else if (gMonth === 7 && gDay < 16) {
    bYear = gYear - 593; bDay = gDay + 16; bMonth = bengaliMonths[2];
  } else if (gMonth === 7 && gDay >= 16) {
    bYear = gYear - 593; bDay = gDay - 15; bMonth = bengaliMonths[3];
  } else if (gMonth === 8 && gDay < 16) {
    bYear = gYear - 593; bDay = gDay + 16; bMonth = bengaliMonths[3];
  } else if (gMonth === 8 && gDay >= 16) {
    bYear = gYear - 593; bDay = gDay - 15; bMonth = bengaliMonths[4];
  } else if (gMonth === 9 && gDay < 16) {
    bYear = gYear - 593; bDay = gDay + 16; bMonth = bengaliMonths[4];
  } else if (gMonth === 9 && gDay >= 16) {
    bYear = gYear - 593; bDay = gDay - 15; bMonth = bengaliMonths[5];
  } else if (gMonth === 10 && gDay < 16) {
    bYear = gYear - 593; bDay = gDay + 15; bMonth = bengaliMonths[5];
  } else if (gMonth === 10 && gDay >= 16) {
    bYear = gYear - 593; bDay = gDay - 15; bMonth = bengaliMonths[6];
  } else if (gMonth === 11 && gDay < 15) {
    bYear = gYear - 593; bDay = gDay + 16; bMonth = bengaliMonths[6];
  } else if (gMonth === 11 && gDay >= 15) {
    bYear = gYear - 593; bDay = gDay - 14; bMonth = bengaliMonths[7];
  } else if (gMonth === 12 && gDay < 15) {
    bYear = gYear - 593; bDay = gDay + 16; bMonth = bengaliMonths[7];
  } else if (gMonth === 12 && gDay >= 15) {
    bYear = gYear - 593; bDay = gDay - 14; bMonth = bengaliMonths[8];
  } else if (gMonth === 1 && gDay < 15) {
    bYear = gYear - 594; bDay = gDay + 17; bMonth = bengaliMonths[8];
  } else if (gMonth === 1 && gDay >= 15) {
    bYear = gYear - 594; bDay = gDay - 14; bMonth = bengaliMonths[9];
  } else if (gMonth === 2 && gDay < 13) {
    bYear = gYear - 594; bDay = gDay + 17; bMonth = bengaliMonths[9];
  } else if (gMonth === 2 && gDay >= 13) {
    bYear = gYear - 594; bDay = gDay - 12; bMonth = bengaliMonths[10];
  } else if (gMonth === 3 && gDay < 15) {
    bYear = gYear - 594; bDay = gDay + 16; bMonth = bengaliMonths[10];
  } else if (gMonth === 3 && gDay >= 15) {
    bYear = gYear - 594; bDay = gDay - 14; bMonth = bengaliMonths[11];
  } else {
    // Apr 1-13
    bYear = gYear - 594; bDay = gDay + 17; bMonth = bengaliMonths[11];
  }

  return { day: Math.max(1, bDay), month: bMonth, year: bYear };
}

export function getFormattedBengaliDate(date: Date = new Date()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let period: string;
  if (hours >= 6 && hours < 12) period = "পূর্বাহ্ণ";
  else if (hours >= 12 && hours < 15) period = "অপরাহ্ণ";
  else if (hours >= 15 && hours < 18) period = "বিকাল";
  else if (hours >= 18 && hours < 20) period = "সন্ধ্যা";
  else period = "রাত";

  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

  const dayName = bengaliDays[date.getDay()];
  const gMonth = gregorianMonths[date.getMonth()];
  const gDay = date.getDate();
  const gYear = date.getFullYear();

  const bengali = toBengaliCalendar(date);

  const timePart = `${toBengaliDigits(displayHours)}:${toBengaliDigits(String(minutes).padStart(2, "0"))} ${period}`;
  const gregorianPart = `${dayName}, ${toBengaliDigits(gDay)} ${gMonth} ${toBengaliDigits(gYear)}`;
  const bengaliPart = `${toBengaliDigits(bengali.day)} ${bengali.month} ${toBengaliDigits(bengali.year)} বঙ্গাব্দ`;

  return `${timePart}, ${gregorianPart}, ${bengaliPart}`;
}

export function formatBengaliDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const dayName = bengaliDays[date.getDay()];
  const gMonth = gregorianMonths[date.getMonth()];
  const gDay = date.getDate();
  const gYear = date.getFullYear();

  return `${dayName}, ${toBengaliDigits(gDay)} ${gMonth} ${toBengaliDigits(gYear)}`;
}
