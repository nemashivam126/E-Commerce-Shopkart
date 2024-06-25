import Box from "@mui/material/Box";
import '../ProductGrid/ProductGrid.css';
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, CircularProgress } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from '@mui/icons-material/Delete';
import { removeProductAsync } from "../../Redux/ProductSlice/removeProduct";
import { fetchProductsAsync } from "../../Redux/ProductSlice/fetchProducts";
import { viewProductAsync } from "../../Redux/ProductSlice/viewProduct";
import ModalDialog from "../Modal/Components/ModalDialog";

export default function ProductGrid() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state?.getProducts);
  const [open, setOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  function CustomToolbar() {
    return (
      <Box sx={{ textAlign: 'right' }}>
        <GridToolbarQuickFilter />
      </Box>
    );
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress size={70} />
      </Box>
    );
  }

  const handleEdit = (id) => {
    handleClickOpen()
    dispatch(viewProductAsync(id));
    setIsDelete(false);
  };

  const handleDelete = (id) => {
    handleClickOpen();
    dispatch(viewProductAsync(id));
    setIsDelete(true);
    // dispatch(removeProductAsync(id));
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1, headerClassName: 'header-cell' },
    {
      field: "thumbnail",
      headerName: "Image",
      flex: 1,
      headerClassName: 'header-cell',
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Thumbnail"
          style={{ width: 60, height: 60 }}
        />
      ),
    },
    { field: "description", headerName: "Description", flex: 2, headerClassName: 'header-cell' },
    { field: "category", headerName: "Category", flex: 1, headerClassName: 'header-cell' },
    { field: "price", headerName: "Price", flex: 1, headerClassName: 'header-cell' },
    { field: "rating", headerName: "Rating", flex: 1, headerClassName: 'header-cell' },
    { field: "stock", headerName: "Stock", flex: 1, headerClassName: 'header-cell' },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      headerClassName: 'header-cell',
      flex: 1,
      renderCell: (params) => (
        <div className="text-center">
          <Button
            title="Update"
            sx={{minWidth: '40px'}}
            className="action-btn"
            onClick={() => handleEdit(params.row?.productId)}
          >
            <BorderColorIcon color="warning" fontSize="small" />
          </Button>
          <Button
            title="Delete"
            sx={{minWidth: '40px'}}
            className="action-btn"
            onClick={() => handleDelete(params.row?.productId)}
          >
            <DeleteIcon color="error" fontSize="small" />
          </Button>
        </div>
      ),
    },
  ];

  const getRowId = (row) => row?.productId;

  return (
    <div className="data-grid-container">
      <DataGrid
        rows={data}
        className="header-cells"
        columns={columns}
        getRowId={getRowId}
        slots={{
          toolbar: CustomToolbar
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        density="comfortable"
        pageSizeOptions={[25, 50, 100]}
        disableRowSelectionOnClick
      />
      <ModalDialog onClose={handleClose} openModal={open} isDelete={isDelete} />
    </div>
  );
}
