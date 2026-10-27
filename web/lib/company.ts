// lib/company.ts

export interface PharmacyUnit {
  id: number;
  slug: string;
  name: string;
  isEcommerceHub?: boolean;
  allowsPickup: boolean;
  pickupReadyTime: string;
  razaoSocial: string;
  cnpj: string;
  stateRegistration: string;
  address: string;
  hours: string;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  legal: {
    farmaceutico: string;
    crf: string;
    afe: string;
    alvara: string;
  };
  services: string[];
}

const defaultServices = [
  "Aferição de pressão",
  "Injetáveis",
  "Teste de glicemia",
  "Farmácia Popular",
  "Furo de lóbulo",
];

const units: PharmacyUnit[] = [
  {
    id: 1,
    slug: "couto-1",
    name: "Couto 1",
    isEcommerceHub: true,
    allowsPickup: true,
    pickupReadyTime: "Pronto em até 1 hora",
    razaoSocial: "Drogaria Couto 1 Ltda",
    cnpj: "18.908.721/0001-60",
    stateRegistration: "86.659.32-8",
    address: "Estrada Marechal Alencastro, 3695, Anchieta, Rio de Janeiro - RJ, CEP: 21625-001",
    hours: "Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h",
    phone: "2455-4000",
    whatsapp: "+55 (21) 96479-2929",
    mapsUrl:
      "https://www.google.com/maps/place/Estr.+Mal.+Alencastro,+3695+-+Anchieta,+Rio+de+Janeiro+-+RJ,+21625-001/@-22.8282963,-43.4032661,17z/data=!3m1!4b1!4m6!3m5!1s0x9963e6dd9bdfa9:0x79c04cd1537a1c8f!8m2!3d-22.8282963!4d-43.4006912!16s%2Fg%2F11q2nfqfdl?entry=ttu&g_ep=EgoyMDI2MTAxMi4wIKXMDSoASAFQAw%3D%3D",
    legal: {
      farmaceutico: "Regis Silva Gonçalves",
      crf: "CRF: 16666",
      afe: "7.37944-6",
      alvara: "04/821.268/2024",
    },
    services: defaultServices,
    coordinates: { lat: -22.8282963, lng: -43.4006912 },
  },
  {
    id: 2,
    slug: "couto-2",
    name: "Couto 2",
    allowsPickup: true,
    pickupReadyTime: "Pronto em até 1 hora",
    razaoSocial: "Drogaria Couto 2 Ltda",
    cnpj: "30.353.450/0001-29",
    stateRegistration: "11.140.41-6",
    address: "Av. Chrisóstomo Pimentel de Oliveira, 894, Anchieta, Rio de Janeiro - RJ, CEP: 21645-522",
    hours: "Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h",
    phone: "3019-3000",
    whatsapp: "+55 (21) 96702-8706",
    mapsUrl:
      "https://www.google.com/maps/place/Av.+Chris%C3%B3stomo+Pimentel+de+Oliveira,+894+-+Anchieta,+Rio+de+Janeiro+-+RJ,+21645-522/@-22.8184667,-43.3933284,17z/data=!3m1!4b1!4m6!3m5!1s0x9963f4461a864f:0xd887106600783f3e!8m2!3d-22.8184667!4d-43.3907535!16s%2Fg%2F11cnddp5zt?entry=ttu&g_ep=EgoyMDI2MTAxMi4wIKXMDSoASAFQAw%3D%3D",
    legal: {
      farmaceutico: "Tássio Trindade Mazala",
      crf: "CRF/RJ: 21510/RJ",
      afe: "7.64798-5",
      alvara: "09/97/143741/2026",
    },
    services: defaultServices,
    coordinates: { lat: -22.8184667, lng: -43.3907535 },
  },
  {
    id: 3,
    slug: "fabris",
    name: "Fabris",
    allowsPickup: true,
    pickupReadyTime: "Pronto em até 1 hora",
    razaoSocial: "Drogaria Fabris Ltda",
    cnpj: "14.234.051/0001-92",
    stateRegistration: "79.483.90-7",
    address: "Rua Japoara, 174, Ricardo de Albuquerque, Rio de Janeiro - RJ, CEP: 21620-390",
    hours: "Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h",
    phone: "2455-2000",
    whatsapp: "+55 (21) 96429-6699",
    mapsUrl:
      "https://www.google.com/maps/place/R.+Japoara,+174+-+Ricardo+de+Albuquerque,+Rio+de+Janeiro+-+RJ,+21620-390/@-22.8394138,-43.4033796,17z/data=!4m6!3m5!1s0x9963da3e2f3ce1:0x24757852e7f7b80f!8m2!3d-22.8394138!4d-43.4008047!16s%2Fg%2F11c43tv7tq?entry=ttu&g_ep=EgoyMDI2MTAxMi4wIKXMDSoASAFQAw%3D%3D",
    legal: {
      farmaceutico: "Claudia Felix Santana",
      crf: "CRF/RJ: 16787/RJ",
      afe: "0.82573-1",
      alvara: "04/820.778/2024",
    },
    services: defaultServices,
    coordinates: { lat: -22.8394138, lng: -43.4008047 },
  },
  {
    id: 4,
    slug: "jaime",
    name: "Jaime (Suruí - Magé)",
    allowsPickup: true,
    pickupReadyTime: "Pronto em até 2 horas",
    razaoSocial: "Drogaria Jaime Almeida Ltda",
    cnpj: "38.714.558/0001-01",
    stateRegistration: "11.832.997",
    address: "Rua Capitao Jose de Paula, 366 - Centro (Suruí), CEP: 25922-440",
    hours: "Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h",
    phone: "2147-1000",
    whatsapp: "+55 (21) 99966-2000",
    mapsUrl:
      "https://www.google.com/maps/place/R.+Cap.+Jos%C3%A9+de+Paula+-+Centro+(Suru%C3%AD),+Mag%C3%A9+-+RJ,+25922-440/@-22.6622079,-43.1371768,16z/data=!3m1!4b1!4m6!3m5!1s0x99a1ce29178e87:0x209af42124dfd1c6!8m2!3d-22.6622668!4d-43.1320158!16s%2Fg%2F11cspt84_v?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D",
    legal: {
      farmaceutico: "Alexsandro da Silva Santos",
      crf: "CRF/RJ: 24112",
      afe: "7.79766-3",
      alvara: "0020201915030",
    },
    services: defaultServices,
    coordinates: { lat: -22.6622381, lng: -43.1288145 },
  },
  {
    id: 5,
    slug: "elza",
    name: "Elza",
    allowsPickup: true,
    pickupReadyTime: "Pronto em até 1 hora",
    razaoSocial: "Drogaria Elza Giagio Ltda",
    cnpj: "47.522.288/0001-28",
    stateRegistration: "12.574.452",
    address: "Avenida Izabel de Paula, 248, Loja 2, Quadra F, Lote 4, Magé - RJ, CEP: 25922-492",
    hours: "Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h",
    phone: "+55 (21) 97260-3300",
    whatsapp: "+55 (21) 98260-2200",
    mapsUrl:
      "https://www.google.com/maps/place/Av.+Isabel+de+Paula+-+Centro+(Suru%C3%AD),+Mag%C3%A9+-+RJ,+25922-492/@-22.659597,-43.1308463,17z/data=!4m6!3m5!1s0x99a1c8d1421edb:0xe6d1880ee89472cd!8m2!3d-22.6595909!4d-43.1283008!16s%2Fg%2F11h2hdbz4_?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D",
    legal: {
      farmaceutico: "Elaine de Araujo Batista",
      crf: "CRF/RJ: 26573",
      afe: "7.93859-1",
      alvara: "0020226367878",
    },
    services: defaultServices,
    coordinates: { lat: -22.8394138, lng: -43.4008047 },
  },
  // {
  //   id: 6,
  //   slug: "catumbi",
  //   name: "Catumbi",
  //   allowsPickup: true,
  //   pickupReadyTime: "Pronto em até 1 hora",
  //   razaoSocial: "Drogaria Catumbi Ltda",
  //   cnpj: "18.908.721/0001-60",
  //   stateRegistration: "86.659.32-8",
  //   address: "Catumbi, Rio de Janeiro - RJ (Drogarias Camargo)", // Ataliuzar com rua e número
  //   hours: "Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h",
  //   phone: "2455-4000",
  //   whatsapp: "+55 (21) 96479-2929",
  //   mapsUrl:
  //     "https://www.google.com/maps/place/Drogaria+Camargo+-+Catumbi/@-22.9180027,-43.2010781,17z/data=!3m1!4b1!4m6!3m5!1s0x997f05a247c1b7:0x420a7d32afc737de!8m2!3d-22.9180027!4d-43.1985032!16s%2Fg%2F11y30fsl2t?entry=ttu&g_ep=EgoyMDI2MTAxMi4wIKXMDSoASAFQAw%3D%3D",
  //   legal: {
  //     farmaceutico: "Regis Silva Gonçalves",
  //     crf: "CRF/RJ: 16666",
  //     afe: "7.37944-6",
  //     alvara: "04/821.268/2024",
  //   },
  //   services: defaultServices,
  //   coordinates: { lat: -22.9180027, lng: -43.1985032 },
  // },
];

const mainUnit = units.find((u) => u.isEcommerceHub) || units[0];

export const companyConfig = {
  name: "Drogarias Camargo",
  razaoSocial: mainUnit.razaoSocial,
  cnpj: mainUnit.cnpj,
  stateRegistration: mainUnit.stateRegistration,
  address: mainUnit.address,
  rhEmail: "fabriscurriculosrh@gmail.com",
  comercialEmail: "comercial@drogariascamargo.com.br",

  contact: {
    emailAtendimento: "contato@drogariascamargo.com.br",
    whatsapp: mainUnit.whatsapp,
    phone: mainUnit.phone,
  },

  legal: mainUnit.legal,

  links: {
    instagram: "https://www.instagram.com/drogariascamargo",
    facebook: "https://www.facebook.com/drogariascamargo",
  },

  mainUnit,
  units,
};