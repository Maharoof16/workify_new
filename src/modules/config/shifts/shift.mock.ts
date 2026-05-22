import { Shift } from "./shift";

export const shifts: Shift[] = [
  {
    id: 1,
    name: "General",
    start_time: "09:00:00",
    end_time: "18:00:00",
    noOfDays: 5,
    days: [
      {
        sunday: 0,
        monday: 1,
        tuesday: 1,
        wednesday: 1,
        thursday: 1,
        friday: 1,
        saturday: 0,
      },
    ],
    active: true,
  },

  {
    id: 2,
    name: "Second Shift (2 PM - 10 PM)",
    start_time: "14:00:00",
    end_time: "22:00:00",
    noOfDays: 5,
    days: [
      {
        sunday: 0,
        monday: 1,
        tuesday: 1,
        wednesday: 1,
        thursday: 1,
        friday: 1,
        saturday: 0,
      },
    ],
    active: true,
  },

  {
    id: 3,
    name: "Afternoon",
    start_time: "02:00:00",
    end_time: "11:00:00",
    noOfDays: 6,
    days: [
      {
        sunday: 0,
        monday: 1,
        tuesday: 1,
        wednesday: 1,
        thursday: 1,
        friday: 1,
        saturday: 1,
      },
    ],
    active: true,
  },

  {
    id: 4,
    name: "Night",
    start_time: "23:00:00",
    end_time: "04:00:00",
    noOfDays: 5,
    days: [
      {
        sunday: 0,
        monday: 1,
        tuesday: 1,
        wednesday: 1,
        thursday: 1,
        friday: 1,
        saturday: 0,
      },
    ],
    active: true,
  },
];
