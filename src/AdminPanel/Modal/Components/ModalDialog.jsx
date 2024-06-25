import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../../ProductForm/Components/ProductForm";
import { removeProductAsync } from "../../../Redux/ProductSlice/removeProduct";

const ModalDialog = ({onClose, openModal, isDelete}) => {
    const dispatch = useDispatch();
    const productDetails = useSelector(state => state?.viewProduct?.data);
    const editStatus = useSelector(state => state.viewProduct.status);
    const handleClose = () => {
        onClose();
    };
    const handleDelete = () => {
        dispatch(removeProductAsync(productDetails?._id))
        onClose();
    };
  return (
    <div>
      <Dialog
        open={openModal}
        onClose={handleClose}
      >
        {/* <DialogTitle>
          Update Product Details
        </DialogTitle> */}
        <DialogContent>
          {isDelete 
           ? 
           <Typography color={"red"}>
            {`Do you want to delete product ${productDetails.title}?`} 
           </Typography>
           : 
           editStatus === 'loading' ? <CircularProgress size={70} /> : <ProductForm isUpdate = {true} initialProductData={productDetails} handleClose={handleClose} />}
        </DialogContent>
        {isDelete && 
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button color="error" onClick={handleDelete}>Delete</Button>
            </DialogActions>
        }
      </Dialog>
    </div>
  )
}

export default ModalDialog
