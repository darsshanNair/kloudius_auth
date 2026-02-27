import * as Keychain from 'react-native-keychain';

const saveCredentials = async (
  email: string,
  password: string,
  name: string,
) => {
  await Keychain.setGenericPassword(email, password, { service: name });
};

const getCredentials = async (name: string) => {
  const credentials = await Keychain.getGenericPassword({ service: name });

  return credentials;
};

const deleteCredentials = async (name: string) => {
  await Keychain.resetGenericPassword({ service: name });
};

const keyChainService = {
  saveCredentials,
  getCredentials,
  deleteCredentials,
};

export default keyChainService;
