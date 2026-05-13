export type ClientCategory = "Normal" | "Premium" | "Prime Time";
export type AppointmentFor = "individual" | "Family";
export type VisaType = "National Visa" | "Short Term Visa";

export const VISA_SUB_TYPES = [
  "BUSINESS",
  "CULTURAL VISA",
  "DRIVER VISA",
  "INVITATION VISA",
  "PROPERTY OWNER VISA",
  "SAILORS VISA",
  "schengen Visa",
  "Study Visa",
  "TOURISIM VISA",
  "TRANSIT VISA",
] as const;

export type VisaSubType = (typeof VISA_SUB_TYPES)[number];

export function parseVisaSubType(value: string | undefined): VisaSubType {
  const v = (value ?? "").trim();
  return (VISA_SUB_TYPES as readonly string[]).includes(v)
    ? (v as VisaSubType)
    : "TOURISIM VISA";
}

export function parseVisaType(value: string | undefined): VisaType {
  const v = (value ?? "").trim();
  if (v === "National Visa" || v === "Short Term Visa") return v;
  return "Short Term Visa";
}

export function parseClientCategory(value: string | undefined): ClientCategory {
  const v = (value ?? "").trim();
  if (v === "Premium" || v === "Prime Time" || v === "Normal") return v;
  return "Normal";
}

export function parseAppointmentFor(value: string | undefined): AppointmentFor {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "family") return "Family";
  return "individual";
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  passport_number: string;
  phone: string;
  email: string;
  city: string;
  category: ClientCategory;
  appointment_for: AppointmentFor;
  number_of_members: number;
  location: string;
  visa_type: VisaType;
  visa_sub_type: VisaSubType;
  travel_date: string;
  intended_arrival_date: string;
  intended_departure_date: string;
  account_login: string;
  account_password: string;
  otp_password: string;
  card_info: string;
  photo_url: string;
  video_url: string;
  status: "В очереди" | "На паузе" | "Записан" | "Ошибка";
  priority: number;
  created_at: string;
}

export const clients: Client[] = [
  {
    id: "c1",
    first_name: "Анна",
    last_name: "Петрова",
    birth_date: "1992-03-15",
    passport_number: "7523 123456",
    phone: "+7 (916) 123-45-67",
    email: "anna.petrova@mail.ru",
    city: "Москва",
    category: "Normal",
    appointment_for: "individual",
    number_of_members: 1,
    location: "",
    visa_type: "Short Term Visa",
    visa_sub_type: "schengen Visa",
    travel_date: "",
    intended_arrival_date: "",
    intended_departure_date: "",
    account_login: "anna_visa",
    account_password: "********",
    otp_password: "",
    card_info: "",
    photo_url: "",
    video_url: "",
    status: "В очереди",
    priority: 1,
    created_at: "2026-05-10",
  },
  {
    id: "c2",
    first_name: "Дмитрий",
    last_name: "Соколов",
    birth_date: "1985-07-22",
    passport_number: "4512 654321",
    phone: "+7 (917) 234-56-78",
    email: "dmitry.sokolov@gmail.com",
    city: "Санкт-Петербург",
    category: "Premium",
    appointment_for: "individual",
    number_of_members: 1,
    location: "",
    visa_type: "Short Term Visa",
    visa_sub_type: "BUSINESS",
    travel_date: "",
    intended_arrival_date: "",
    intended_departure_date: "",
    account_login: "dima_business",
    account_password: "********",
    otp_password: "",
    card_info: "",
    photo_url: "",
    video_url: "",
    status: "В очереди",
    priority: 2,
    created_at: "2026-05-11",
  },
  {
    id: "c3",
    first_name: "Елена",
    last_name: "Волкова",
    birth_date: "1990-11-08",
    passport_number: "6215 987456",
    phone: "+7 (903) 345-67-89",
    email: "elena.volkova@yandex.ru",
    city: "Москва",
    category: "Normal",
    appointment_for: "Family",
    number_of_members: 4,
    location: "",
    visa_type: "Short Term Visa",
    visa_sub_type: "TOURISIM VISA",
    travel_date: "",
    intended_arrival_date: "",
    intended_departure_date: "",
    account_login: "elena_trip",
    account_password: "********",
    otp_password: "",
    card_info: "",
    photo_url: "",
    video_url: "",
    status: "На паузе",
    priority: 3,
    created_at: "2026-05-12",
  },
  {
    id: "c4",
    first_name: "Максим",
    last_name: "Козлов",
    birth_date: "1988-01-30",
    passport_number: "7823 456789",
    phone: "+7 (925) 456-78-90",
    email: "max.kozlov@mail.ru",
    city: "Казань",
    category: "Prime Time",
    appointment_for: "individual",
    number_of_members: 1,
    location: "",
    visa_type: "National Visa",
    visa_sub_type: "Study Visa",
    travel_date: "",
    intended_arrival_date: "",
    intended_departure_date: "",
    account_login: "max_student",
    account_password: "********",
    otp_password: "",
    card_info: "",
    photo_url: "",
    video_url: "",
    status: "Записан",
    priority: 0,
    created_at: "2026-05-08",
  },
  {
    id: "c5",
    first_name: "Ольга",
    last_name: "Новикова",
    birth_date: "1995-09-12",
    passport_number: "5236 789123",
    phone: "+7 (968) 567-89-01",
    email: "olga.nov@yandex.ru",
    city: "Нижний Новгород",
    category: "Normal",
    appointment_for: "individual",
    number_of_members: 1,
    location: "",
    visa_type: "Short Term Visa",
    visa_sub_type: "TOURISIM VISA",
    travel_date: "",
    intended_arrival_date: "",
    intended_departure_date: "",
    account_login: "olga_spain",
    account_password: "********",
    otp_password: "",
    card_info: "",
    photo_url: "",
    video_url: "",
    status: "В очереди",
    priority: 4,
    created_at: "2026-05-13",
  },
  {
    id: "c6",
    first_name: "Александр",
    last_name: "Морозов",
    birth_date: "1979-04-05",
    passport_number: "8456 321654",
    phone: "+7 (909) 678-90-12",
    email: "alex.morozov@gmail.com",
    city: "Екатеринбург",
    category: "Premium",
    appointment_for: "individual",
    number_of_members: 1,
    location: "",
    visa_type: "Short Term Visa",
    visa_sub_type: "BUSINESS",
    travel_date: "",
    intended_arrival_date: "",
    intended_departure_date: "",
    account_login: "alex_biz",
    account_password: "********",
    otp_password: "",
    card_info: "",
    photo_url: "",
    video_url: "",
    status: "Ошибка",
    priority: 5,
    created_at: "2026-05-09",
  },
  {
    id: "c7",
    first_name: "Ксения",
    last_name: "Лебедева",
    birth_date: "1993-12-18",
    passport_number: "4561 852741",
    phone: "+7 (915) 789-01-23",
    email: "ksenia.leb@mail.ru",
    city: "Москва",
    category: "Normal",
    appointment_for: "individual",
    number_of_members: 1,
    location: "",
    visa_type: "Short Term Visa",
    visa_sub_type: "schengen Visa",
    travel_date: "",
    intended_arrival_date: "",
    intended_departure_date: "",
    account_login: "ksenia_travel",
    account_password: "********",
    otp_password: "",
    card_info: "",
    photo_url: "",
    video_url: "",
    status: "В очереди",
    priority: 6,
    created_at: "2026-05-13",
  },
  {
    id: "c8",
    first_name: "Игорь",
    last_name: "Попов",
    birth_date: "1982-06-25",
    passport_number: "9632 147852",
    phone: "+7 (926) 890-12-34",
    email: "igor.popov@yandex.ru",
    city: "Самара",
    category: "Normal",
    appointment_for: "Family",
    number_of_members: 3,
    location: "",
    visa_type: "Short Term Visa",
    visa_sub_type: "TOURISIM VISA",
    travel_date: "",
    intended_arrival_date: "",
    intended_departure_date: "",
    account_login: "igor_visa",
    account_password: "********",
    otp_password: "",
    card_info: "",
    photo_url: "",
    video_url: "",
    status: "Записан",
    priority: 0,
    created_at: "2026-05-07",
  },
];
