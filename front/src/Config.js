import { Platform } from 'react-native';

// Colors
export const BLUE = '#0847B7';
export const CYAN = '#B6E7FB';
export const DARK_BLUE = '#001F4A';
export const DARK_CYAN = '#79CBEC';
export const DARK_GREEN = '#00643F';
export const DARK_RED = '#9E0426';
export const PRIMARY_BLUE = '#003580';
export const PRIMARY_YELLOW = '#FDB916';
export const YELLOW = '#FEDC8B';
export const LIGHT_YELLOW = '#FFEEC5';
export const LIGHT_GREEN = '#E1F4F0';
export const GRAY_3 = '#F7F7F7';
export const GRAY_8 = '#EBEBEB';
export const GRAY_12 = '#E0E0E0';
export const GRAY_25 = '#BFBFBF';
export const GRAY_45 = '#737373';
export const GRAY_75 = '#404040';
export const LIGHT_CYAN = '#DBF3FD';
export const PETROL = '#0075A4';

// Header
export const HEADER_HEIGHT = '48px';
export const HEADER_PADDING_TOP = '20px';
export const HEADER_PADDING_BOTTOM = '12px';
export const HEADER_PADDING_HORIZONTAL = '16px';

// Notifications
export const NOTIFICATION_HEIGHT = '90px';
export const NOTIFICATION_RADIUS = '8px';
export const NOTIFICATION_PADDING = '24px';
export const NOTIFICATION_H_MARGIN = '20px';
export const NOTIFICATION_V_MARGIN = '12px';

// Month selector
export const MONTH_SELECTOR_HEIGHT = '56px';
export const MONTH_SELECTOR_PADDING_H = '72px';
export const MONTH_SELECTOR_PADDING_V = '17px';

// Client
export const CUSTOMER_NAME_FONT_SIZE = '14px';

// Buttons
export const BUTTON_BORDER_RADIUS = '6px';
export const BUTTON_HEIGHT = '56px';

// API base url
//export const BASEURL = 'https://smartmoneyapi.azurewebsites.net';
//export const BASEURL = 'http://localhost:3000';
//export const BASEURL = 'https://smserviceprovider.kela.fi/mobile-api';

let _BASEURL = '/api';
if (Platform.OS !== 'web') {
  _BASEURL = 'http://localhost:4000/api';
}
export const BASEURL = _BASEURL;
let _SOCKETBASE = '';
if (Platform.OS !== 'web') {
  _SOCKETBASE = 'http://localhost:4000';
}
export const SOCKETBASE = _SOCKETBASE;
// Fixed therapist Id for demo purposes
//export const therapistId = 'b1984a5e-3204-4f2a-8049-444111b4277a';
export const therapistId = '010185-902F';
