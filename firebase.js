var admin = require("firebase-admin");
const firebase = admin.initializeApp({
    credential: admin.credential.cert(
        {
            "type": "service_account",
            "project_id": "car-rental-seller-f4210",
            "private_key_id": "bd0f1a7ec1e17b50f29023bacc622b328ec16032",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCVTSV+6tJtSeg+\n8V0A2DYwrwfKmEmdduq+ZVC0QiNw8V+qwErU6+cvRH6TYf1lo8Igq8FsVnrT6ReJ\nU4eiigxz1y6iW1aQgzwJAHdVzI7icSLqsrVt0F9Vpi5omQ6dD6ujIHAuJeDTW0D7\nUTahIKQyzpxQrbjPYnDoloTtzPN90x2PwlR2DutpeV+mQpkXMdQNvA1d/FKi6QSc\nJCWHXABoo/1SN5kQ9u5neKt1pROwbjPmNbJIuHh6M7PdhPoW0q8XmPclbYRi8M7i\neBNj2fGtsAg1yTzJL/eigRNyOnMF7QY0emoQv9EBYxUp68It2GpciwS+JaiW1BLk\n3L2Jqtn/AgMBAAECggEADPpj8tiKX89SXbz7ts8/RVPEVh3kcZ3SLFMV761mHkhl\nEVczdLcS5V7LWpgPKll7TlK6drvnuRRPJElQsNYrh0WiZfY8RptEdIsyqbslL9WM\n0aD6OL2puSy/u6jpBnRubjjWIjTPCnWpZuSO3p+964qz4ibPuftBJv6v4b9J6oXK\n8cbdGzBvGi7YmVk6bL/37aueOWT3NAHtLsDiXjykS0x67MKZn/JrrW28z89Y7gKf\ntrJ8+6+vE7nhfQSAkORhIW6D1AQkhC2P55mdFTHJwH39Uba8NVEGQOEv5o92IANt\nvFDEBto9DC2Mr934v92usduQSJGGGUwAec7ssPR7kQKBgQDOefyEH+rEQszyNlxM\neaS1lUAwdd3X8egXRPvRdL0NG0+Vy0+HOyBY2yoEoR30HO3X7KpZlQVSChXn4+QF\n5ShrymAkgHMr8Ilo2tEoyc5MQPu1sVnDFNNce7V5XK5BuJZq8m5bSVT+BhqCWwXS\nG8DLu4oGqIPASd/etXv6tYuxkQKBgQC5HIHGzrLUoETAiEVWNeSvq+9VevNR9P7O\nd80q8TWpOcb0Uc33X2WGIkYtfXCVg0yS8tUFPuKqvLx9klkvctGt6KVXky00nCl8\nfcD23P4o8X+Bz+e1YP4hPbk1wCpixYsDu830PPvRk8nk2jUv1iBm8yrh9nwQECoO\nbmwCpwMKjwKBgE2h3gjLe1i5iRdUyxVR81T2vgC6gGPOJ6aAIHJbgy1nZF/85nUB\nDSN7m+vLrFh5fA/ggxhViH+VHTFoJPb2d2E34Tg4N5WAxhlvlI7Secd/82QYP5iy\nvtmaBdyQtVAumBez+TxHcTZlkxgKI0EhgDbZ14azW340CIFTGT9lfRWRAoGAFskW\nhGU/CAMuU1Cy0DjUDHeqfygiOU1h7AI9I/MK+uicv8guBSwd8BPZ9ZGCQTUnQNNZ\nO0sRVZjjzsUr6zZD7xc6+vunzdkHFkbYcMqlEl8fpdf0mpP01Byn5qDf1sagJPaC\nFHVJPfPmHyBo+Zlu5Z07AxN3E/cZZitbajwqmKsCgYBQc9whxKypwOSu37NfycgJ\n93R8k2J9n8QvGjseRCRY3cNwljLUHFAFFQZspeecH/CBJnTjCqkGCJZwDWnjLLT5\ne0kSh7k1588ItjKp0D8PF/SFot6BY8yRYm7oOj0enhHuDDn/F2KrNSGML+MBljS0\nVzPlnoxxpY9jmEGSEYuQLA==\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-j0ewk@car-rental-seller-f4210.iam.gserviceaccount.com",
            "client_id": "112628384427638748877",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-j0ewk%40car-rental-seller-f4210.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
            
          }
    )
});

module.exports = firebase