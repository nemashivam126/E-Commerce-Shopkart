import axios from "axios";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { viewProductAsync } from "../../../Redux/ProductSlice/viewProduct";
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, CircularProgress, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { addSnackbarState } from "../../../Redux/Snackbar/SnackbarSlice";
import { getCartCountAsync } from "../../../Redux/CartSlice/cartCount";
import { setBuyNowData, setIsBuyNow } from "../../../Redux/StatesSlice/States";
// import ReactImageMagnify from "react-image-magnify";

export const ProductDetails = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector(state => state.auth)
    const { data: product, status } = useSelector(state => state.viewProduct)
    const [showImg, setShowImg] = useState();
    const [border, setBorder] = useState();
    const [style, setStyle] = useState({objectFit:"contain"});
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const AppTheme = useSelector((state) => state.theme.theme);
    const message = "In Stock";
    const imgHover = (e) => {
        setShowImg(e.target.src)
        setBorder('border-2 border-blue-500')
    }
    const imgZoomIn = () => {
        setStyle({
            transition: "transform 0.5s",
            transform: "scale(1.1)",
            position: "relative",
            zIndex: "1"
        })
    }

    const imgZoomOut = () => {
        setStyle({
            transition: "transform 0.5s",
            transform: "scale(1)",
            position: "relative",
            zIndex: "1"
        })
    }
    const { id } = useParams();
    useEffect(() => {
        dispatch(viewProductAsync(id));
    }, [id]);

    const cartdata = {
        productId: product?._id,
        quantity: quantity,
        productSize: selectedSize,
        productColor: selectedColor,
        productPrice: product?.price,
        amount: product?.price,
        status: 'Pending',
    }

    const handleAddtoCart = async () => {
        if((product?.availableSizes?.length > 0 && !selectedSize) || (product?.availableColors?.length > 0 && !selectedColor)) {
            dispatch(
                addSnackbarState({
                    snackbarOpen: true,
                    snackbarMessage: 'Please select size and color before adding to cart!',
                    snackbarSeverity: "error",
                })
            );
            return;
        }
        try {
            const response = await axios.put(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/user/${user.id}/addtocart`, cartdata, {
                headers: {
                    Token: token
                },
            });
            dispatch(getCartCountAsync(user.id));
            dispatch(
                addSnackbarState({
                    snackbarOpen: true,
                    snackbarMessage: 'Item added to cart!',
                    snackbarSeverity: "success",
                })
            );
            return response.data;      
        } catch (error) {
            dispatch(
                addSnackbarState({
                  snackbarOpen: true,
                  snackbarMessage: 'Something went wrong!',
                  snackbarSeverity: "error",
                })
            );
        }
    }

    const handleBuyNow = () => {
        if((product?.availableSizes?.length > 0 && !selectedSize) || (product?.availableColors?.length > 0 && !selectedColor)) {
            dispatch(
                addSnackbarState({
                    snackbarOpen: true,
                    snackbarMessage: 'Please select size and color before adding to cart!',
                    snackbarSeverity: "error",
                })
            );
            return;
        }
        // handleAddtoCart();
        // navigate('/cart')
        // navigate('/user-address', { state: { cartdata } });
        dispatch(setBuyNowData(cartdata));
        dispatch(setIsBuyNow(true));
        navigate('/user-address');
    }

    if(status === 'loading') {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Typography><CircularProgress size={70} /></Typography>
          </Box>
        );
    }
    if(status === 'failed') {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Typography color="error"><span className="text-6xl">404</span></Typography>
            <Typography color="error"><span className="font-bold">Product Not Found</span></Typography>
          </Box>
        );
    }

    return(
        <>
            <div className="container mx-auto p-4 h-[90vh] overflow-auto">
                {/* <h1 className="my-5 text-2xl font-bold">Product Details</h1> */}
                <div className="p-2">
                    <div className="flex flex-wrap">
                        <div className="w-full sm:w-1/6 mb-3 sm:mb-0">
                            <div className="bg-transparent">
                                <div className="">
                                    <ul className="list-none m-auto p-0 mt-5">
                                        { product.images && product.images.length > 0 ?
                                            product.images.map(image => (
                                                <li key={image} className="mb-2">
                                                    <div className={`bg-white rounded w-24 mx-auto mb-2 flex justify-center ${showImg === image ? border : "border-2 border-gray-300"}`} style={{height:"auto"}}>
                                                        <img src={image} width={'80px'} height={'80px'} style={{objectFit:"contain"}} onMouseOver={imgHover} className="w-20 h-20 object-contain" />
                                                    </div>
                                                </li>
                                            )) : "null"
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-4/12 mb-3 mr-12 sm:mb-0" >
                            <div>
                                <div className="relative p-4 z-50" >
                                    {/* <ReactImageMagnify {...{
                                        smallImage: {
                                            alt: 'Product Image',
                                            isFluidWidth: true,
                                            src: showImg || product.thumbnail
                                        },
                                        largeImage: {
                                            src: showImg || product.thumbnail,
                                            width: 1800,
                                            height: 2300
                                        },
                                        enlargedImageContainerDimensions: {
                                            width: '200%',
                                            height: '100%'
                                        },
                                        lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' },
                                        enlargedImageContainerClassName: 'custom-magnified-image'
                                    }} /> */}
                                    <img onMouseOver={imgZoomIn} onMouseOut={imgZoomOut} src={showImg ? showImg : product.thumbnail} width={'100%'} height={'450px'} style={style} alt={product.title} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-5/12">
                            <div className="mt-3 p-2" style={{boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: AppTheme === 'Dark' ? 'transparent' : 'white', color: AppTheme === 'Dark' ? 'white' : ''}}>
                                <div className="p-4">
                                    <h5 className={`text-3xl ${AppTheme === 'Dark' ? 'text-gray-200' : 'text-gray-700'} font-bold`}>{product.title}</h5>
                                    <h5 className={`${AppTheme === 'Dark' ? 'text-gray-200' : 'text-gray-700'} font-medium italic mb-2`}>{product.genericName}</h5>
                                    <span className="flex items-center">
                                        <h4 className={`text-2xl ${AppTheme === 'Dark' ? 'text-gray-200' : 'text-gray-700'} font-bold mr-3`}>₹{product.price}</h4>
                                        <b className="text-green-700">{product.discount} off</b>
                                    </span>
                                    <p className="text-[12px] mb-4">MRP incl. of all taxes</p>
                                    <p className="my-3 mb-4">
                                        <span className={`text-[13px] font-bold pl-1 pr-2 py-1 pb-2 text-gray-300 rounded-sm ${product.rating >= 4 ? 'bg-green-700' : product.rating >= 2.5 && product.rating < 4 ? 'bg-yellow-600' : 'bg-red-500' }`}><span><StarIcon fontSize='small'/></span> <span>{parseFloat(product.rating).toFixed(1)}</span></span>
                                    </p>
                                    <p className={`mt-3 mb-3 ${product.stock ? (product.stock <= 70 && product.stock >= 26 ? "text-yellow-500" : (product.stock <= 25 ? "text-red-500" : "text-green-700")) : "text-red-500"}`}>
                                        <span> {product.stock > 71 ? <LocalMallIcon fontSize="small" /> : (!product.stock ? <CloseIcon /> : <TrendingUpIcon />)}</span>
                                        {product.stock ? (product.stock <= 25 ? "Hurry! Order now, only a few left!" : (product.stock <= 70 && product.stock >= 26 ? "Order now, selling out fast!" : message)) : "Out of Stock"}
                                    </p>
                                    <span className="font-bold text-xl">Description</span><p className="">{product.description}</p>
                                    <Box mt={3} display={"flex"} flexDirection={"column"}>
                                        <FormControl sx={{width:'5vw'}} className="my-4">
                                            <InputLabel>Quantity</InputLabel>
                                            <Select size="small" label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                                {[...Array(10).keys()].map(num => (
                                                    <MenuItem key={num + 1} value={num + 1}>{num + 1}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Box my={2} display={"flex"} flexDirection={"column"}>
                                            {product?.availableSizes?.length > 0 && (
                                                <FormControl component="fieldset" className="my-4">
                                                    {/* <Typography variant="h6">Available Sizes</Typography> */}
                                                    <span className="font-[600] text-xl">Select Size</span>
                                                    <ToggleButtonGroup
                                                        value={selectedSize}
                                                        exclusive
                                                        onChange={(e) => setSelectedSize(e.target.value)}
                                                        aria-label="sizes"
                                                    >
                                                        {product?.availableSizes?.map((size) => (
                                                            <ToggleButton key={size} value={size} 
                                                                sx={{ borderRadius: '15px', '&.Mui-selected': { backgroundColor: '#1976d2',color: '#fff', }}}
                                                            >
                                                                {size}
                                                            </ToggleButton>
                                                        ))}
                                                    </ToggleButtonGroup>
                                                </FormControl>
                                            )}
                                            {product?.availableColors?.length > 0 && (
                                                <FormControl component="fieldset" className="my-4">
                                                    {/* <Typography variant="h6">Available Colors</Typography> */}
                                                    <span className="font-[600] text-xl">Select Color</span>
                                                    <ToggleButtonGroup
                                                        value={selectedColor}
                                                        exclusive
                                                        onChange={(e) => setSelectedColor(e.target.value)}
                                                        aria-label="colors"
                                                    >
                                                        {product?.availableColors?.map((color) => (
                                                            <ToggleButton key={color} value={color} sx={{ borderRadius: '15px', '&.Mui-selected': { backgroundColor: `${color}`,color: '#fff', }}}
                                                            >
                                                                {color}
                                                            </ToggleButton>
                                                        ))}
                                                    </ToggleButtonGroup>
                                                </FormControl>
                                            )}
                                        </Box>
                                    </Box>
                                </div>
                            </div>
                            <div className="my-3 flex">
                                <Button onClick={handleAddtoCart} startIcon={<ShoppingCartIcon />} sx={{mr:1}} fullWidth variant="contained">Add to Cart</Button>
                                <Button onClick={handleBuyNow} startIcon={<LocalMallIcon />} color="warning" fullWidth variant="contained">Buy Now</Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <Button variant="contained" onClick={()=>navigate(-1)} className="bg-gray-300 rounded-full"><ArrowBackIcon /></Button>
                    </div>
                </div>
            </div>
        </>
    )
}
