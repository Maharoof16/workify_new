export type ShiftDays = {
  sunday: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
};

export type Shift = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  noOfDays?: number;
  days?: ShiftDays[];
  active?: boolean;
};
