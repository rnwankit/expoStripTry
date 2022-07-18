import { StripeProvider } from '@stripe/stripe-react-native';
import CheckoutScreen from './app/screens/CheckoutScreen';

function App() {
  return (
    <StripeProvider
      publishableKey="pk_test_51LL18HSDZMLAH51NSW5hNpKXUFDKZpRZ9QZvkLYuHQOhZat6QIBdqSAzMLkZad4HBnXNFIY0MOrr5AItkA9d7GpC0020oTO0fi"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
      <CheckoutScreen />
    </StripeProvider>
  );
}

export default App