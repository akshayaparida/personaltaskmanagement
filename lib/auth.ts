import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): TokenPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Test the authentication
async function testAuth() {
  try {
    const testPayload = {
      userId: '123',
      email: 'test@example.com'
    };
    
    console.log('1. Testing token generation...');
    const token = generateToken(testPayload);
    console.log('✓ Token generated successfully:', token);

    console.log('\n2. Testing token verification...');
    const decoded = verifyToken(token);
    console.log('✓ Token verified successfully:', decoded);

    console.log('\n3. Testing invalid token...');
    try {
      verifyToken('invalid-token');
      console.log('✗ Should have thrown an error');
    } catch (error) {
      console.log('✓ Invalid token correctly rejected');
    }

    console.log('\n4. Testing token expiration...');
    const shortLivedToken = jwt.sign(testPayload, process.env.JWT_SECRET ?? 'test-secret-key', { expiresIn: '1s' });
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      verifyToken(shortLivedToken);
      console.log('✗ Should have thrown an error');
    } catch (error) {
      console.log('✓ Expired token correctly rejected');
    }

    console.log('\n✓ All authentication tests passed!');
  } catch (error) {
    console.error('\n✗ Authentication test failed:', error);
  }
}

// Run the test if this file is being run directly
if (require.main === module) {
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret-key';
  testAuth();
}