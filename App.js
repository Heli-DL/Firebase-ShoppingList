import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, remove, onValue } from 'firebase/database';
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

ref(database,'items/')

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, snapshot => {
    const data = snapshot.val();
    const products = data ? Object.keys(data).map(key => ({ key, ...data[key]}))
    : [];
    setItems(products);
    })
  }, []);

  const saveItem = () => {
    push(
    ref(database, 'items/'),
    { 'product': product, 'amount': amount });
    setProduct('');
    setAmount('');
  }

  const deleteItem = (key) => {
    remove(ref(database, 'items/' + key));
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };
    
  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{marginTop: 50, paddingHorizontal: 5 , fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5, paddingHorizontal: 5, fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Save" /> 
      <Text style={{marginTop: 20, marginBottom: 5, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={(item, index) => index.toString()} 
        renderItem={({item}) => 
        <View style={styles.listcontainer}>
          <Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
          <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.key)}> delete</Text>
        </View>} 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
   },
   listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
