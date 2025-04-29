import axios from 'axios';

export default async function sendSMS(mobile, otp) {
  try {
    const message = `Your astrohawan verification number is ${otp}. Welcome to astrohawan`;

    const smsResponse = await axios.get('https://bulksmsplans.com/api/verify', {
      params: {
        api_id: 'APIX10O3x8K139675',
        api_password: '1bTnrISh',
        sms_type: 'Transactional',
        sms_encoding: 'text',
        sender: 'ATRHWN',
        number: mobile,
        message: message,
      },
    });

    console.log('SMS API Response:', smsResponse.data);
    return smsResponse;
  } catch (error) {
    console.error('SMS Send Error:', error.response?.data || error.message);
    throw error;
  }
}
