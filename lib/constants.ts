// Single source of truth for centres, departments, and category mappings

export const CENTRES = [
  'Delhi HQ',
  'Elephant Conservation and Care Centre',
  'Agra Bear Rescue Facility',
  'Bannerghatta Bear Rescue Centre',
  'Manikdoh Leopard Rescue Centre',
  'Elephant Hospital',
  'Dachigam Rescue Centre',
  'Pahalgam Rescue Centre',
  'Elephant Rehabilitation Centre',
  'Wildlife SOS Transit Facility',
  'Human Primate Conflict Mitigation Centre',
  'Van Vihar Bear Rescue Facility',
  'West Bengal Bear Rescue Centre',
] as const;

export const CENTRE_CODES: Record<string, string> = {
  'Delhi HQ': 'DHQ',
  'Elephant Conservation and Care Centre': 'ECCC',
  'Agra Bear Rescue Facility': 'ABRF',
  'Bannerghatta Bear Rescue Centre': 'BBRC',
  'Manikdoh Leopard Rescue Centre': 'MLRC',
  'Elephant Hospital': 'EH',
  'Dachigam Rescue Centre': 'DRC',
  'Pahalgam Rescue Centre': 'PRC',
  'Elephant Rehabilitation Centre': 'ERC',
  'Wildlife SOS Transit Facility': 'TSF',
  'Human Primate Conflict Mitigation Centre': 'HPCMC',
  'Van Vihar Bear Rescue Facility': 'VVBRF',
  'West Bengal Bear Rescue Centre': 'WBBRC',
};

export const DEPARTMENTS = [
  'veterinary',
  'audio-visual',
  'vehicles',
  'furniture',
  'machinery',
] as const;

export const DEPARTMENT_LABELS: Record<string, string> = {
  'veterinary': 'Veterinary',
  'audio-visual': 'Audio Visual Production',
  'vehicles': 'Vehicles',
  'furniture': 'Furniture',
  'machinery': 'Machinery',
};

export const DEPARTMENT_CODES: Record<string, string> = {
  'veterinary': 'VET',
  'audio-visual': 'AVP',
  'vehicles': 'VEH',
  'furniture': 'FUR',
  'machinery': 'MAC',
};

export const CATEGORIES = [
  'medicine',
  'medical-supplies',
  'medical-equipment',
  'av-equipment',
  'vehicle',
  'furniture',
  'machinery',
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  'medicine': 'Medicine',
  'medical-supplies': 'Medical Supplies',
  'medical-equipment': 'Medical Equipment',
  'av-equipment': 'AV Equipment',
  'vehicle': 'Vehicle',
  'furniture': 'Furniture',
  'machinery': 'Machinery',
};

export const DEPARTMENT_CATEGORIES: Record<string, string[]> = {
  'veterinary': ['medicine', 'medical-supplies', 'medical-equipment'],
  'audio-visual': ['av-equipment'],
  'vehicles': ['vehicle'],
  'furniture': ['furniture'],
  'machinery': ['machinery'],
};

export const MEDICINE_TYPES = [
  'tablet',
  'capsule',
  'bolus',
  'syrup',
  'powder',
] as const;

export type Centre = typeof CENTRES[number];
export type Department = typeof DEPARTMENTS[number];
export type Category = typeof CATEGORIES[number];
export type MedicineType = typeof MEDICINE_TYPES[number];
