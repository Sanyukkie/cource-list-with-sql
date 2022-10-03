import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from'expo-sqlite';
import React, { useState, useEffect } from 'react';

export default function App() {
  
  const [credit, setCredit] = useState('');
  const [title, setTitle] = useState('');
  const [courses, setCourses] = useState([]);

  const db = SQLite.openDatabase('coursedb.db');

  useEffect(() => {  
    db.transaction(tx => {    
      tx.executeSql('create table if not exists course (id integer primary key    not null, credits int, title text);');  
    }, null, updateList);}, []);

  const saveItem = () => {  
    db.transaction(tx => {    
      tx.executeSql('insert into course (credits, title) values (?, ?);',  
      [parseInt(credit), title]);    
    }, null, updateList)}

  const updateList = () => {  
    db.transaction(tx => {    
      tx.executeSql('select * from course;', [], (_, { rows }) =>      
      setCourses(rows._array)    
      );   
    }, null, null);
  }

  const deleteItem = (id) => {  
    db.transaction(
      tx => tx.executeSql('delete from course where id = ?;', [id]), null, updateList) 
    }
  

  return (
    <View style={styles.container}>
      <TextInput  
      style={styles.input}
      placeholder='Product'  
      onChangeText={title => setTitle(title)}  
      value={title}/> 
      <TextInput 
      placeholder='Amount'
      keyboardType='numeric'
      onChangeText={credit => setCredit(credit)}  
      value={credit}/>
      <Button onPress={saveItem} title="Save" />
      <FlatList 
      style={{marginLeft : "5%"}}  
      keyExtractor={item => item.id.toString()}   
      renderItem={({item}) =>
        <View style={styles.list}>
          <Text>{item.title},{item.credits} </Text>
          <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>Bought</Text>
        </View>}        
        data={courses} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    marginTop: 50,
    marginBottom: 5,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1 
  },
});
