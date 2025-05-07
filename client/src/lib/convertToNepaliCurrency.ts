import NepaliDate from "nepali-date-converter";

export  const convertToNepaliFormat = (date: string, needYear:Boolean) => {
    try {
      const [year, month, day] = date.split("/").map(Number);
      const nepaliDate = new NepaliDate(year, month - 1, day); 
      const nepaliMonthNames = [
        "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra",
        "Ashwin", "Kartik", "Mangsir", "Poush", "Magh",
        "Falgun", "Chaitra"
      ];
      return needYear ? `${nepaliMonthNames[nepaliDate.getMonth()]} ${nepaliDate.getDate()}, ${nepaliDate.getYear()}` : `${nepaliMonthNames[nepaliDate.getMonth()]} ${nepaliDate.getDate()}`;
    } catch (error) {
      console.error("Error converting date:", error);
      return "Invalid Date";
    }
  }