import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { categories } from '../data/mockData';
import { Category } from '../types';

export default function HomeScreen() {
  const navigation = useNavigation();

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Category', { 
        categoryId: item.id,
        categoryName: item.name 
      })}
    >
      <Card style={styles.categoryCard}>
        <Card.Content style={styles.categoryContent}>
          <MaterialCommunityIcons name={item.icon} size={40} color="#e91e63" />
          <Text style={styles.categoryName}>{item.name}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>منوی رستوران</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  list: {
    paddingBottom: 16,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    elevation: 4,
  },
  categoryContent: {
    alignItems: 'center',
    padding: 16,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
}); 