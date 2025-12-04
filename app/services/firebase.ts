import { initializeApp, cert, getApps, getApp, ServiceAccount } from 'firebase-admin/app'

import { getAuth } from 'firebase-admin/auth'

const serviceAccount = {
  type: 'service_account',
  project_id: 'payement-da78c',
  private_key_id: '573cbedb4ce613a55ac0eada63c7aac6c1146704',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaTj2CoF93bCeN\ngJ9BSJyryZdx50ViEnqyQbtORD233t+gscGvYwNJn/rGarmVh1V8dryrzXaU6K7I\ny9M4WviyuowLWfB22D6vnY+lQtNnml1KlIbp5IUEGwmpKC5SOy1PO5UOA+kzawyb\nz2dRfL2r4toCZC/btZBER+WCec/F56tVUPHo9/+BTSsRbDaLUdptC3fh97g/eO0s\nKhIcwE++OxAN4JP4DHpUDunI4/k09SRFTmFU7I5D3sbHu+nA6/08EwytbF1FpyVF\nGbLp8Rmjqg8JpH45rC5aYkh2ntsEnUFuWEmXPUXdpvV0xfvo/+bXqrlsR8xNhHAC\nQ41Rphq3AgMBAAECggEAUGVjCsHUFq96i4a0X78Fj9BwmS6iY0FJ9W72s5a3IgmO\n0ufT3Cr7MXicysjQKuzJw0oZJq5GvwVIJUPHOGhsUaoY3C9VuvbdcyB0H9kR8QQs\n2kQDwYx6ni3061qUYI1RnO3k8WHoVprUbGc/9gcZ9PzY6+uIooHlrPfLYrdImOmP\n/sHKmxEL9Vn0QiUacsDo1nUmF7o4VYQ50z1F+GGZWRF/98ElRkrc9ORnuHiehmpX\nGwCx2XkZIeYr3SuhJ1ADJ1j2I2NGEf9nZj3i/PWpky9+X+WAsRaqEqP38+12/MwA\n5p8KvLY7DEWgq5SfjZUVGNGonWS2qa9d4wMvqfKjNQKBgQDz4JYDc6paHhYKWL65\n+e6ciYzjGNg8orW0kymzrS1HMtAD+QNL1EPbKks0Bbv45hl7ZHOc0K7uBEXMk/lm\n1r/wiwJwpoSey4IO/0FsJNt6sK3Nr/cRlZSrv0asAs0EvGgprgWmk4wgxVxo49yJ\nnvzyU9UgQ83fgY48FS3hiYYOMwKBgQDlKD84gXOmXqkg27VCqAo6ic8XaNNz6iTL\naBDlt+lwaOUKbJTOKvEZkWj+isW1S+fN4btTTaSTBDkOs5OwillAMGdEXQ9NcBGW\naBHj2kZ0Q4b5tpgak0lzVDIeJITZPm7vTQyET3Y8xOor0cOS0WPIVV5fmY/zCjZu\nc0fofli1bQKBgFNv5SMtMX0/id7kWeya++4GiXMxDto/+Nbc+omEmFchpVWWnnAV\nIVoccDpOM++GGfXDemKOayr3v0Gs5skuc+DCToVoEzuY+NhUsHdlbMnfJLeYmnkj\nqgfQm0dCdg5Gv4RzC2/gTzLvExy3yL407OmjkOlHCWqMkrMvs9DUEk9NAoGAdK9w\nuboZBH8xCZ02iBF+293uSJJFEcIJKFX+PKrQQD/5WLx/bReqmwVS/EH3eGCFUW1+\n8GUZxw6gax7/tiZMWgYLn2DveNP28KpfabFsrKjx4teaTfXvsb0OpBCeYOyMmmeW\nVw0LPNhcESIHvwvGDm2B15YfGXd6zfT/iaBEVWUCgYEA7lNbkX7ePr5isY758XDo\nbAI6C6mNW3xcJ8Zg8I7rddFDc5UEct9E4g4rTx6u6+SxvsAa2lLS3F+T8QN0eL/4\nkhjlLg3o2YHmDJ3BE0f9rx9zhVMO3g29mOUX9mVYJ3J1mCCR/Q7YeZNB8L/8Uh4x\nqrcD3kuiNCjNbwvqlu1Z038=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-fbsvc@payement-da78c.iam.gserviceaccount.com',
  client_id: '101221668565374549866',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40payement-da78c.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
}

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    })

export const firebaseAdmin = getAuth(app)
