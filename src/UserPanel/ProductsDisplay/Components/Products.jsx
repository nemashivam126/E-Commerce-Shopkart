import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardMedia, Button, Grid, Typography, Box, Drawer, List, ListItem, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { fetchProductsAsync } from '../../../Redux/ProductSlice/fetchProducts';
import { shortenDescription } from '../../Utils/shortDescription';

const Products = () => {
  const dispatch = useDispatch();
  const { data: products, status } = useSelector(state => state.getProducts);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRanges, setPriceRanges] = useState([
    { label: 'Below ₹500', value: [0, 500] },
    { label: '₹501 - ₹1000', value: [501, 1000] },
    { label: '₹1001 - ₹2000', value: [1001, 2000] },
    { label: 'Above ₹2000', value: [2001, Infinity] }
  ]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const searchInput = useSelector(state => state.search.searchString);

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      setFilteredProducts(products);

      // Extract unique categories from products
      const uniqueCategories = [...new Set(products.map(product => product.category))];
      setCategories(uniqueCategories);
    }
  }, [status, products]);

  const handlePriceRangeChange = (event) => {
    const { name, checked } = event.target;
    setSelectedPriceRanges(prev =>
      checked ? [...prev, name] : prev.filter(range => range !== name)
    );
  };

  const handleCategoryChange = (event) => {
    const { name, checked } = event.target;
    setSelectedCategories(prev =>
      checked ? [...prev, name] : prev.filter(cat => cat !== name)
    );
  };

  useEffect(() => {
    filterProducts();
  }, [selectedPriceRanges, selectedCategories]);

  const filterProducts = () => {
    if (selectedPriceRanges.length === 0 && selectedCategories.length === 0) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product => {
      const matchesPrice = selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => {
        const [min, max] = priceRanges.find(item => item.label === range).value;
        return product.price >= min && product.price <= max;
      });
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      return matchesPrice && matchesCategory;
    });

    setFilteredProducts(filtered);
  };
  useEffect(() => {
    if (!searchInput.trim()) {
        // If search input is empty, show all products
        setFilteredProducts(products);
        return;
      }
    if (searchInput) {
        const searchTerm = searchInput.trim().toLowerCase();
        const filtered = products.filter(product =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.genericName.toLowerCase().includes(searchTerm) 
        );
        setFilteredProducts(filtered);
      }
  },[searchInput, products])

  if(status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography><CircularProgress size={70} /></Typography>
      </Box>
    );
  }
  return (
    <div style={{ display: 'flex', height: '90vh', overflow: 'auto' }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', top: 64, height: 'auto' },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem>
              <Typography variant="h6">Price Range</Typography>
            </ListItem>
            {priceRanges.map(range => (
              <ListItem key={range.label}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPriceRanges.includes(range.label)}
                      onChange={handlePriceRangeChange}
                      name={range.label}
                    />
                  }
                  label={range.label}
                />
              </ListItem>
            ))}
            <ListItem>
              <Typography variant="h6">Categories</Typography>
            </ListItem>
            {categories.map(category => (
              <ListItem key={category}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={handleCategoryChange}
                      name={category}
                    />
                  }
                  label={category}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          {filteredProducts.map(product => (
            <Grid height={480} item xs={12} mb={1} sm={6} md={3} key={product.productId}>
              <Card component={Link} to={`/product/${product.productId}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.07), 0 16px 32px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.07)' }}>
                <div className='flex justify-center' style={{ height: '400px', overflow: 'hidden' }}>
                  <img height={'80%'} width={'90%'} style={{ objectFit: 'cover' }} src={product.thumbnail} alt={product.title} />
                </div>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {shortenDescription(product.description)}
                  </Typography>
                  <Typography className='flex justify-between items-baseline' variant="body2" color="text.secondary">
                    <span><span className='text-sm'>₹</span><span className='text-xl font-bold text-red-800 mx-1'>{product.price}</span><span className='ml-1 text-green-700 text-sm font-bold'>{product.discount} off</span></span>
                    <span className={`text-[13px] font-bold ${product.rating >= 4 ? 'text-green-700' : product.rating >= 2.5 && product.rating < 4 ? 'text-yellow-500' : 'text-red-500'} mx-2 flex justify-center items-center`}><span><StarIcon fontSize='small' /></span> <span>{parseFloat(product.rating).toFixed(1)}</span></span>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Products;
