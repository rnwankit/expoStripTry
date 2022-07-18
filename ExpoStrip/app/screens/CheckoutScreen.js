import { useStripe } from "@stripe/stripe-react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [secKey, setSecKey] = useState('')

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`http://192.168.2.92:8080/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { clientSecret } = await response.json();

    return {
      clientSecret,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      clientSecret,
    } = await fetchPaymentSheetParams();

    setSecKey(clientSecret)

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Merchant Name',
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    console.log(secKey);

    const { error } = await presentPaymentSheet({
      clientSecret: secKey
    });

    console.log(error);
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={{marginTop: 100}}>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
  }