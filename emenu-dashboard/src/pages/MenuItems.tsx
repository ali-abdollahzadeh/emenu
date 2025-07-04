import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CardMedia,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { MenuItem as MenuItemType, Category } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const MenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imagePath: '',
    category: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    const q = query(collection(db, 'menuItems'), orderBy('sortOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    const menuItemsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MenuItemType[];
    setMenuItems(menuItemsData);
  };

  const fetchCategories = async () => {
    const q = query(collection(db, 'categories'), orderBy('sortOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    const categoriesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
    setCategories(categoriesData);
  };

  const handleOpen = (item?: MenuItemType) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        imagePath: item.imagePath,
        category: item.category,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        imagePath: '',
        category: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      imagePath: '',
      category: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const menuItemData = {
        ...formData,
        price: parseFloat(formData.price),
        sortOrder: selectedItem ? selectedItem.sortOrder : (menuItems.length > 0 ? Math.max(...menuItems.map(i => i.sortOrder || 0)) + 1 : 0),
      };

      if (selectedItem) {
        await updateDoc(doc(db, 'menuItems', selectedItem.id), menuItemData);
        setSnackbar({
          open: true,
          message: 'آیتم منو با موفقیت ویرایش شد',
          severity: 'success'
        });
      } else {
        await addDoc(collection(db, 'menuItems'), menuItemData);
        setSnackbar({
          open: true,
          message: 'آیتم منو جدید با موفقیت اضافه شد',
          severity: 'success'
        });
      }
      handleClose();
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      setSnackbar({
        open: true,
        message: 'خطا در ذخیره آیتم منو',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این آیتم منو اطمینان دارید؟')) {
      try {
        await deleteDoc(doc(db, 'menuItems', id));
        setSnackbar({
          open: true,
          message: 'آیتم منو با موفقیت حذف شد',
          severity: 'success'
        });
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
        setSnackbar({
          open: true,
          message: 'خطا در حذف آیتم منو',
          severity: 'error'
        });
      }
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceCategoryId = result.source.droppableId;
    const destCategoryId = result.destination.droppableId;

    // Get the source category's items
    const sourceCategory = categories.find(c => c.id === sourceCategoryId);
    if (!sourceCategory) return;

    const sourceItems = menuItems
      .filter(item => item.category === sourceCategory.name)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Reorder the items
    const [movedItem] = sourceItems.splice(result.source.index, 1);
    sourceItems.splice(result.destination.index, 0, movedItem);

    // Update sortOrder for all items in the source category
    const batch = writeBatch(db);
    sourceItems.forEach((item, index) => {
      if (item.sortOrder !== index) {
        batch.update(doc(db, 'menuItems', item.id), { sortOrder: index });
      }
    });

    try {
      await batch.commit();
      setSnackbar({
        open: true,
        message: 'ترتیب آیتم منو با موفقیت تغییر یافت',
        severity: 'success'
      });
      fetchMenuItems(); // Refresh to ensure UI is in sync
    } catch (error) {
      console.error('Error reordering menu item:', error);
      setSnackbar({
        open: true,
        message: 'خطا در تغییر ترتیب آیتم منو',
        severity: 'error'
      });
      fetchMenuItems(); // Refresh to revert changes
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          آیتم‌های منو
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          افزودن آیتم منو جدید
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        {categories.map((category) => {
          const categoryItems = menuItems
            .filter(item => item.category === category.name)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

          if (categoryItems.length === 0) return null;

          return (
            <Box key={category.id} sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {category.icon} {category.name}
              </Typography>
              <Droppable droppableId={category.id}>
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      width: '100%',
                      maxWidth: 800,
                      mx: 'auto'
                    }}
                  >
                    {categoryItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(providedDraggable) => (
                          <Box
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            sx={{
                              width: '100%',
                              cursor: 'grab',
                              '&:active': {
                                cursor: 'grabbing'
                              }
                            }}
                          >
                            <Card 
                              sx={{ 
                                display: 'flex',
                                '&:hover': {
                                  boxShadow: 3,
                                  transform: 'translateY(-2px)',
                                  transition: 'all 0.2s ease-in-out'
                                }
                              }}
                            >
                              {item.imagePath && (
                                <CardMedia
                                  component="img"
                                  sx={{ width: 140, height: 140, objectFit: 'cover' }}
                                  image={item.imagePath}
                                  alt={item.name}
                                />
                              )}
                              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <CardContent sx={{ flex: '1 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box>
                                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                                      {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                      {item.description}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                      {item.price.toLocaleString()} تومان
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <IconButton onClick={() => handleOpen(item)} size="small">
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item.id)} size="small" color="error">
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                </CardContent>
                              </Box>
                            </Card>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          );
        })}
      </DragDropContext>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedItem ? 'ویرایش آیتم منو' : 'افزودن آیتم منو جدید'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="نام"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="توضیحات"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="قیمت"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="آدرس تصویر"
                  value={formData.imagePath}
                  onChange={(e) => setFormData({ ...formData, imagePath: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>دسته‌بندی</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="دسته‌بندی"
                  >
                    <MenuItem value="">
                      <em>بدون دسته‌بندی</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>انصراف</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedItem ? 'ذخیره تغییرات' : 'افزودن'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuItems; 