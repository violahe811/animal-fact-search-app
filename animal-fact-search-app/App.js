import React, { useState } from 'react';
import {
  View, Text, TextInput, Button,
  StyleSheet, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';

export default function App() {

  // Form state
  const [form, setForm] = useState({ animal: '', amount: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [facts, setFacts] = useState([]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSearch = async () => {

    // Validation
    if (!form.animal.trim() || !form.amount.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setFacts([]);

    try {
      let url = '';

      if (form.animal.toLowerCase() === 'cat') {
        url = `https://catfact.ninja/facts?limit=${form.amount}`;
      } else {
        throw new Error('Only "cat" is supported in this demo');
      }

      const response = await fetch(url);
      const data = await response.json();

      setFacts(data.data);
    } catch (err) {
      setError('Invalid animal or something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>

      <Text style={styles.title}>Animal Fact App</Text>

      <TextInput
        placeholder="Enter animal (cat)"
        value={form.animal}
        onChangeText={(text) => handleChange('animal', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Number of facts"
        value={form.amount}
        onChangeText={(text) => handleChange('amount', text)}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Search" onPress={handleSearch} />

      {loading && <ActivityIndicator size="large" />}

      {facts.map((item, index) => (
        <Text key={index} style={styles.result}>
          • {item.fact}
        </Text>
      ))}

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  result: {
    marginTop: 5
  }
});