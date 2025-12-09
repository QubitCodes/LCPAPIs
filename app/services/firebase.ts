import { initializeApp, cert, getApps, getApp, ServiceAccount } from 'firebase-admin/app'

import { getAuth } from 'firebase-admin/auth'

const serviceAccount = {
  type: 'service_account',
  project_id: 'lcpapp-acbc3',
  private_key_id: 'dc25bc76047210dd5840ac80a03aede699e9942d',
  private_key:
   "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCsMMGA4WuAqf6O\njiXhWPMZQzC+LN/CR7vCp2XDeHa7J2CtslXi988yAaWOO97aJc061foI3zDAd9vg\nBq4WV65UcEZltxaM8N8RNZF+QkxNG7c5KDcCf0qE+Xd5YcfVfiZpZQf/pFkZZHLp\nm9rYRrl7RfoRAsTRKzdHwQl5Xd2ZBV4QBEU7Or0QhB/FKdC25twAWpF+BCIdYwn2\n+rUVUPQ7lphnR6/bsyllVJ+nye2bYU01Cfmz82ktZKbVsex4X/emGCIQaAmAOiCU\nkZqcT7QsWKMJLYDer3tYBppAULXecibyVOtm6/AwMggTMKXGOfeElDWhWJu9SbaG\nLQdrvvUnAgMBAAECggEAEebRv1HwSMSjq/N4WbjTMU2sfCETNFIb4a1gpZVZFrUN\n1pEjX8DuwB6utR5hWWGzuAm2AIUfvurXJ6/aGoWMIMg5cWq7A/Uo49OjaDKBV0Tp\n5B3btj1ApJmBA9QYIAiI+s0fq0LNZpfsYIAtHO4ha4EHcgxNJQfuq92UXBNXrghW\nop8cw5ONrhd+6+nqrMWfILLjSTJviMZ+BwrBxaxkL1dtv8NN7CWm27fXfY5AYGrQ\nE3TCx+ptixdcDePodASDLE5Vcftkf/NCtuvrBACi2q/vhBRyIgFa/Po/pu9zkpFc\n7QgVdNuW8KTeyvb3m+KwjoGMX47z08s2eghvmGa4QQKBgQDaFxDN9Hp1k6rq1OIE\nZIMZj9mW/Wlxi8QS0on/En5jm5NAMsQbr8jSwAmO/A+E9X1mJcBu/+h3BeCSvvJi\nd+ZMNTt9C/0KjoXuFiLm5DvA2RoJ7xroQypKA4//U/kdl1vyn6caVpEtq0bdVk94\nEiL9kK9DzM/KTmQjigf0KBDoQQKBgQDKHyv13qUHkku1WIzVjr0cUc546WeB4Ip6\nHmFjbeqsSdYamQ5O48YBdHqkj1VEKKdy4CPUNQo7y7FFzn9tcxdkSRKIaam+GZiY\nFT5K0djRGnFenqYFweHYvYabLeb4mA7Nh1YfetVKj3IvnBGui4TgxZUR816ECx8g\nAQOEqgjDZwKBgQCFrpXSaQWXhMjD4XIZlzL1PEP4VaWIwE+T6hJElCV9ESQVugiT\noBDNfoFdcAxjR8dyEbn/UEZCjwu1Z+5ThYNZO1gXsn2NNwfJhTAnr8cg0vMvG622\nqVUGwWBG9kZBaUInWs2nS2D6SX7KtdlIlHV2UHXebXEBZUPktPtjIhwbAQKBgQCC\ne0Uh4K2hCayeUZ/5bcBfu+AS5nrPuWksFNjCG39X4gK6APzfqON2pP9XpMBi0+vl\nmRUINYV5vLGgYwKYYahEMXgpYC0Yb+W2qGAiZP4XX364mqqLJPLrvM5c93EYIvHL\ndQcAI4f2LkyEt7gieic6A9OMVxQ5IgTh4EWpKyulGQKBgAI6912o0vriW9e5Siwy\n9OE8UePcCPvqL9siFY3hxALUn4QAGowSGESxpGPU//z8ixdbjj9xwpsWhHZjnCK0\nQCmnwj+jmz6ziW0TwK7wa7qbDR8rDi5OaZIJi/KJ0AHim5n9aQ4jGAexuutGZNCV\n4VGxJqRM4KJo3KOvI+/yXQp1\n-----END PRIVATE KEY-----\n",
  client_email: 'firebase-adminsdk-fbsvc@lcpapp-acbc3.iam.gserviceaccount.com',
  client_id: '111141573951424319141',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40lcpapp-acbc3.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
}

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    })

export const firebaseAdmin = getAuth(app)
