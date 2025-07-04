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
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Category } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const q = query(collection(db, 'categories'), orderBy('sortOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    const categoriesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
    setCategories(categoriesData);
  };

  const handleOpen = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        icon: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      icon: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await updateDoc(doc(db, 'categories', selectedCategory.id), formData);
        setSnackbar({
          open: true,
          message: 'دسته‌بندی با موفقیت ویرایش شد',
          severity: 'success'
        });
      } else {
        const newSortOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sortOrder || 0)) + 1 : 0;
        await addDoc(collection(db, 'categories'), { ...formData, sortOrder: newSortOrder });
        setSnackbar({
          open: true,
          message: 'دسته‌بندی جدید با موفقیت اضافه شد',
          severity: 'success'
        });
      }
      handleClose();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({
        open: true,
        message: 'خطا در ذخیره دسته‌بندی',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        setSnackbar({
          open: true,
          message: 'دسته‌بندی با موفقیت حذف شد',
          severity: 'success'
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        setSnackbar({
          open: true,
          message: 'خطا در حذف دسته‌بندی',
          severity: 'error'
        });
      }
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedCategories = Array.from(categories);
    const [removed] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, removed);

    setCategories(reorderedCategories);

    const batch = writeBatch(db);
    reorderedCategories.forEach((category, index) => {
      if (category.sortOrder !== index) {
        batch.update(doc(db, 'categories', category.id), { sortOrder: index });
      }
    });

    try {
      await batch.commit();
      setSnackbar({
        open: true,
        message: 'ترتیب دسته‌بندی با موفقیت تغییر یافت',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error reordering category:', error);
      setSnackbar({
        open: true,
        message: 'خطا در تغییر ترتیب دسته‌بندی',
        severity: 'error'
      });
      fetchCategories();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          دسته‌بندی‌ها
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          افزودن دسته‌بندی جدید
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}
            >
              {categories.map((category, index) => (
                <Draggable key={category.id} draggableId={category.id} index={index}>
                  {(providedDraggable) => (
                    <Box
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                      sx={{
                        width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
                        minWidth: 300,
                      }}
                    >
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" component="div">
                                {category.icon} {category.name}
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton onClick={() => handleOpen(category)} size="small">
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(category.id)} size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="نام"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="آیکون"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                helperText="می‌توانید از ایموجی استفاده کنید"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>انصراف</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedCategory ? 'ذخیره تغییرات' : 'افزودن'}
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

export default Categories; 