import React, { useState } from 'react';
import { categories } from '../categories';
import { foodItems } from '../foodItems';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button, Box, Typography, Card, CardContent, Divider, Alert } from '@mui/material';

const ImportData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      // Add categories
      for (const category of categories) {
        const { id, ...categoryData } = category;
        await addDoc(collection(db, 'categories'), categoryData);
      }
      // Add food items
      for (const item of foodItems) {
        const { id, ...itemData } = item;
        await addDoc(collection(db, 'menuItems'), itemData);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error uploading data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Import Initial Data</Typography>
      <Button variant="contained" color="primary" onClick={handleImport} disabled={loading} sx={{ mb: 2 }}>
        {loading ? 'Uploading...' : 'Import Initial Data'}
      </Button>
      {success && <Alert severity="success">Data uploaded successfully!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h5">Categories</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        {categories.map((cat) => (
          <Card key={cat.id} sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h2" align="center">{cat.icon}</Typography>
              <Typography variant="h6" align="center">{cat.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Typography variant="h5">Food Items</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {foodItems.slice(0, 10).map((item) => (
          <Card key={item.id} sx={{ minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6">{item.name}</Typography>
              <Typography color="textSecondary">{item.category}</Typography>
              <Typography>{item.price} تومان</Typography>
            </CardContent>
          </Card>
        ))}
        {foodItems.length > 10 && (
          <Typography sx={{ mt: 2 }}>...و {foodItems.length - 10} مورد دیگر</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImportData; 