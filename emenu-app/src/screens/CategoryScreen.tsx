import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { foodItems } from '../data/mockData';
import { FoodItem } from '../types';

export default function CategoryScreen() {
  const route = useRoute();
  const categoryId = route.params?.categoryId;

  const filteredItems = foodItems.filter(item => item.category === categoryId);

  const renderItem = ({ item }: { item: FoodItem }) => (
    <Card style={styles.itemCard}>
      <Card.Cover source={{ uri: item.image }} />
      <Card.Content>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()} تومان</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  itemCard: {
    marginBottom: 16,
    elevation: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
  },
}); 