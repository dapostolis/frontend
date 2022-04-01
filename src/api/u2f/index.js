import {request} from 'constants/alias';

// todo - provide an {options} object
const U2F_TIMEOUT = 60000;

/**
 * Check if browser supports u2f
 *
 * @returns {boolean}
 */
function isSupported() {
  return (typeof window.AuthenticatorAttestationResponse === 'function');
}

/**
 * webauthn converter string to binary
 *
 * @param str
 * @returns {Uint8Array}
 */
export function strToBin(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

/**
 * webauthn converter bin to (base64) str
 *
 * @param bin
 * @returns {string}
 */
export function binToStr(bin) {
  return btoa(new Uint8Array(bin).reduce(
    (s, byte) => s + String.fromCharCode(byte), ''
  ));
}

/**
 * Generate webauthn body for registration purposes
 *
 * @param appUrl
 * @returns {Promise<any>}
 */
export function generateRegistrationWebauthnBody(appUrl, method) {
  return new Promise(async function (resolve, reject) {
    try {

      // STEP 1 - initial request to get the credential options
      const {data: options} = await request[method](appUrl);

      const publicKeyCredentialCreationOptions = {
        challenge: strToBin(options.challenge),
        rp: {
          name: options.rp.name,
          id: options.rp.id,
        },
        user: {
          id: strToBin(options.user.id),
          name: options.user.name,
          displayName: options.user.displayName,
        },
        pubKeyCredParams: options.pubKeyCredParams,
        timeout: U2F_TIMEOUT,
      };

      // optional parameters
      if (options.attestation) {
        publicKeyCredentialCreationOptions.attestation = options.attestation;
      }

      if (options.authenticatorSelection) {
        publicKeyCredentialCreationOptions.authenticatorSelection = {
          authenticatorAttachment: options.authenticatorSelection.authenticatorAttachment,
        };
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });


      // STEP 2 - create credentials object
      const publicKeyCredential = {};

      if ('id' in credential) {
        publicKeyCredential.id = credential.id;
      }

      if ('rawId' in credential) {
        publicKeyCredential.rawId = binToStr(credential.rawId);
      }

      if ('type' in credential) {
        publicKeyCredential.type = credential.type;
      }

      publicKeyCredential.response = {
        clientDataJSON: binToStr(credential.response.clientDataJSON),
        attestationObject: binToStr(credential.response.attestationObject),
      };


      // STEP 3 - Finally register user and enable two factor auth
      let body = {
        data: publicKeyCredential,
        session: options.session.id + ''
      };

      resolve(body);

    } catch (ex) {
      reject(ex);
    }

  });

}

/**
 * Use this function to generate webauthn body for any purposes.
 * Consider that the user is already registered to u2f.
 *
 * @param apiUrl - provide the REST api url
 * @param requestBody - provide the request body if there is any
 * @returns {Promise<any>}
 */
export function generateAuthenticationWebauthnBody(apiUrl, method, requestBody = null) {
  return new Promise(async function (resolve, reject) {

    try {

      if (!isSupported()) {
        throw new Error('NOT_SUPPORTED');
      }

      // STEP 1 - initial request to get the credential options
      const {data:options} = await request[method](apiUrl, requestBody);

      const publicKeyCredentialRequestOptions = {
        challenge: strToBin(options.challenge),
        allowCredentials: [{
          id: strToBin(options.allowCredentials[0].id),
          type: options.allowCredentials[0].type,
          // transports: ['usb', 'ble', 'nfc'],
        }],
        timeout: U2F_TIMEOUT,
      };

      // assertion: {PublicKeyCredential} object
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });


      // STEP 2
      const publicKeyCredential = {};

      if ('id' in assertion) {
        publicKeyCredential.id = assertion.id;
      }
      if ('type' in assertion) {
        publicKeyCredential.type = assertion.type;
      }
      if ('rawId' in assertion) {
        publicKeyCredential.rawId = binToStr(assertion.rawId);
      }
      if (!assertion.response) {
        throw new Error('Get assertion response lacking \'response\' attribute');
      }

      const _response = assertion.response;

      publicKeyCredential.response = {
        clientDataJSON: binToStr(_response.clientDataJSON),
        authenticatorData: binToStr(_response.authenticatorData),
        signature: binToStr(_response.signature),
        userHandle: binToStr(_response.userHandle)
      };

      let webAuthnBody = {
        data: publicKeyCredential,
        session: options.session.id + '',
      };

      resolve(webAuthnBody);

    } catch (ex) {
      reject(ex);
    }

  });
}