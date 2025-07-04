import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Category, MenuItem } from '../types';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesQuery = query(collection(db, 'categories'), orderBy('sortOrder', 'asc'));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        
        // Fetch menu items
        const menuItemsQuery = query(collection(db, 'menuItems'), orderBy('sortOrder', 'asc'));
        const menuItemsSnapshot = await getDocs(menuItemsQuery);
        const menuItemsData = menuItemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MenuItem[];

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCategory = ({ item }: { item: Category }) => {
    // Get menu items for this category
    const categoryItems = menuItems
      .filter(menuItem => menuItem.category === item.name)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return (
      <View key={item.id} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <MaterialCommunityIcons name={item.icon as any} size={32} color="#e91e63" />
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
        
        <View style={styles.menuItemsContainer}>
          {categoryItems.map(menuItem => (
            <Card key={menuItem.id} style={styles.menuItemCard}>
              {menuItem.imagePath && (
                <Card.Cover source={{ uri: menuItem.imagePath }} />
              )}
              <Card.Content>
                <Text style={styles.itemName}>{menuItem.name}</Text>
                <Text style={styles.itemDescription}>{menuItem.description}</Text>
                <Text style={styles.itemPrice}>{menuItem.price.toLocaleString()} تومان</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>منوی رستوران</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  menuItemsContainer: {
    gap: 12,
  },
  menuItemCard: {
    marginBottom: 12,
    elevation: 2,
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