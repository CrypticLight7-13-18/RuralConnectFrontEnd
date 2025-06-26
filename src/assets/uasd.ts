// utils/SessionUData.ts
type Role = 'Patient';

interface UserData {
  name: string;
  role: Role;
  reports: Record<string, any>;
  consultations: Record<string, any>;
  appointments: Record<string, any>;
}

const STORAGE_KEY = 'udata';

export class SessionUData {
  private static defaultData: UserData = {
    name: '',
    role: 'Patient',
    reports: {},
    consultations: {},
    appointments: {},
  };

  private static get data(): UserData {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { ...this.defaultData };
  }

  private static set data(value: UserData) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }

  static get name() {
    return this.data.name;
  }

  static set name(value: string) {
    const updated = this.data;
    updated.name = value;
    this.data = updated;
  }

  static get role() {
    return this.data.role;
  }

  static set role(value: Role) {
    const updated = this.data;
    updated.role = value;
    this.data = updated;
  }

  static get reports() {
    return this.data.reports;
  }

  static set reports(value: Record<string, any>) {
    const updated = this.data;
    updated.reports = value;
    this.data = updated;
  }

  static get consultations() {
    return this.data.consultations;
  }

  static set consultations(value: Record<string, any>) {
    const updated = this.data;
    updated.consultations = value;
    this.data = updated;
  }

  static get appointments() {
    return this.data.appointments;
  }

  static set appointments(value: Record<string, any>) {
    const updated = this.data;
    updated.appointments = value;
    this.data = updated;
  }

  // Optional utility
  static reset() {
    this.data = { ...this.defaultData };
  }
}

