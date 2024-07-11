import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addSnackbarState } from '../../../Redux/Snackbar/SnackbarSlice';
import { fetchProductsAsync } from '../../../Redux/ProductSlice/fetchProducts';
import CloseIcon from '@mui/icons-material/Close';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    genericName: Yup.string().required('Generic Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    rating: Yup.number().required('Rating is required').min(0, 'Rating must be between 0 and 5').max(5, 'Rating must be between 0 and 5'),
    stock: Yup.number().required('Stock is required').min(0, 'Stock cannot be negative'),
    availableSizes: Yup.string().matches(/^[\w]+(,[\w]+)*$/, 'Sizes must be a comma-separated list without space'),
    availableColors: Yup.string().matches(/^[\w]+(,[\w]+)*$/, 'Colors must be a comma-separated list without space'),
    images: Yup.mixed().required('Images are required')
});

function ProductForm({ isUpdate, initialProductData, handleClose }) {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loader, setLoader] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const token = useSelector(state => state.auth.token);

    const formik = useFormik({
        initialValues: {
            title: initialProductData?.title || '',
            genericName: initialProductData?.genericName || '',
            description: initialProductData?.description || '',
            category: initialProductData?.category || '',
            price: initialProductData?.price || '',
            discount: initialProductData?.discount || '',
            rating: initialProductData?.rating || '',
            stock: initialProductData?.stock || '',
            availableSizes: initialProductData?.availableSizes?.join(', ') || '',
            availableColors: initialProductData?.availableColors?.join(', ') || '',
            images: null
        },
        validationSchema: isUpdate ? validationSchema.omit(["images"]) : validationSchema,
        onSubmit: async (values) => {
            setLoader(true);
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });
            if (values.images) {
                Array.from(values.images).forEach(image => {
                    formData.append('images', image);
                });
            }

            try {
                // http://localhost:5000
                const response = await axios({
                    method: isUpdate ? 'put' : 'post',
                    url: isUpdate ? `https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/update-product/${initialProductData._id}` : 'https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/add-product',
                    data: formData,
                    headers: {
                        Token: token
                    }
                });

                dispatch(
                    addSnackbarState({
                        snackbarOpen: true,
                        snackbarMessage: isUpdate ? 'Product updated successfully!' : 'Product added successfully!',
                        snackbarSeverity: 'success',
                    })
                );
                isUpdate && handleClose();
                dispatch(fetchProductsAsync());
            } catch (error) {
                console.error(error);
            } finally {
                formik.resetForm();
                setImagePreviews([]);
                setFormKey(prevKey => prevKey + 1);
                setLoader(false);
            }
        },
        onReset: () => {
            setImagePreviews([]);
            setFormKey(prevKey => prevKey + 1);
        }
    });

    useEffect(() => {
        if (initialProductData) {
            formik.setValues({
                title: initialProductData?.title || '',
                genericName: initialProductData?.genericName || '',
                description: initialProductData?.description || '',
                category: initialProductData?.category || '',
                price: initialProductData?.price || '',
                discount: initialProductData?.discount || '',
                rating: initialProductData?.rating || '',
                stock: initialProductData?.stock || '',
                availableSizes: initialProductData?.availableSizes?.join(', ') || '',
                availableColors: initialProductData?.availableColors?.join(', ') || '',
                images: initialProductData?.images || null
            });
        }
    }, [initialProductData]);

    useEffect(() => {
        if (initialProductData && initialProductData.images) {
            try {
                const previews = initialProductData.images.map(imageData => {
                    if (imageData instanceof Blob || imageData instanceof File) {
                        return URL.createObjectURL(imageData);
                    } else if (typeof imageData === 'string') {
                        return imageData;
                    } else {
                        console.error('Unexpected image data format:', imageData);
                        return null;
                    }
                });
                setImagePreviews(previews.filter(preview => preview !== null));
            } catch (error) {
                console.error('Error creating image previews:', error);
                setImagePreviews([]);
            }
        }
    }, [initialProductData]);

    const handleFileChange = (e) => {
        const files = e.target.files;
        formik.setFieldValue('images', files);

        const previews = Array.from(files).map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    return (
        <div className="p-4 bg-white rounded shadow-md">
            {loader && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-10">
                    <CircularProgress size={70} />
                </div>
            )}
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">{isUpdate ? 'Update Product' : 'Add Product'}</h1>
            <form key={formKey} onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="text"
                            label={<><span>Title</span><span className="text-red-500">*</span></>}
                            name="title"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="text"
                            label={<><span>Generic Name</span><span className="text-red-500">*</span></>}
                            name="genericName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.genericName}
                            error={formik.touched.genericName && Boolean(formik.errors.genericName)}
                            helperText={formik.touched.genericName && formik.errors.genericName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                            <InputLabel><><span>Category</span><span className="text-red-500">*</span></></InputLabel>
                            <Select
                                label={<><span>Category</span><span className="text-red-500">*</span></>}
                                name="category"
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value="Men">Men</MenuItem>
                                <MenuItem value="Women">Women</MenuItem>
                                <MenuItem value="Kids">Kids</MenuItem>
                            </Select>
                            {formik.touched.category && formik.errors.category && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.category}</p>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label={<><span>Price</span><span className="text-red-500">*</span></>}
                            name="price"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.price}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="text"
                            label="Discount"
                            name="discount"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.discount}
                            error={formik.touched.discount && Boolean(formik.errors.discount)}
                            helperText={formik.touched.discount && formik.errors.discount}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label={<><span>Rating</span><span className="text-red-500">*</span></>}
                            name="rating"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.rating}
                            error={formik.touched.rating && Boolean(formik.errors.rating)}
                            helperText={formik.touched.rating && formik.errors.rating}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label={<><span>Stock</span><span className="text-red-500">*</span></>}
                            name="stock"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.stock}
                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                            helperText={formik.touched.stock && formik.errors.stock}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="text"
                            label="Available Sizes"
                            name="availableSizes"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.availableSizes}
                            error={formik.touched.availableSizes && Boolean(formik.errors.availableSizes)}
                            helperText={formik.touched.availableSizes && formik.errors.availableSizes}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="text"
                            label="Available Colors"
                            name="availableColors"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.availableColors}
                            error={formik.touched.availableColors && Boolean(formik.errors.availableColors)}
                            helperText={formik.touched.availableColors && formik.errors.availableColors}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            type="text"
                            label={<><span>Description</span><span className="text-red-500">*</span></>}
                            name="description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="file"
                            onChange={handleFileChange}
                            inputProps={{ multiple: true }}
                            inputRef={fileInputRef}
                            error={formik.touched.images && Boolean(formik.errors.images)}
                            helperText={formik.touched.images && formik.errors.images}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div className="flex space-x-2">
                            {imagePreviews.map((preview, index) => (
                                <img key={index} src={preview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                            ))}
                        </div>
                    </Grid>
                    {!isUpdate && <Grid item xs={12} sm={6}>
                        <Button fullWidth variant="contained" type="reset" startIcon={<RestartAltIcon />} sx={{ bgcolor: 'grey.500', '&:hover': { bgcolor: 'grey.700' } }}>
                            Reset
                        </Button>
                    </Grid>}
                    {isUpdate && <Grid item xs={12} sm={6}>
                        <Button fullWidth variant="contained" onClick={handleClose} startIcon={<CloseIcon />} sx={{ bgcolor: 'grey.500', '&:hover': { bgcolor: 'grey.700' } }}>
                            Cancel
                        </Button>
                    </Grid>}
                    <Grid item xs={12} sm={6}>
                        <Button fullWidth variant="contained" type="submit" startIcon={<AddShoppingCartIcon />} disabled={loader}>
                            {isUpdate ? 'Update Product' : 'Add Product'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default ProductForm;
