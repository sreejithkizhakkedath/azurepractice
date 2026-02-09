export interface ControlConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  validators?: any[];
  errorMessages?: { [key: string]: string };
}