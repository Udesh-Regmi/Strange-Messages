import {
    Body,
    Font,
    Head,
    Html,
    Preview,
    Section,
    Text,
    Container,
  } from '@react-email/components';
  
  interface VerificationEmailProps {
    username: string;
    otp: string;
  }
  
  export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Verification Code</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
              format: 'woff2',
            }}
          />
        </Head>
        <Preview>Verify your account with the code below</Preview>
        <Body style={{ backgroundColor: '#f4f4f4', fontFamily: 'Roboto, Verdana, sans-serif', padding: '20px' }}>
          <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <Section style={{ backgroundColor: '#4CAF50', padding: '20px', textAlign: 'center' }}>
              <Text style={{ color: '#ffffff', fontSize: '24px', margin: '0' }}>Welcome to Our Service!</Text>
            </Section>
            <Section style={{ padding: '20px' }}>
              <Text style={{ color: '#333333', fontSize: '16px', lineHeight: '1.5', margin: '10px 0' }}>
                Hi {username},
              </Text>
              <Text style={{ color: '#333333', fontSize: '16px', lineHeight: '1.5', margin: '10px 0' }}>
                Thank you for registering with us. Please use the verification code below to activate your account:
              </Text>
              <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', margin: '20px 0', letterSpacing: '4px' }}>
                {otp}
              </Text>
              <Text style={{ color: '#777777', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
                If you did not create an account, no further action is required.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
  