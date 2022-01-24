const args = process.argv.slice(2);
const agency_arg = args.find(arg => arg.split('=')[0].toLowerCase()==='agency_url');
let agency_url_val;
if(agency_arg){
    agency_url_val = agency_arg.split('=')[1];
    console.log('agency url',agency_url_val);
}

export const AGENCY_URL = agency_url_val || 'http://13.79.168.138:8080';
export const REGISTER_URL = 'http://13.79.168.138';

